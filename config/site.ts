/**
 * Site-wide constants. Single source of truth for brand, URLs and SEO defaults.
 * Override the public URL per environment with NEXT_PUBLIC_SITE_URL.
 */
export const SITE = {
  name: 'Guitar Cheat Sheet',
  shortName: 'Guitar CS',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://guitarcheatsheet.sohidul.site').replace(/\/$/, ''),
  tagline: 'Every scale, chord and technique in all 12 keys',
  description:
    'Free guitar reference for every player. Look up scales, modes, chords, progressions, techniques, music theory and tunings in all 12 keys.',
  themeColor: '#0d0b08',
  accentColor: '#ff6b00',
  repoUrl: 'https://github.com/anonto42/guitar_cheat_sheet',
  locale: 'en_US',
} as const

export const SITE_TITLE = `${SITE.name}: Scales, Chords, Modes & Techniques`
