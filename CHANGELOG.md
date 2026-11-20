# Changelog

## Unreleased
- Learning path (`/learn`) with seven steps, saved progress and a landing page teaser
- Key pages (`/keys/[key]`) generated from music theory code: scale with fretboard map, seven modes, triads, chord types, slash chords, progressions, solo scales
- Practice player (`/practice`): Web Audio chord loop with strumming patterns, click and solo scale map
- New Strumming category (9 patterns) driven by `data/strumPatterns.ts`
- New chord entries: sixth, minor sixth, slash chords, and a "Chord types" theory entry
- New navbar: Library dropdown, search in the bar, mobile drawer, new logo
- New landing page built from reusable sections
- Offline support through a service worker, that saves the whole library automatically in the background
- `/download` page, installable PWA manifest and Capacitor configuration for Android and iOS
- Content repository layer (`services/content`) so data can move to a backend later
- Code restructured into `components/`, `features/`, `services/`, `config/`
- Content lint that blocks em dashes and similar artefacts
- Open source project files: README, contributing guide, code of conduct, security policy, CI
