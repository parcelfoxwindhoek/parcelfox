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
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = resolve(projectRoot, "dist");
const snapshotPath = resolve(distDir, "prerender-snapshot.html");

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
    test: (html) => html.includes(title),
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

// --- Run assertions ----------------------------------------------------------
const failures = [];
for (const { label, test } of assertions) {
  let ok = false;
  try { ok = !!test(html); } catch { ok = false; }
  console.log(`${ok ? "✔" : "✖"} ${label}`);
  if (!ok) failures.push(label);
}

console.log(`\nRendered HTML size: ${Buffer.byteLength(html, "utf8").toLocaleString()} bytes`);
console.log(`Snapshot written to: ${snapshotPath}`);

if (failures.length) {
  console.error(`\n✖ Prerender snapshot check FAILED — ${failures.length} missing section(s):`);
  for (const f of failures) console.error(`   - ${f}`);
  console.error(
    "\nCrawlers and Netlify Prerender will see an incomplete page.\n" +
    "Fix the missing sections (or update the assertions in scripts/check-prerender-snapshot.mjs) before deploying."
  );
  process.exit(1);
}

console.log("\n✓ Prerender snapshot check passed — all key sections present.");
