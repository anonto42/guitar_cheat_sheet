# Guitar Cheat Sheet

A free, open source guitar reference. Look up any scale, mode, chord, progression, technique or tuning in all 12 keys. Works offline, installs as an app on Android, iOS and desktop.

## Features
- 96 topics across 8 categories (scales, modes, chords, progressions, techniques, theory, tunings, solos), each shown in every key
- Search from the navbar with keyboard support (`/` to focus)
- Offline first: service worker stores every page, the search index and fonts
- Installable PWA and a Capacitor shell for native Android and iOS builds
- GuitarFX Studio: browser-based live effects processor
- Static SEO output: metadata, JSON-LD, sitemap and robots generated from the content

## Quick start
```bash
git clone https://github.com/ananto/guitar-cheat-sheet.git
cd guitar-cheat-sheet
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```
Requires Node 20.9 or newer.

The service worker only runs in production builds. To test offline behaviour: `npm run build && npm start`, open the site, then switch the browser to offline in DevTools.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run check` | Typecheck, ESLint and content lint |
| `npm run generate-icons` | Rebuild PNG icons from `public/favicon.svg` |
| `npm run build:mobile` | Static export to `out/` for Capacitor |
| `npm run cap:sync` | Static export, then copy into the native projects |

## Project structure
```
app/         routes and metadata only
components/  ui primitives, layout, brand, seo
features/    home, search, install, offline, fretboard, guitarfx
services/    content repository (data access) and offline manifest
data/        static content
config/      site, app store links, navigation
lib/         pure helpers
```
Full explanation in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Native apps are covered in [docs/MOBILE.md](docs/MOBILE.md).

## Adding content
Edit a file in `data/entries/`. The entry shows up in search, the landing page, the sitemap, structured data and the offline cache with no other change. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing
Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first. Report security problems as described in [SECURITY.md](SECURITY.md).

## License
[MIT](LICENSE)
