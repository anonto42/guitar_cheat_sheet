import { cn } from '@/lib/utils'
import type { StrumPattern } from '@/types'

const GLYPH = { D: '↓', U: '↑', x: '×', M: '↓', '-': '' } as const
const NAME = { D: 'Down', U: 'Up', x: 'Chop', M: 'Muted', '-': 'Rest' } as const

interface StrumPatternViewProps {
  pattern: StrumPattern
  /** Step that is sounding right now. */
  activeStep?: number | null
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * Picture of a strumming pattern: one column per step, grouped by beat, with the count under
 * each arrow. Big arrows are strums, empty boxes are rests where the hand still moves.
 */
export default function StrumPatternView({ pattern, activeStep, size = 'lg', className }: StrumPatternViewProps) {
  const beats = pattern.steps.length / pattern.stepsPerBeat
  return (
    <div className={cn('overflow-x-auto', className)}>
      <ol className="flex min-w-max gap-2" aria-label={`${pattern.name} pattern`}>
        {Array.from({ length: beats }, (_, beat) => (
          <li key={beat} className="border border-line2 bg-bg3/60 p-1.5">
            <p className="px-1 pb-1 text-[0.6rem] font-bold uppercase tracking-widest text-outline">Beat {beat + 1}</p>
            <ol className="flex gap-1">
              {pattern.steps.slice(beat * pattern.stepsPerBeat, (beat + 1) * pattern.stepsPerBeat).map((symbol, i) => {
                const index = beat * pattern.stepsPerBeat + i
                const active = activeStep === index
                return (
                  <li
                    key={index}
                    aria-label={`${pattern.counts[index]}: ${NAME[symbol]}`}
                    className={cn(
                      'flex flex-col items-center justify-between border',
                      size === 'lg' ? 'h-24 w-12' : 'h-16 w-9',
                      active ? 'border-ember bg-ember text-bg2' : symbol === '-' ? 'border-dashed border-line2 text-outline' : 'border-line3 bg-surface text-cream',
                    )}
                  >
                    <span className={cn('flex flex-1 items-center font-bold leading-none', size === 'lg' ? 'text-3xl' : 'text-xl', symbol === 'M' && !active && 'text-outline')}>
                      {GLYPH[symbol]}
                    </span>
                    <span className="w-full border-t border-line2 py-1 text-center text-[0.65rem] font-bold">{pattern.counts[index]}</span>
                  </li>
                )
              })}
            </ol>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-outline">
        <span><b className="text-cream">↓</b> strum down</span>
        <span><b className="text-cream">↑</b> strum up</span>
        <span><b className="text-cream">×</b> muted chop</span>
        <span><b className="text-outline">↓</b> grey = palm muted</span>
        <span>empty box = rest, keep your hand moving</span>
      </p>
    </div>
  )
}
