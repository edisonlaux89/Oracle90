// Generates dist/sitemap.xml and dist/llms.txt from the published prediction
// JSON, using the same route table the prerender step uses. Run after
// scripts/prerender.mjs.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemap(routes) {
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${escapeXml(r.canonical)}</loc>\n    <lastmod>${escapeXml(
          r.lastmod,
        )}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const { allRoutes, buildLlmsTxt } = await import(pathToFileURL(ssrEntry).href);
const routes = allRoutes();

await writeFile(path.join(dist, "sitemap.xml"), sitemap(routes), "utf8");
await writeFile(path.join(dist, "llms.txt"), buildLlmsTxt(), "utf8");

console.log(
  `seo assets: sitemap.xml (${routes.length} urls) + llms.txt written to dist/`,
);
