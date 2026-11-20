import { pitchClass } from './notes'

/** Standard tuning, low E to high e. */
const OPEN_MIDI = [40, 45, 50, 55, 59, 64]
const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e']

export interface Fingering {
  /** Fret per string from low E to high e. null = not played, 0 = open. */
  frets: (number | null)[]
  /** Lowest fretted note, used as the diagram's starting fret. */
  baseFret: number
}

interface Options {
  /** Note that must be lowest. Defaults to the first chord note. */
  bass?: string
  /** How many shapes to return, spread over the neck. */
  maxResults?: number
  /** Notes that may be left out (for example the 5th of a 9th chord). */
  optional?: string[]
}

const BUCKETS = [[0, 2], [3, 5], [6, 8], [9, 11], [12, 14]]

/**
 * Find playable shapes for any chord by searching the neck, so every chord in every key gets
 * real diagrams without a hand-made chord library. Rules: the bass note is lowest, every
 * chord tone sounds, no string inside the shape is muted, at most four fingers (a barre counts
 * as one) and a stretch of four frets.
 */
export function findFingerings(chordNotes: string[], options: Options = {}): Fingering[] {
  const targets = new Set(chordNotes.map(pitchClass))
  const required = new Set(chordNotes.filter(n => !options.optional?.includes(n)).map(pitchClass))
  const bassPc = pitchClass(options.bass ?? chordNotes[0])
  const minStrings = Math.min(4, Math.max(2, targets.size + 1))
  const best = new Map<number, { frets: (number | null)[]; score: number }>()

  for (let window = 0; window <= 12; window++) {
    const choices = OPEN_MIDI.map(open => {
      const list: (number | null)[] = [null]
      if (targets.has(open % 12) && window <= 4) list.push(0)
      for (let fret = Math.max(1, window); fret <= window + 3; fret++) {
        if (targets.has((open + fret) % 12)) list.push(fret)
      }
      return list
    })

    const current: (number | null)[] = []
    const walk = (s: number) => {
      if (s === 6) { consider(current, window); return }
      for (const choice of choices[s]) { current.push(choice); walk(s + 1); current.pop() }
    }
    const consider = (frets: (number | null)[], win: number) => {
      const sounding = frets.map((f, i) => (f === null ? -1 : i)).filter(i => i >= 0)
      if (sounding.length < minStrings) return
      // No muted string in the middle of the shape.
      if (sounding[sounding.length - 1] - sounding[0] + 1 !== sounding.length) return
      const lowest = sounding[0]
      if ((OPEN_MIDI[lowest] + (frets[lowest] ?? 0)) % 12 !== bassPc) return
      const pcs = new Set(sounding.map(i => (OPEN_MIDI[i] + (frets[i] ?? 0)) % 12))
      for (const pc of required) if (!pcs.has(pc)) return
      const fretted = sounding.map(i => frets[i] ?? 0).filter(f => f > 0)
      const min = fretted.length ? Math.min(...fretted) : 0
      const max = fretted.length ? Math.max(...fretted) : 0
      if (max - min > 3) return
      const atMin = fretted.filter(f => f === min).length
      const fingers = (atMin > 1 ? 1 : atMin) + fretted.filter(f => f > min).length
      if (fingers > 4) return
      const opens = sounding.filter(i => frets[i] === 0).length
      let score = sounding.length * 2 + opens * (min <= 4 ? 1.2 : -1) - (max - min) * 0.6 - (frets[5] === null ? 1 : 0) - win * 0.05
      // Shapes players rarely use: open strings mixed with high frets, or an open string
      // ringing right above a fretted bass note.
      if (opens > 0 && max >= 5) score -= 2
      if ((frets[lowest] ?? 0) > 0 && frets[lowest + 1] === 0) score -= 2.5
      const bucket = BUCKETS.findIndex(([a, b]) => (min || 0) >= a && (min || 0) <= b)
      const prev = best.get(bucket)
      if (!prev || score > prev.score) best.set(bucket, { frets: [...frets], score })
    }
    walk(0)
  }

  return [...best.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, options.maxResults ?? 4)
    .map(([, v]) => {
      const fretted = v.frets.filter((f): f is number => f !== null && f > 0)
      return { frets: v.frets, baseFret: fretted.length ? Math.min(...fretted) : 1 }
    })
}

export function fingeringLabel(f: Fingering): string {
  return f.frets.map(x => (x === null ? 'x' : String(x))).join(' ')
}

export function stringNames(): string[] {
  return STRING_NAMES
}

/** Note sounding on a string at a fret, as a pitch class. */
export function pitchAt(stringIndex: number, fret: number): number {
  return (OPEN_MIDI[stringIndex] + fret) % 12
}
