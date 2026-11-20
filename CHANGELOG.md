# Changelog

## Unreleased
- Android app: Capacitor project in `android/`, launcher icons and splash screens, microphone permission, GitHub Actions workflow that builds the APK and attaches it to releases, Download APK button with install steps
- Responsive fixes: navbar at 1024 to 1279px, Practice Studio on phones, category cards and tuner at 320px, fretboard maps scroll to the chosen position
- Practice Studio: any scale or mode as the key (harmonic minor, Dorian, Phrygian dominant…), song parts (intro, verse, pre-chorus, chorus, bridge, solo, outro) with their own chords, a song order, song templates, and loop whole song or one part
- Shared shadcn-style Select (Radix) replaces every native dropdown
- Rebuilt entry pages: key picker on every keyed page (`?key=`), readable info cards, "In simple words" box, history-aware Back button, compact technique diagrams
- Scale and mode pages: fretboard map to fret 15 with positions, chords of the scale with generated shapes, clean all-keys table
- Chord pages: playable shapes in every key from a fingering search, arpeggio maps, slash chord shapes
- Strumming and progression pages: visual patterns and bars with a Play button
- Theory pages: worked examples (circle of fifths, intervals, CAGED, inversions, voice leading and more)
- Guitar tuner on tuning pages and `/tuner`, using pitchy (MIT)
- Rhythm for Solos lesson with a rhythm grid, tab example, notation table, roadmap and quiz
- Practice Studio: transport bar, tap tempo, count-in, any number of bars, custom chords and strum patterns, instruments, bass, drums, mix, recording and live solo targets
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
