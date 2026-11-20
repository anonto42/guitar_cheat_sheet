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

## Learning flow
The site teaches in this order: scale, key, modes, triads, chord types, strumming, practise and solo.
- `data/learn.ts` defines the seven steps and which entries belong to each (`category/id`). `content.getLearningPath()` resolves them. `/learn` renders them and stores progress in `localStorage` only.
- `lib/music/` is pure theory code: `notes.ts` spells notes by letter (F♯ in G major), `chordTypes.ts` lists every chord type as intervals, `keys.ts` derives modes, triads and solo scales for the 12 major keys, `progressions.ts` writes progressions in a key. Nothing there is typed per key, so a new key or chord type is one data change.
- `/keys/[key]` composes those functions. `components/music/NoteMap` draws any set of notes on the fretboard from the tuning, so no diagram is hand-made.
- `data/strumPatterns.ts` is the single source for strumming. It generates the Strumming reference entries and drives the player.
- `/practice` (`features/practice`) uses `lib/music/audio.ts`, a small Web Audio scheduler that synthesises chords, strums and a click. No audio files are downloaded, so it works offline.

## Entry pages
`lib/music/entryMusic.ts` maps each entry to an interactive view, rendered by `features/entry/EntryVisual`:
- scales, modes and solo scales use `SCALE_CATALOG` (`lib/music/scales.ts`) for correctly spelled notes in any key, positions and the chords of the scale
- chords use `CHORD_TYPE_FOR_ENTRY` and `findFingerings` (`lib/music/fingerings.ts`), a small search over the neck that returns playable shapes for any chord, inversion or slash chord
- progressions use `PRACTICE_PROGRESSIONS` (major and minor), strumming uses `data/strumPatterns.ts`, tunings use `lib/music/tunings.ts`
The chosen key lives in `?key=` (`lib/useUrlParam.ts`), read on the client so every page stays statically generated and works offline.

## Practice Studio and tuner
`lib/music/audio.ts` synthesises chords (acoustic, electric, piano, pad), bass, drums and a click, scheduled slightly ahead of the audio clock. `features/practice` builds the UI around it; `useRecorder` records the microphone with MediaRecorder and keeps takes in memory only. The tuner (`features/tuner`) uses pitchy's McLeod Pitch Method on microphone input; audio never leaves the device.

## Search
`/search-index.json` is generated from the service and contains only id, category, title, summary and tags. The navbar loads it on first focus. `lib/search.ts` ranks results (exact title, prefix, substring, tag, summary). The service worker stores the index, so search works offline.

## Offline
`public/sw.js`:
- `/_next/static` and fonts: cache first
- pages and Next data requests: network first, stored copy as fallback, `/offline` as last resort
- other same-origin files: stale while revalidate
- `CACHE_ALL` message: fetches every route listed in `/precache.json` plus the assets each page references

`/precache.json` is built from the content service, so new entries become offline-ready automatically. The client stores the manifest version in `localStorage` to know whether its copy is current. `features/offline/ServiceWorkerRegister` runs the sync automatically when the browser is idle: if the server's version differs from the stored one it sends `CACHE_ALL`, and it retries on the next load or the `online` event. The only exception is the browser's data saver mode. There is no manual download control.

## Styling
Tailwind with tokens in `tailwind.config.ts` and CSS variables in `app/globals.css`. Category accent colours come from `data/categories.ts` and are applied through a `--accent` custom property. Fonts are loaded by `next/font` and exposed as `--font-sans` and `--font-display`.

## SEO
`lib/seoGenerators.ts` derives keywords, FAQ and sitemap entries from content. Each page sets its own canonical URL. Structured data is rendered through `components/seo/JsonLd`.

## Planned
The category and entry page layouts (`app/[category]`) still use legacy inline styles and will be redesigned next, using the same primitives.
