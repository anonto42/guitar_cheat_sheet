import type { Fingering } from '@/lib/music/fingerings'
import { pitchAt } from '@/lib/music/fingerings'
import { pitchClass } from '@/lib/music/notes'

interface ChordDiagramProps {
  name: string
  fingering: Fingering
  /** Chord tones, used to label each string with its note name. */
  notes: string[]
  /** Tonic to fill in the brand colour. */
  root?: string
  /** Small caption under the name, for example "Position 2". */
  caption?: string
}

const STRINGS = 6
const ROWS = 5
const W = 140
const H = 168
const LEFT = 30
const TOP = 30
const GAP_X = (W - LEFT - 12) / (STRINGS - 1)
const GAP_Y = 22

/**
 * Standard chord box: strings run top to bottom, low E on the left, frets across.
 * x = do not play, o = open string. Note names are printed under each string.
 */
export default function ChordDiagram({ name, fingering, notes, root, caption }: ChordDiagramProps) {
  const fretted = fingering.frets.filter((f): f is number => f !== null && f > 0)
  const maxFret = fretted.length ? Math.max(...fretted) : 0
  const start = maxFret <= ROWS ? 1 : fingering.baseFret
  const nameByPc = new Map(notes.map(n => [pitchClass(n), n]))
  const rootPc = root ? pitchClass(root) : pitchClass(notes[0])

  const x = (s: number) => LEFT + s * GAP_X
  const y = (row: number) => TOP + row * GAP_Y

  // A barre where two or more strings share the lowest fret and nothing lower sits between them.
  const minFret = fretted.length ? Math.min(...fretted) : 0
  const atMin = fingering.frets.map((f, i) => (f === minFret ? i : -1)).filter(i => i >= 0)
  const barre = minFret > 0 && atMin.length > 1 &&
    fingering.frets.slice(atMin[0], atMin[atMin.length - 1] + 1).every(f => f !== null && f >= minFret)

  return (
    <figure className="flex flex-col items-center">
      <figcaption className="text-center">
        <span className="block font-display text-lg font-bold text-cream">{name}</span>
        {caption && <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-outline">{caption}</span>}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${name} chord shape: ${fingering.frets.map(f => (f === null ? 'x' : f)).join(' ')}`}>
        {/* open / muted markers */}
        {fingering.frets.map((f, s) => (
          <text key={`m${s}`} x={x(s)} y={TOP - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill={f === null ? '#a98a7d' : '#e5e2e1'}>
            {f === null ? '×' : f === 0 ? 'o' : ''}
          </text>
        ))}
        {/* nut or starting fret */}
        {start === 1
          ? <rect x={LEFT - 1} y={TOP - 3} width={x(5) - LEFT + 2} height={4} fill="#e5e2e1" />
          : <text x={LEFT - 8} y={y(0) + GAP_Y / 2 + 4} textAnchor="end" fontSize="10" fontWeight="700" fill="#a98a7d">{start}fr</text>}
        {/* frets */}
        {Array.from({ length: ROWS + 1 }, (_, r) => (
          <line key={`f${r}`} x1={LEFT} x2={x(5)} y1={y(r)} y2={y(r)} stroke="rgba(169,138,125,.45)" strokeWidth={1} />
        ))}
        {/* strings */}
        {Array.from({ length: STRINGS }, (_, s) => (
          <line key={`s${s}`} x1={x(s)} x2={x(s)} y1={y(0)} y2={y(ROWS)} stroke="rgba(229,226,225,.55)" strokeWidth={1 + (5 - s) * 0.2} />
        ))}
        {barre && (
          <rect
            x={x(atMin[0]) - 7} y={y(minFret - start) + GAP_Y / 2 - 7}
            width={x(atMin[atMin.length - 1]) - x(atMin[0]) + 14} height={14}
            fill="#a98a7d" opacity={0.55}
          />
        )}
        {/* finger dots */}
        {fingering.frets.map((f, s) => {
          if (f === null || f === 0) return null
          const row = f - start
          if (row < 0 || row >= ROWS) return null
          const isRoot = pitchAt(s, f) === rootPc
          return (
            <circle key={`d${s}`} cx={x(s)} cy={y(row) + GAP_Y / 2} r={7.5} fill={isRoot ? '#ff6b00' : '#e5e2e1'} />
          )
        })}
        {/* note names */}
        {fingering.frets.map((f, s) => (
          <text key={`n${s}`} x={x(s)} y={H - 4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={f !== null && pitchAt(s, f) === rootPc ? '#ff6b00' : '#a98a7d'}>
            {f === null ? '' : nameByPc.get(pitchAt(s, f)) ?? ''}
          </text>
        ))}
      </svg>
    </figure>
  )
}
