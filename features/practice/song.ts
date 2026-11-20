import { DIATONIC, PRACTICE_PROGRESSIONS, type ProgressionStep } from '@/lib/music/progressions'

export const SECTION_KINDS = ['Intro', 'Verse', 'Pre-chorus', 'Chorus', 'Bridge', 'Solo', 'Outro'] as const
export type SectionKind = (typeof SECTION_KINDS)[number]

export interface SongSection {
  id: string
  kind: SectionKind
  /** Shown name, for example "Verse 2". */
  name: string
  bars: ProgressionStep[]
}

export interface Song {
  sections: SongSection[]
  /** Section ids in playing order. A section can appear more than once. */
  order: string[]
}

export interface FlatBar {
  step: ProgressionStep
  sectionId: string
  sectionName: string
  /** Position in the song order (0-based). */
  orderIndex: number
  barInSection: number
  sectionLength: number
}

let counter = 0
export const newId = () => `s${Date.now().toString(36)}${(counter++).toString(36)}`

const s = (degree: number, type: string): ProgressionStep => ({ degree, type })

/** Ready-made song shapes: a full song, verse and chorus, or one progression looping. */
export function songTemplate(id: string): Song {
  const make = (kind: SectionKind, degrees: number[], name: string = kind): SongSection => ({ id: newId(), kind, name, bars: degrees.map(d => s(d, DIATONIC)) })

  // Templates use the chords that belong to the chosen scale, so they work with any scale or mode.
  if (id === 'pop-song') {
    const intro = make('Intro', [1, 5, 6, 4])
    const verse = make('Verse', [1, 5, 6, 4])
    const pre = make('Pre-chorus', [4, 5, 4, 5])
    const chorus = make('Chorus', [6, 4, 1, 5])
    const bridge = make('Bridge', [2, 4, 6, 5])
    const outro = make('Outro', [4, 1, 4, 1])
    return {
      sections: [intro, verse, pre, chorus, bridge, outro],
      order: [intro.id, verse.id, pre.id, chorus.id, verse.id, pre.id, chorus.id, bridge.id, chorus.id, outro.id],
    }
  }
  if (id === 'verse-chorus') {
    const verse = make('Verse', [1, 4, 1, 5])
    const chorus = make('Chorus', [4, 5, 6, 1])
    return { sections: [verse, chorus], order: [verse.id, chorus.id, verse.id, chorus.id] }
  }
  const preset = PRACTICE_PROGRESSIONS.find(p => p.id === id) ?? PRACTICE_PROGRESSIONS[0]
  const loop: SongSection = { id: newId(), kind: 'Verse', name: preset.name, bars: preset.steps }
  return { sections: [loop], order: [loop.id] }
}

export const SONG_TEMPLATES = [
  { value: 'pop-song', label: 'Full pop song (intro, verse, pre-chorus, chorus, bridge, outro)' },
  { value: 'verse-chorus', label: 'Verse and chorus' },
  ...PRACTICE_PROGRESSIONS.map(p => ({ value: p.id, label: `Loop: ${p.name} (${p.numerals})` })),
]

/** Turn the song order into one list of bars for the player. */
export function flattenSong(song: Song, onlySectionId?: string | null): FlatBar[] {
  const order = onlySectionId ? [onlySectionId] : song.order
  const bars: FlatBar[] = []
  order.forEach((id, orderIndex) => {
    const section = song.sections.find(x => x.id === id)
    if (!section) return
    section.bars.forEach((step, barInSection) => bars.push({
      step, sectionId: section.id, sectionName: section.name, orderIndex, barInSection, sectionLength: section.bars.length,
    }))
  })
  return bars
}

/** Next free name for a new section of a kind: "Verse", "Verse 2"… */
export function nextName(song: Song, kind: SectionKind): string {
  const count = song.sections.filter(x => x.kind === kind).length
  return count === 0 ? kind : `${kind} ${count + 1}`
}
