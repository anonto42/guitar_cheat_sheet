import type { SectionKind } from './song'

/**
 * One colour per scale degree, used everywhere a chord appears (chart, palette), so a
 * progression's shape is visible at a glance: I is always orange, V is always gold, and so on.
 */
export const DEGREE_COLORS = ['#ff6b00', '#6eb4ff', '#5fd3c8', '#9be15d', '#f0c93a', '#b987f5', '#ff6b8a'] as const

export const degreeColor = (degree: number) => DEGREE_COLORS[(degree - 1) % 7]

/** One colour per kind of song part, used by the song strip. */
export const SECTION_COLORS: Record<SectionKind, string> = {
  Intro: '#a98a7d',
  Verse: '#6eb4ff',
  'Pre-chorus': '#b987f5',
  Chorus: '#ff6b00',
  Bridge: '#4dd98a',
  Solo: '#ff4d6d',
  Outro: '#a98a7d',
}
