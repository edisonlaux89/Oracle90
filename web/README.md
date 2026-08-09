# web

Oracle90 site (Vite + React 19 + TypeScript + Tailwind v4) plus the published
prediction record in `data/`.

- `data/*.json` is the public prediction record, committed before kickoff.
  Never amend published prediction commits.
- Prediction JSON is imported at build time; Vercel redeploys on every push,
  so committing new JSON refreshes the site.

## Commands

```
npm install
npm run dev        # local dev server
npm run typecheck  # hard gate: 0 errors required before commit
npm run build      # production build (also run before commit)
```

## Build pipeline

`npm run build` runs three steps:

1. `build:client` — `vite build`, the browser bundle into `dist/`.
2. `build:server` — `vite build --ssr src/entry-server.tsx`, a Node-only
   render bundle into `dist-ssr/` (gitignored, never deployed).
3. `prerender` — `scripts/prerender.mjs` renders every route to its own static
   HTML file in `dist/` with per-route `<title>`, description, canonical, OG
   tags and JSON-LD baked into `<head>`; then `scripts/gen-seo-assets.mjs`
   writes `dist/sitemap.xml` and `dist/llms.txt`.

The route table lives in `src/seo.ts` and is derived from `data/*.json`, so a
new prediction file automatically produces new prerendered pages, sitemap
entries and llms.txt lines. `robots.txt` is a static file in `public/`.

Prerendered pages are English. The language toggle is client-side and applies
after hydration, which is why `I18nProvider` always starts in English: reading
the saved language during the first render would break hydration.

Verify after a build:

```
find dist -name '*.html' | wc -l          # 3 static pages + one per match
grep -L 'og:title' $(find dist -name '*.html')   # must print nothing
grep -c '<loc>' dist/sitemap.xml          # must equal the HTML count
```

## Deploy

Vercel project root is `web/`. `vercel.json` sets `cleanUrls` so
`dist/methodology.html` serves at `/methodology`, and keeps a catch-all rewrite
to `/` as the fallback for any path that has no prerendered file.
