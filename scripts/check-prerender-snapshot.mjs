#!/usr/bin/env node
/**
 * Build-time prerender snapshot check.
 *
 * Server-renders the homepage React tree with `react-dom/server` and asserts
 * that the rendered HTML contains the key sections (hero, services, contact
 * form, footer phone). This guarantees Netlify's Prerender extension will
 * have meaningful HTML to serve to crawlers — if React fails to produce
 * those sections in a no-browser environment, the build fails fast.
 *
 * Runs automatically as `postbuild` and can also be invoked via
 * `npm run check:prerender`.
 *
 * Why SSR instead of jsdom + the built bundle?
 *  - jsdom does not execute ES modules, so loading dist/assets/index-*.js
 *    requires a headless browser (Puppeteer/Playwright). SSR achieves the
 *    same goal — proving React renders the sections — without that weight.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { StaticRouter } from "react-router-dom/server.js";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = resolve(projectRoot, "dist");
const snapshotPath = resolve(distDir, "prerender-snapshot.html");
const indexHtmlPath = resolve(distDir, "index.html");

// --- Required content --------------------------------------------------------
const SERVICE_TITLES = [
  "Same-Day Delivery",
  "Gift & Flower Delivery",
  "Medicine & Pharmacy Delivery",
  "Document & Parcel Delivery",
  "Business Courier Solutions",
];

const assertions = [
  {
    label: "Hero <h1> mentions 'Parcel' and 'Windhoek'",
    test: (html) => /<h1[^>]*>[\s\S]*Parcel[\s\S]*Windhoek[\s\S]*<\/h1>/i.test(html),
  },
  {
    label: 'Services section (id="services") is present',
    test: (html) => /<section[^>]+id=["']services["']/i.test(html),
  },
  ...SERVICE_TITLES.map((title) => ({
    label: `Service card: "${title}"`,
    // React encodes "&" as "&amp;" in serialized output — match either form.
    test: (html) => html.includes(title) || html.includes(title.replace(/&/g, "&amp;")),
  })),
  {
    label: 'About section (id="about") is present',
    test: (html) => /<section[^>]+id=["']about["']/i.test(html),
  },
  {
    label: 'Contact section with a <form> and ≥4 inputs',
    test: (html) => {
      const m = html.match(/<section[^>]+id=["']contact["'][\s\S]*?<\/section>/i);
      if (!m) return false;
      const block = m[0];
      if (!/<form[\s\S]*<\/form>/i.test(block)) return false;
      const inputCount = (block.match(/<(input|textarea)\b/gi) || []).length;
      return inputCount >= 4;
    },
  },
  {
    label: "Footer/page contains phone +264 81 633 6344",
    test: (html) => /(\+?264\s?81\s?633\s?6344|0816336344)/.test(html),
  },
];

// --- SSR the App via Vite (handles TS/JSX/CSS imports transparently) --------
if (!existsSync(distDir)) {
  console.error(`✖ ${distDir} does not exist. Run \`vite build\` before this script.`);
  process.exit(1);
}

const vite = await createServer({
  root: projectRoot,
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
});

let html;
try {
  // Load the page source through Vite so JSX/TS/CSS imports resolve.
  const Index = (await vite.ssrLoadModule("/src/pages/Index.tsx")).default;
  const queryClient = new QueryClient();
  const helmetContext = {};

  const tree = createElement(
    HelmetProvider,
    { context: helmetContext },
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(StaticRouter, { location: "/" }, createElement(Index))
    )
  );

  html = renderToString(tree);
} catch (err) {
  console.error("✖ React failed to server-render the homepage:");
  console.error(err.stack || err.message || err);
  await vite.close();
  process.exit(1);
}

await vite.close();

// Persist snapshot for inspection.
mkdirSync(distDir, { recursive: true });
writeFileSync(
  snapshotPath,
  `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>Prerender Snapshot</title></head><body>${html}</body></html>`,
  "utf8"
);

// --- Run rendered-DOM assertions --------------------------------------------
const failures = [];
for (const { label, test } of assertions) {
  let ok = false;
  try { ok = !!test(html); } catch { ok = false; }
  console.log(`${ok ? "✔" : "✖"} ${label}`);
  if (!ok) failures.push(label);
}

console.log(`\nRendered HTML size: ${Buffer.byteLength(html, "utf8").toLocaleString()} bytes`);
console.log(`Snapshot written to: ${snapshotPath}`);

// --- JSON-LD structured-data assertions -------------------------------------
console.log("\n— JSON-LD structured data —");
const indexHtml = readFileSync(indexHtmlPath, "utf8");
const ldBlocks = [...indexHtml.matchAll(
  /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
)].map((m) => m[1].trim());

const ldFailures = [];
const recordLd = (ok, label) => {
  console.log(`${ok ? "✔" : "✖"} ${label}`);
  if (!ok) ldFailures.push(label);
};

recordLd(ldBlocks.length > 0, `Found ${ldBlocks.length} <script type="application/ld+json"> block(s) in dist/index.html`);

// Parse every block; collect the parsed nodes (flatten @graph / arrays).
const parsedNodes = [];
ldBlocks.forEach((raw, i) => {
  try {
    const data = JSON.parse(raw);
    const nodes = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
    parsedNodes.push(...nodes);
    recordLd(true, `JSON-LD block #${i + 1} parses as valid JSON`);
  } catch (err) {
    recordLd(false, `JSON-LD block #${i + 1} failed to parse: ${err.message}`);
  }
});

// Helper: find nodes whose @type matches (string or array form).
const nodesOfType = (type) =>
  parsedNodes.filter((n) => {
    const t = n && n["@type"];
    return Array.isArray(t) ? t.includes(type) : t === type;
  });

// Recursively walk a node looking for embedded Service entries (e.g. inside
// an ItemList's itemListElement: [{ "@type": "Service", ... }]).
const collectEmbeddedServices = () => {
  const found = [];
  const visit = (v) => {
    if (!v || typeof v !== "object") return;
    if (Array.isArray(v)) return v.forEach(visit);
    const t = v["@type"];
    if (t === "Service" || (Array.isArray(t) && t.includes("Service"))) found.push(v);
    for (const key of Object.keys(v)) visit(v[key]);
  };
  parsedNodes.forEach(visit);
  return found;
};

// LocalBusiness checks
const localBusinesses = nodesOfType("LocalBusiness");
recordLd(localBusinesses.length >= 1, "Contains a LocalBusiness entity");
if (localBusinesses[0]) {
  const lb = localBusinesses[0];
  recordLd(typeof lb.name === "string" && lb.name.length > 0, `LocalBusiness has a "name" (got: ${JSON.stringify(lb.name)})`);
  recordLd(typeof lb.telephone === "string" && /264.*?81.*?633.*?6344/.test(lb.telephone.replace(/\s+/g, "")), `LocalBusiness telephone matches +264 81 633 6344 (got: ${JSON.stringify(lb.telephone)})`);
  recordLd(typeof lb.url === "string" && lb.url.startsWith("http"), `LocalBusiness has a valid "url" (got: ${JSON.stringify(lb.url)})`);
  recordLd(!!lb.address && typeof lb.address === "object", "LocalBusiness has an address object");
}

// Service checks — accept top-level Service nodes OR services nested in an ItemList.
const services = [...nodesOfType("Service"), ...collectEmbeddedServices()];
const uniqueServices = Array.from(new Map(services.map((s) => [s.name || JSON.stringify(s), s])).values());
recordLd(uniqueServices.length >= 5, `Contains ≥5 Service entries (found ${uniqueServices.length})`);

const serviceNames = uniqueServices.map((s) => (typeof s.name === "string" ? s.name : "")).filter(Boolean);
const REQUIRED_SERVICE_KEYWORDS = ["Parcel", "Gift", "Flower", "Medicine", "Document"];
for (const kw of REQUIRED_SERVICE_KEYWORDS) {
  const hit = serviceNames.some((n) => new RegExp(kw, "i").test(n));
  recordLd(hit, `Service entry mentions "${kw}" (names: ${serviceNames.join(" | ") || "none"})`);
}

// --- Final result -----------------------------------------------------------
const allFailures = [...failures, ...ldFailures];
if (allFailures.length) {
  console.error(`\n✖ Prerender snapshot check FAILED — ${allFailures.length} issue(s):`);
  for (const f of allFailures) console.error(`   - ${f}`);
  console.error(
    "\nCrawlers and Netlify Prerender will see an incomplete page or weak structured data.\n" +
    "Fix the issues above (or update assertions in scripts/check-prerender-snapshot.mjs) before deploying."
  );
  process.exit(1);
}

console.log("\n✓ Prerender snapshot check passed — rendered DOM and JSON-LD are complete.");

