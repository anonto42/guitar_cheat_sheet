# Architecture

## Layers
```
app/  ->  features/  ->  components/  ->  lib/ config/ types/
              |
          services/  ->  data/
```
- `app/` holds routes and metadata. Pages stay short: fetch through a service, compose features.
- `features/<name>` owns one product capability (home, search, install, offline, fretboard, guitarfx) with its components and hooks.
- `components/` is shared UI with no business logic: primitives, layout, brand, seo.
- `services/` is the only code that knows where content comes from.
- `data/` is the static content that currently backs the service.

## Content access
`services/content/types.ts` defines `ContentRepository`. `staticRepository.ts` implements it from `data/`. Every page calls `content.listEntries()`, `content.getEntry()` and so on, all async, so a network-backed version is a drop-in replacement.

To move to a backend:
1. Add `services/content/apiRepository.ts` implementing `ContentRepository` with `fetch` calls.
2. Change the export in `services/content/index.ts`.
3. Point `SEARCH_INDEX_URL` in `features/search/useSearchIndex.ts` at the API route (or keep `app/search-index.json`, which already reads from the service).

For the native app, which has no server, keep the static repository or add a runtime fetch with the offline cache in front.

## Search
`/search-index.json` is generated from the service and contains only id, category, title, summary and tags. The navbar loads it on first focus. `lib/search.ts` ranks results (exact title, prefix, substring, tag, summary). The service worker stores the index, so search works offline.

## Offline
`public/sw.js`:
- `/_next/static` and fonts: cache first
- pages and Next data requests: network first, stored copy as fallback, `/offline` as last resort
- other same-origin files: stale while revalidate
- `CACHE_ALL` message: fetches every route listed in `/precache.json` plus the assets each page references

`/precache.json` is built from the content service, so new entries become offline-ready automatically. The client stores the manifest version in `localStorage` to know whether its copy is current. Automatic download is skipped on cellular, slow or data-saver connections; the `/download` page offers a manual button.

## Styling
Tailwind with tokens in `tailwind.config.ts` and CSS variables in `app/globals.css`. Category accent colours come from `data/categories.ts` and are applied through a `--accent` custom property. Fonts are loaded by `next/font` and exposed as `--font-sans` and `--font-display`.

## SEO
`lib/seoGenerators.ts` derives keywords, FAQ and sitemap entries from content. Each page sets its own canonical URL. Structured data is rendered through `components/seo/JsonLd`.

## Planned
The category and entry page layouts (`app/[category]`) still use legacy inline styles and will be redesigned next, using the same primitives.
