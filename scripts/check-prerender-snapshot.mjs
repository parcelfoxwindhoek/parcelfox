#!/usr/bin/env node
/**
 * Build-time prerender snapshot check.
 *
 * Loads the freshly built `dist/index.html` in a jsdom environment, executes
 * the bundled React app, and asserts the homepage body actually renders the
 * key sections (hero, services, contact form). This guarantees Netlify's
 * Prerender extension has meaningful HTML to serve to crawlers.
 *
 * Runs automatically as `postbuild`. Exits non-zero on any missing assertion
 * so a broken prerender surface fails CI before deploy.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JSDOM, ResourceLoader, VirtualConsole } from "jsdom";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "dist");
const indexPath = resolve(distDir, "index.html");
const snapshotPath = resolve(distDir, "prerender-snapshot.html");

// --- Required content ---------------------------------------------------------
// Each assertion is a human-readable label + a predicate run against the
// rendered document. Add new items here as the homepage grows.
const SERVICE_TITLES = [
  "Same-Day Delivery",
  "Gift & Flower Delivery",
  "Medicine & Pharmacy Delivery",
  "Document & Parcel Delivery",
  "Business Courier Solutions",
];

const assertions = [
  {
    label: "Hero <h1> with 'Parcel Deliveries in Windhoek'",
    check: (doc) => {
      const h1 = doc.querySelector("section#home h1");
      return !!h1 && /parcel/i.test(h1.textContent ?? "") && /windhoek/i.test(h1.textContent ?? "");
    },
  },
  {
    label: "Services section (#services) is present",
    check: (doc) => !!doc.querySelector("section#services"),
  },
  ...SERVICE_TITLES.map((title) => ({
    label: `Service card: "${title}"`,
    check: (doc) => (doc.querySelector("section#services")?.textContent ?? "").includes(title),
  })),
  {
    label: "About section (#about) is present",
    check: (doc) => !!doc.querySelector("section#about"),
  },
  {
    label: "Contact form with required inputs",
    check: (doc) => {
      const section = doc.querySelector("section#contact");
      if (!section) return false;
      const form = section.querySelector("form");
      if (!form) return false;
      const inputs = form.querySelectorAll("input, textarea");
      return inputs.length >= 4;
    },
  },
  {
    label: "Footer with phone +264 81 633 6344",
    check: (doc) => /(\+?264\s?81\s?633\s?6344|0816336344)/.test(doc.body.textContent ?? ""),
  },
];

// --- Load the built site in jsdom --------------------------------------------
let html;
try {
  html = readFileSync(indexPath, "utf8");
} catch (err) {
  console.error(`✖ Cannot read ${indexPath}. Did \`vite build\` run first?`);
  console.error(err.message);
  process.exit(1);
}

// Resolve local /assets/* from disk; block all external network (fonts, etc.)
// so the check is hermetic and fast.
class FsLoader extends ResourceLoader {
  fetch(url, options) {
    try {
      const u = new URL(url);
      if (u.hostname === "localhost") {
        const localUrl = pathToFileURL(resolve(distDir, "." + u.pathname)).toString();
        return super.fetch(localUrl, options);
      }
    } catch { /* fall through */ }
    // Block external requests (fonts, analytics) — return empty body.
    return Promise.resolve(Buffer.from(""));
  }
}

const virtualConsole = new VirtualConsole();
const fatalErrors = [];
virtualConsole.on("jsdomError", (err) => {
  const msg = err.message || String(err);
  // Ignore harmless CSS/resource noise from blocked external assets.
  if (/Could not parse CSS|Could not load (link|img|script)/i.test(msg)) return;
  fatalErrors.push(msg);
});

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: new FsLoader(),
  pretendToBeVisual: true,
  virtualConsole,
});

// Poll for React mount. Fail fast on real in-page errors.
const TIMEOUT_MS = 20_000;
const start = Date.now();
await new Promise((resolveWait, rejectWait) => {
  const tick = () => {
    if (fatalErrors.length) {
      return rejectWait(new Error("App threw during render:\n  - " + fatalErrors.join("\n  - ")));
    }
    const root = dom.window.document.getElementById("root");
    if (root && root.querySelector("section#home h1")) return resolveWait();
    if (Date.now() - start > TIMEOUT_MS) {
      const rootHtml = (dom.window.document.getElementById("root")?.innerHTML ?? "").slice(0, 300);
      return rejectWait(new Error(
        `Timed out after ${TIMEOUT_MS}ms waiting for app to render.\n` +
        `#root preview: ${rootHtml || "(empty)"}`
      ));
    }
    setTimeout(tick, 100);
  };
  tick();
}).catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});

const doc = dom.window.document;

// Persist the rendered snapshot for inspection / debugging.
mkdirSync(distDir, { recursive: true });
writeFileSync(snapshotPath, "<!doctype html>\n" + doc.documentElement.outerHTML, "utf8");

// --- Run assertions ----------------------------------------------------------
const failures = [];
for (const { label, check } of assertions) {
  let ok = false;
  try { ok = !!check(doc); } catch { ok = false; }
  console.log(`${ok ? "✔" : "✖"} ${label}`);
  if (!ok) failures.push(label);
}

const bodyBytes = Buffer.byteLength(doc.body.innerHTML, "utf8");
console.log(`\nRendered <body> size: ${bodyBytes.toLocaleString()} bytes`);
console.log(`Snapshot written to: ${snapshotPath}`);

dom.window.close();

if (failures.length) {
  console.error(`\n✖ Prerender snapshot check FAILED — ${failures.length} missing section(s):`);
  for (const f of failures) console.error(`   - ${f}`);
  console.error("\nCrawlers will see an incomplete page. Fix the missing sections before deploying.");
  process.exit(1);
}

console.log("\n✓ Prerender snapshot check passed — all key sections present.");
