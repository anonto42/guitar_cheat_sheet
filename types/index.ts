// ─── Category ────────────────────────────────────────────────────────────────

export type CategorySlug =
  | 'scales'
  | 'modes'
  | 'chords'
  | 'strumming'
  | 'progressions'
  | 'techniques'
  | 'theory'
  | 'tunings'
  | 'solos'

export interface CategoryConfig {
  /** Accent colour (hex) */
  a: string
  /** Background tint (rgba, low opacity) */
  b: string
  /** Border colour (rgba, medium opacity) */
  br: string
  /** Display label */
  label: string
  /** Short description shown in CategoryGrid */
  desc: string
  /** 0–1 priority for sitemap.xml */
  sitemapPriority: number
  /**
   * Set to false for content that is not shown per key (for example strumming patterns).
   * Page titles, intros and labels then drop the "all 12 keys" wording.
   */
  keyed?: boolean
  /** Label for the formula on cards and entry pages. Default "Formula". */
  formulaLabel?: string
  /** Label for the degrees line on entry pages. Default "Degrees". */
  degreesLabel?: string
  /** Label for the example block on entry pages. Default "Example in". */
  exampleLabel?: string
}

export type CategoryConfigMap = Record<CategorySlug, CategoryConfig>

// ─── Guitar Entry ─────────────────────────────────────────────────────────────

export interface KeyData {
  root: string
  notes: string[]
  chords: string[]
}

export interface ExampleData {
  root: string
  notes: string[]
}

export interface GuitarEntry {
  id: string
  category: CategorySlug
  title: string
  tags: string[]
  summary: string
  formula: string
  degrees: string
  example: ExampleData
  allKeys: KeyData[]
  chords: string[]
  details: string
  usedBy: string
  tip: string
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface FaqQuestion {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

export interface SeoSectionItem {
  title: string
  summary: string
  details: string
  usedBy: string
  formula: string
  tags: string[]
  keysText: string | null
}

export interface SeoSection {
  key: string
  heading: string
  desc: string
  items: SeoSectionItem[]
}

export interface SitemapEntry {
  url: string
  lastModified: string
  changeFrequency: 'monthly' | 'weekly' | 'daily' | 'always' | 'hourly' | 'yearly' | 'never'
  priority: number
}

// ─── Component props ──────────────────────────────────────────────────────────

export interface PalProps {
  pal: CategoryConfig
}

// ─── Strumming ────────────────────────────────────────────────────────────────

/** D down, U up, x muted chop, M palm-muted down, - rest (the hand keeps moving). */
export type StrumSymbol = 'D' | 'U' | 'x' | 'M' | '-'

export interface StrumPattern {
  id: string
  name: string
  /** For example "4/4". */
  time: string
  steps: StrumSymbol[]
  /** Spoken count shown under the arrows, one label per step. */
  counts: string[]
  /** Steps in one beat. BPM refers to this beat. */
  stepsPerBeat: number
  summary: string
  details: string
  usedBy: string
  tip: string
  tags: string[]
}

// ─── Learning path ────────────────────────────────────────────────────────────

export interface LearnStepDef {
  slug: string
  title: string
  /** What the player can do after this step. */
  goal: string
  intro: string
  /** Entries to study, as `category/id`. */
  entries: string[]
  action: { label: string; href: string }
}

export interface LearnStep extends Omit<LearnStepDef, 'entries'> {
  number: number
  entries: GuitarEntry[]
}
