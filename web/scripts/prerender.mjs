// Prerenders every route to a static HTML file in dist/, with per-route
// <title>, description, canonical, OG tags and JSON-LD baked into <head>.
//
// Run after `vite build` (client) and `vite build --ssr` (server bundle):
//   node scripts/prerender.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const SEO_BLOCK = /<!-- seo:start[\s\S]*?seo:end -->/;
const APP_MARKER = "<!--app-html-->";
const OG_IMAGE = "https://oracle90.com/og.png";

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLdScript(data) {
  // `</` must be broken up so the payload cannot close the script element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `    <script type="application/ld+json">${json}</script>`;
}

function headFor(route) {
  const ogType = route.path.startsWith("/match/") ? "article" : "website";
  const tags = [
    `    <title>${escapeAttr(route.title)}</title>`,
    `    <meta name="description" content="${escapeAttr(route.description)}" />`,
    `    <link rel="canonical" href="${escapeAttr(route.canonical)}" />`,
    `    <meta property="og:title" content="${escapeAttr(route.title)}" />`,
    `    <meta property="og:description" content="${escapeAttr(route.description)}" />`,
    `    <meta property="og:url" content="${escapeAttr(route.canonical)}" />`,
    `    <meta property="og:image" content="${OG_IMAGE}" />`,
    `    <meta property="og:type" content="${ogType}" />`,
    `    <meta property="og:site_name" content="Oracle90" />`,
    `    <meta property="og:locale" content="en_GB" />`,
    `    <meta name="twitter:card" content="summary_large_image" />`,
    `    <meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    `    <meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...route.jsonLd.map(jsonLdScript),
  ];
  return tags.join("\n");
}

async function main() {
  const template = await readFile(path.join(dist, "index.html"), "utf8");
  if (!SEO_BLOCK.test(template)) {
    throw new Error("dist/index.html has no seo:start/seo:end block to replace");
  }
  if (!template.includes(APP_MARKER)) {
    throw new Error(`dist/index.html has no ${APP_MARKER} marker`);
  }

  const { render, allRoutes } = await import(pathToFileURL(ssrEntry).href);
  const routes = allRoutes();

  for (const route of routes) {
    const appHtml = render(route.path);
    if (!appHtml.trim()) {
      throw new Error(`route ${route.path} rendered empty markup`);
    }
    const html = template
      .replace(SEO_BLOCK, headFor(route))
      .replace(APP_MARKER, appHtml);

    const outFile = path.join(dist, route.file);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf8");
  }

  console.log(`prerender: wrote ${routes.length} HTML files to dist/`);
}

await main();
