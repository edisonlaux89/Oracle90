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

## Deploy

Vercel project root is `web/`. `vercel.json` provides the SPA rewrite.
