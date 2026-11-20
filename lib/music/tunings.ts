import { pitchClass } from './notes'

export interface TuningString {
  /** Note name with octave, for example "E2". */
  label: string
  note: string
  midi: number
  frequency: number
}

export interface Tuning {
  id: string
  name: string
  strings: TuningString[]
}

function parse(label: string): TuningString {
  const match = /^([A-G][♯♭]?)(\d)$/.exec(label)
  if (!match) throw new Error(`Bad note label ${label}`)
  const [, note, octave] = match
  const midi = (Number(octave) + 1) * 12 + pitchClass(note)
  return { label, note, midi, frequency: 440 * Math.pow(2, (midi - 69) / 12) }
}

const define = (id: string, name: string, labels: string[]): Tuning => ({ id, name, strings: labels.map(parse) })

/** Tunings by entry id, low (6th) string first. */
export const TUNINGS: Tuning[] = [
  define('standard-tuning', 'Standard (E A D G B E)', ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  define('drop-d', 'Drop D (D A D G B E)', ['D2', 'A2', 'D3', 'G3', 'B3', 'E4']),
  define('half-step-down', 'Half step down (E♭)', ['E♭2', 'A♭2', 'D♭3', 'G♭3', 'B♭3', 'E♭4']),
  define('whole-step-down', 'Whole step down (D G C F A D)', ['D2', 'G2', 'C3', 'F3', 'A3', 'D4']),
  define('open-e', 'Open E (E B E G♯ B E)', ['E2', 'B2', 'E3', 'G♯3', 'B3', 'E4']),
  define('open-g', 'Open G (D G D G B D)', ['D2', 'G2', 'D3', 'G3', 'B3', 'D4']),
  define('open-d', 'Open D (D A D F♯ A D)', ['D2', 'A2', 'D3', 'F♯3', 'A3', 'D4']),
  define('open-c', 'Open C (C G C G C E)', ['C2', 'G2', 'C3', 'G3', 'C4', 'E4']),
  define('dadgad', 'DADGAD (D A D G A D)', ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']),
]

export function getTuning(id: string | null | undefined): Tuning {
  return TUNINGS.find(t => t.id === id) ?? TUNINGS[0]
}
