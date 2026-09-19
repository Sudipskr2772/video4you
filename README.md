# Videos4You

Mobile-first HD streaming front-end powered by the public **Eporner API v2**
(`eporner.com/api/v2/`) plus Eporner's official site autocomplete for model profiles.
Built with Next.js 15 + Tailwind CSS 4. No videos are hosted here — playback uses
official Eporner embeds. 18+ only.

## Features (every API endpoint is used)

- `/video/search/` — home grid, trending, categories, search, infinite scroll,
  filters (query · order · gay · lq · per_page · page · thumbsize), search timing stats
- `/video/id/` — watch page details, embed player, tags, thumbs gallery, related videos
- `/video/removed/` — API status page + "Prune removed" for saved lists
- Site autocomplete — model profiles with photos under the search box (desktop + mobile)

Extras: fullscreen + theater player, live suggestions with keyboard nav, My List,
History, age gate, PWA manifest, skeleton loaders, staggered animations.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Deploy to Cloudflare Pages (Git integration)

Framework preset: **Next.js** — then override:

| Setting | Value |
|---|---|
| Build command | `npx @cloudflare/next-on-pages` |
| Build output directory | `.vercel/output/static` |
| Node.js version env var | `NODE_VERSION = 20` (18+) |

> `npm run pages:build` runs the same build locally (Linux/macOS recommended —
> the adapter's Vercel-CLI step is unreliable on Windows; Cloudflare builds on
> Linux so dashboard deploys are unaffected).

Requires `next@15.5.2` (pinned — the adapter's supported range).
