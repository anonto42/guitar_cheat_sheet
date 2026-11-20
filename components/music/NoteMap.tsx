'use client'

import { useEffect, useRef } from 'react'
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
  /** Fret window to highlight (for a scale position). Notes outside it are dimmed. */
  range?: [number, number]
  /** Notes to outline, for example the tones of the chord playing right now. */
  emphasis?: string[]
  /** Short description for screen readers. */
  label: string
  className?: string
}

/**
 * Every position of the given notes on the fretboard, generated from the tuning, so any scale,
 * chord or key needs no hand-drawn diagram. Strings run high e at the top to low E at the bottom.
 */
export default function NoteMap({ notes, tonic, frets = 15, range, emphasis, label, className }: NoteMapProps) {
  const nameByPitch = new Map(notes.map(n => [pitchClass(n), n]))
  const tonicPitch = tonic ? pitchClass(tonic) : -1
  const emphasised = new Set((emphasis ?? []).map(pitchClass))
  const fretNumbers = Array.from({ length: frets + 1 }, (_, i) => i)
  const strings = [...OPEN_STRINGS].reverse()
  const inRange = (f: number) => !range || (f >= range[0] && f <= range[1])
  const figure = useRef<HTMLElement>(null)
  const start = range?.[0]

  // On narrow screens the map scrolls sideways: bring the chosen position into view.
  useEffect(() => {
    const el = figure.current
    if (!el || start === undefined) return
    const cell = el.querySelector<HTMLElement>(`[data-fret="${start}"]`)
    if (cell) el.scrollTo({ left: Math.max(0, cell.offsetLeft - 40), behavior: 'smooth' })
  }, [start])

  return (
    <figure ref={figure} className={cn('overflow-x-auto border border-line2 bg-bg3/60 p-3', className)}>
      <table className="w-full min-w-[46rem] border-collapse text-xs">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-7" />
            {fretNumbers.map(f => (
              <th key={f} scope="col" data-fret={f} className={cn('pb-1.5 text-center font-semibold', inRange(f) && range ? 'text-ember-l' : 'text-outline')}>
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
                const lit = inRange(f)
                return (
                  <td
                    key={f}
                    className={cn(
                      'h-8 border-b border-line2 p-0 text-center align-middle',
                      f === 0 ? 'border-r-[3px] border-r-outline/70' : 'border-l border-l-line2',
                      range && lit && 'bg-ember/[0.06]',
                    )}
                  >
                    {name && (
                      <span
                        className={cn(
                          'inline-flex h-6 min-w-6 items-center justify-center px-1 text-[0.68rem] font-bold transition-opacity',
                          pc === tonicPitch ? 'bg-ember text-bg2' : 'bg-white/10 text-cream',
                          emphasised.has(pc) && 'outline outline-2 outline-offset-1 outline-amber',
                          !lit && 'opacity-25',
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
