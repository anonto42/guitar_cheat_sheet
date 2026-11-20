import type { LearnStepDef } from '@/types'

/**
 * The guided path through the reference, in the order a guitarist should learn it.
 * Each step lists the entries to study (`category/id`) and one action to try.
 */
export const LEARN_STEPS: LearnStepDef[] = [
  {
    slug: 'scales',
    title: 'Understand a scale',
    goal: 'Explain what a scale is, read its formula and find its notes anywhere on the neck.',
    intro: 'A scale is a set of notes chosen by a pattern of whole and half steps. The pattern is the formula, and the same formula works from any starting note, which is what gives you all 12 keys.',
    entries: ['scales/major-scale', 'scales/natural-minor', 'scales/minor-pentatonic', 'theory/intervals'],
    action: { label: 'See the C major scale on the neck', href: '/scales/major-scale?key=c#fretboard' },
  },
  {
    slug: 'keys',
    title: 'Pick a key',
    goal: 'Choose a key, name its seven notes and know how many sharps or flats it has.',
    intro: 'A key is a scale used as home base. Start with C major because it has no sharps or flats, then move around the circle of fifths one key at a time.',
    entries: ['theory/circle-of-fifths', 'theory/relative-keys', 'theory/transposing'],
    action: { label: 'Pick a key on the circle of fifths', href: '/theory/circle-of-fifths?key=c' },
  },
  {
    slug: 'modes',
    title: 'Meet the seven modes',
    goal: 'Play the seven modes of one key and hear how each starting note changes the mood.',
    intro: 'Start the same seven notes from a different degree and you get a mode. C major gives Ionian on C, Dorian on D, Phrygian on E and so on. Same notes, seven different home bases.',
    entries: ['theory/modes-explained', 'modes/ionian', 'modes/dorian-mode', 'modes/phrygian-mode', 'modes/lydian-mode', 'modes/mixolydian-mode', 'modes/aeolian-mode', 'modes/locrian-mode'],
    action: { label: 'See the seven modes of C major', href: '/theory/modes-explained?key=c' },
  },
  {
    slug: 'triads',
    title: 'Build triads',
    goal: 'Stack thirds on any note of the scale to build the seven triads of a key.',
    intro: 'Skip a note, take a note, skip a note, take a note. Doing that on every degree of the major scale gives three major, three minor and one diminished triad, in the same order in every key.',
    entries: ['theory/chord-construction', 'theory/diatonic-harmony', 'chords/major-chord', 'chords/minor-chord', 'chords/diminished'],
    action: { label: 'Build the triads of C major', href: '/theory/chord-construction?key=c' },
  },
  {
    slug: 'chord-types',
    title: 'Grow chord types',
    goal: 'Turn a triad into minor, suspended, sixth, power and slash chords, and read the chord symbols.',
    intro: 'Every common chord is a triad with one change. Lower the 3rd for minor, swap it for a 2nd or 4th for suspended, add a 6th for a sixth chord, drop the 3rd for a power chord, or move the bass for a slash chord.',
    entries: ['theory/chord-types', 'chords/sus2-chord', 'chords/sus4-chord', 'chords/sixth-chord', 'chords/minor-sixth-chord', 'chords/power-chord', 'chords/slash-chords', 'theory/chord-inversions'],
    action: { label: 'Compare chord types on C', href: '/theory/chord-types?key=c' },
  },
  {
    slug: 'strumming',
    title: 'Strum the chords',
    goal: 'Play three chords with a steady pattern and keep your hand moving in time.',
    intro: 'Rhythm turns chords into music. Start with plain downstrokes, then learn the folk strum, then add the patterns that match the styles you like.',
    entries: ['strumming/down-strums', 'strumming/folk-strum', 'strumming/pop-eighths', 'strumming/reggae-offbeat', 'strumming/blues-shuffle', 'strumming/rock-chug'],
    action: { label: 'See and hear the folk strum', href: '/strumming/folk-strum' },
  },
  {
    slug: 'play-and-solo',
    title: 'Practise and solo',
    goal: 'Play a progression in a key, then improvise a solo over it with the matching scale.',
    intro: 'Put it all together. Loop a progression with a strumming pattern, then solo over it with the pentatonic scale that fits the key. The Practice Studio does the looping for you.',
    entries: ['progressions/i-iv-v', 'progressions/i-v-vi-iv', 'progressions/12-bar-blues', 'solos/major-pentatonic-solo', 'solos/pentatonic-minor-solo', 'solos/solo-construction'],
    action: { label: 'Open the Practice Studio', href: '/practice?key=c&progression=i-v-vi-iv&pattern=folk-strum' },
  },
]
