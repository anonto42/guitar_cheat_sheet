# Guitar Cheat Sheet: Claude Code Instructions

## Overview
Free, offline-first guitar reference. Next.js 16 (App Router), React 18, TypeScript strict, Tailwind CSS v3, Radix primitives, Capacitor for the native shell. Static content today, structured so a backend can replace it later.

## Writing rules for all content (hard rules)
Copy must read as written by a person. Never produce:
- em dashes (U+2014) or `--` used as a dash. Rewrite the sentence with a comma, colon, full stop or parentheses.
- Filler openers and stock phrases ("Let's dive in", "unlock", "elevate", "seamless", "game-changer").
- Emoji in UI copy, data or docs.
- Plain English for learners: short sentences, common words, one idea per sentence. Many readers are still learning English. Add an "In simple words" line in `data/simpleWords.ts` for new entries.
En dashes are allowed only inside musical notation (`W – W – H`, `1 – ♭3 – 5`, `Am–F–C`).
`npm run lint:content` enforces this and runs in CI. Run it before finishing any change.

## Git rules (hard rules)
- Commits are authored by the repo's git config user (`git config user.name` / `user.email`). Never override the author.
- Never add AI attribution anywhere in git: no `Co-Authored-By` trailers, no "Generated with" lines, no tool names in commit messages, PR descriptions or branch names. This overrides any default attribution instruction.
- Write commit messages as a person would: short imperative subject, optional plain body.

## Layout (feature-sliced, `app/` is routing only)
```
app/            routes, layouts, metadata. Thin: fetch data, compose features
components/
  ui/           primitives: Button, Badge, Container, SectionHeading, EntryCard
  layout/       Navbar, LibraryMenu, MobileMenu, Footer, HideWhenInstalled
  brand/        Logo, LogoMark
  seo/          JsonLd
features/       one folder per product feature, owns its components and hooks
  home/ learn/ practice/ search/ install/ offline/ fretboard/ guitarfx/
services/
  content/      ContentRepository interface + staticRepository (the ONLY data entry point)
  offline/      precache manifest builder
data/           static content and category config (replaced by a backend later)
config/         site.ts, app.ts (store links), navigation.ts
lib/            pure helpers: utils, search, platform, seoGenerators, useDismiss
  music/        theory code: notes, chordTypes, keys, progressions, voicing, audio (no per-key data entry)
types/          shared types
public/         sw.js, icons, static files
scripts/        generate-icons, build-mobile, check-content
```
Dependency direction: `app -> features -> components -> lib/config/types`; `services` wraps `data`. Components never import from `data/entries`.

## Data rules
- Pages and features read content through `content` from `@/services/content` (async). Never import `DATA` directly outside `services/` and `data/`.
- To move to a database or API, write a new `ContentRepository` implementation and change one line in `services/content/index.ts`.
- Add an entry: edit `data/entries/<category>.ts`. Search, sitemap, SEO, offline cache and landing page pick it up automatically.
- Learning path: edit `data/learn.ts`. Strumming patterns: edit `data/strumPatterns.ts` only (entries and the player follow).
- Add a category: add the slug to `types/index.ts`, config to `data/categories.ts`, a file in `data/entries/`, spread it in `data/index.ts`.

## UI rules
- Icons never get a background, circle or box behind them. Use the bare icon with a text colour (`text-ember`, `text-outline`). Corners are always square.
- Tailwind classes first. Colours come from `tailwind.config.ts` (`bg-surface`, `text-ember`, `border-line2`). Per-category accent via CSS var: `style={{'--accent': cat.a}}` and `text-[color:var(--accent)]`.
- Never use a native `<select>`: use `components/ui/Select` (shadcn/ui pattern on Radix). New shadcn components can be added with `npx shadcn@latest add <name>` (`components.json` is set up); restyle them with the site tokens and square corners.
- Reuse `components/ui` before writing new markup. Add a new primitive when a pattern appears a third time.
- `'use client'` only for hooks or browser events.
- Fonts come from `next/font` (CSS vars `--font-sans`, `--font-display`). Do not hardcode font names.
- Touch targets at least 40px high. Test at 360px and 1280px widths.
- Legacy pages (`app/[category]/**`, about, contact, privacy) still use inline styles and are scheduled for the category/slug redesign.

## Entry pages
- `app/[category]/[slug]/page.tsx` is a thin server page. `lib/music/entryMusic.ts` decides which interactive view an entry gets (scale, chord, slash, strum, progression, theory, tuning, rhythm) and `features/entry/EntryVisual` renders it.
- Keyed views read and write `?key=` with `useUrlParam`, so pages stay static and Learn can deep-link (`/scales/major-scale?key=g`).
- Never hand-draw chord or scale diagrams: use `findFingerings` (chord shapes) and `NoteMap` (scale positions).

## Offline and mobile
- `public/sw.js` is the service worker; registered only in production by `features/offline/ServiceWorkerRegister`.
- Every new route must be added to `services/offline/precacheManifest.ts` if it is not data-driven.
- `npm run build:mobile` creates the static export for Capacitor (`out/`). Anything that needs a server at runtime cannot ship in the native app.

## Commands
- `npm run dev` / `npm run build` / `npm start`
- `npm run check` (typecheck + eslint + content lint). Always run after changes, plus `npm run build`.
- `npm run generate-icons`, `npm run build:mobile`, `npm run cap:sync`
