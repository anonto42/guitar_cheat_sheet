import { cn } from '@/lib/utils'
import { pitchClass } from '@/lib/music/notes'

/** Open string pitch classes, low E to high E, standard tuning. */
const OPEN_STRINGS = [
  { label: 'E', pc: 4 },
  { label: 'A', pc: 9 },
  { label: 'D', pc: 2 },
  { label: 'G', pc: 7 },
  { label: 'B', pc: 11 },
  { label: 'e', pc: 4 },
]
const MARKER_FRETS = new Set([3, 5, 7, 9, 12, 15])

interface NoteMapProps {
  /** Scale or chord tones as spelled note names. */
  notes: string[]
  /** Note drawn as the home note. */
  tonic?: string
  /** Highest fret shown. */
  frets?: number
  /** Short description for screen readers and the caption. */
  label: string
  className?: string
}

/**
 * Every position of the given notes on the fretboard, generated from the tuning, so a new scale
 * or key needs no hand-drawn diagram. Strings run high e at the top to low E at the bottom.
 */
export default function NoteMap({ notes, tonic, frets = 12, label, className }: NoteMapProps) {
  const nameByPitch = new Map(notes.map(n => [pitchClass(n), n]))
  const tonicPitch = tonic ? pitchClass(tonic) : -1
  const fretNumbers = Array.from({ length: frets + 1 }, (_, i) => i)
  const strings = [...OPEN_STRINGS].reverse()

  return (
    <figure className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[44rem] border-collapse text-xs">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-8" />
            {fretNumbers.map(f => (
              <th key={f} scope="col" className="pb-2 text-center font-semibold text-outline">
                {f === 0 ? 'Open' : f}
                <span className={cn('mx-auto mt-1 block h-1.5 w-1.5', MARKER_FRETS.has(f) ? 'bg-outline/50' : 'bg-transparent')} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {strings.map(string => (
            <tr key={string.label}>
              <th scope="row" className="pr-2 text-right font-bold text-outline">{string.label}</th>
              {fretNumbers.map(f => {
                const pc = (string.pc + f) % 12
                const name = nameByPitch.get(pc)
                return (
                  <td
                    key={f}
                    className={cn(
                      'h-9 border-b border-line2 p-0 text-center align-middle',
                      f === 0 ? 'border-r-2 border-r-outline/60' : 'border-l border-l-line2',
                    )}
                  >
                    {name && (
                      <span
                        className={cn(
                          'inline-flex h-6 min-w-6 items-center justify-center px-1 text-[0.68rem] font-bold',
                          pc === tonicPitch ? 'bg-ember text-bg2' : 'bg-white/10 text-cream',
                        )}
                      >
                        {name}
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
