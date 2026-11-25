'use client'

import StrumPatternView from '@/components/music/StrumPatternView'
import type { InstrumentId } from '@/lib/music/audio'
import type { StrumPattern } from '@/types'
import { CustomStepsEditor } from './patterns'

interface StrumCardProps {
  pattern: StrumPattern
  onPattern: (pattern: StrumPattern) => void
  instrument: InstrumentId
  activeStep: number | null
}

/** How your strumming hand moves in every bar, lit up while the loop plays. */
export default function StrumCard({ pattern, onPattern, instrument, activeStep }: StrumCardProps) {
  const unused = instrument === 'pad' || instrument === 'none'
  return (
    <section aria-label="Strumming" className="min-w-0 space-y-3 border border-line2 bg-surface/70 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-cream">Strumming: {pattern.name}</h2>
        <p className="text-xs text-outline">{pattern.time}, repeats every bar</p>
      </div>
      {unused && (
        <p className="text-sm text-outline">
          {instrument === 'pad' ? 'The synth pad does not strum. Use this pattern yourself while it plays.' : 'Strum this pattern yourself over the drums and bass.'}
        </p>
      )}
      {pattern.id.startsWith('custom') && <CustomStepsEditor pattern={pattern} onPattern={onPattern} />}
      <StrumPatternView pattern={pattern} activeStep={activeStep} size="sm" />
    </section>
  )
}
