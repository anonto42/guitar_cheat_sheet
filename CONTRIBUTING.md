# Contributing

Thanks for helping. This guide keeps changes small, reviewable and consistent.

## Setup
```bash
npm install
npm run dev
```
Before opening a pull request run `npm run check` and `npm run build`. CI runs the same commands.

## Workflow
1. Open an issue for anything larger than a typo or a single entry.
2. Branch from `main`: `feat/…`, `fix/…`, `content/…`, `docs/…`.
3. Keep pull requests focused. One topic per PR.
4. Use clear commit messages in the imperative: "Add Lydian dominant solo guide".
5. Commits use your own git identity. Do not add `Co-Authored-By` or tool attribution lines.

## Adding or fixing guitar content
- Edit `data/entries/<category>.ts`. Follow the `GuitarEntry` type in `types/index.ts`.
- `id` is the URL slug: lowercase, hyphenated, unique within its category.
- Check the theory with a second source. Wrong notes are bugs.
- Verify the page in all 12 keys.

## Code conventions
- TypeScript strict. No `any` without a comment explaining why.
- Read content through `@/services/content`, never import `data/` from components.
- Prefer the primitives in `components/ui`. Style with Tailwind and the tokens in `tailwind.config.ts`.
- `'use client'` only when a component needs hooks or browser events.
- Features live in `features/<name>`; keep them free of imports from other features.
- Icons are drawn bare: no background, circle or box behind them. Corners are square everywhere.
- Accessible by default: labels, focus states, 40px touch targets, keyboard support.

## Writing style
Text in the UI, data and docs must read like a person wrote it.
- No em dashes (U+2014) and no `--` used as a dash. Use a comma, colon, full stop or parentheses.
- No emoji, no marketing filler.
- En dashes are fine inside notation such as `W – W – H`.

`npm run lint:content` checks this automatically.

## Pull request checklist
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] Tested at phone width and desktop width
- [ ] New routes are available offline (see `services/offline/precacheManifest.ts`)
- [ ] Docs updated if behaviour changed
