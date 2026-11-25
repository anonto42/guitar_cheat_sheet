'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import Select from '@/components/ui/Select'
import ChordDiagram from '@/components/music/ChordDiagram'
import { PRACTICE_PROGRESSIONS, chordsFromNotes, numeralFor, resolveType, type ProgressionStep } from '@/lib/music/progressions'
import { buildChord, getChordType } from '@/lib/music/chordTypes'
import { findFingerings } from '@/lib/music/fingerings'
import { triadsOf } from '@/lib/music/scales'
import { voiceChord } from '@/lib/music/voicing'
import { previewChord } from '@/lib/music/preview'
import { chordOptions, stepValue } from './chordOptions'
import { degreeColor } from './colors'
import type { SongSection } from './song'
import Panel from '@/components/ui/Panel'

interface ChordChartProps {
  /** Seven notes chords are built from. */
  harmony: string[]
  part: SongSection
  /** Change the part by hand. */
  onPart: (patch: Partial<SongSection>) => void
  selectedBar: number | null
  onSelectBar: (bar: number | null) => void
  /** Bar of this part playing right now, or null. */
  playingBar: number | null
  loopPart: boolean
  onLoopPart: (on: boolean) => void
}

const BAR_COUNTS = [1, 2, 3, 4, 6, 8, 12, 16]

/**
 * The selected part as a chord chart (like iReal Pro) and a palette of the key's chords
 * (like GarageBand chord strips and Hookpad). Tap a bar, then tap a chord to put it there.
 * Every chord is coloured by its scale degree, so the same chord always has the same colour.
 */
export default function ChordChart({ harmony, part, onPart, selectedBar, onSelectBar, playingBar, loopPart, onLoopPart }: ChordChartProps) {
  const [more, setMore] = useState(false)
  const chords = useMemo(() => chordsFromNotes(harmony, part.bars), [harmony, part.bars])
  const triads = useMemo(() => triadsOf(harmony), [harmony])
  const extra = useMemo(() => chordOptions(harmony).filter(o => !o.value.endsWith(':diatonic')), [harmony])

  const numeral = (step: ProgressionStep) =>
    step.type === 'diatonic' ? triads[step.degree - 1].numeral : numeralFor(step.degree, resolveType(harmony, step))

  const place = (step: ProgressionStep) => {
    const chord = buildChord(harmony[step.degree - 1], getChordType(resolveType(harmony, step)))
    previewChord(voiceChord(chord.notes))
    if (selectedBar === null) return
    onPart({ bars: part.bars.map((b, i) => (i === selectedBar ? step : b)) })
    onSelectBar(selectedBar < part.bars.length - 1 ? selectedBar + 1 : selectedBar)
  }

  // A part made from a template has no progression name, so look for a progression with the same chords.
  const same = (a: ProgressionStep, b: ProgressionStep) => a.degree === b.degree && resolveType(harmony, a) === resolveType(harmony, b)
  const sameAs = PRACTICE_PROGRESSIONS.find(p => p.steps.length === part.bars.length && p.steps.every((st, i) => same(st, part.bars[i])))
  const progressionId = part.presetId ?? sameAs?.id ?? 'custom'

  const selectedChord = selectedBar !== null ? chords[selectedBar] : null
  const shape = selectedChord ? findFingerings(selectedChord.notes, { maxResults: 1, optional: selectedChord.notes.length >= 5 ? [selectedChord.notes[2]] : undefined })[0] : undefined

  return (
    <Panel aria-label={`Chords for ${part.name}`} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-cream">{part.name}</h2>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Select
            className="min-w-0 flex-1 sm:w-64 sm:flex-none"
            label="Use a progression"
            size="sm"
            value={progressionId}
            onChange={id => { const p = PRACTICE_PROGRESSIONS.find(x => x.id === id); if (p) onPart({ bars: p.steps, presetId: p.id }) }}
            options={[...PRACTICE_PROGRESSIONS.map(p => ({ value: p.id, label: `${p.name} (${p.numerals})` })), { value: 'custom', label: 'Custom chords', disabled: true }]}
          />
          <Select
            className="w-28"
            label="Bars"
            size="sm"
            value={String(part.bars.length)}
            onChange={v => onPart({ bars: Array.from({ length: Number(v) }, (_, i) => part.bars[i] ?? part.bars[i % part.bars.length]) })}
            options={BAR_COUNTS.map(n => ({ value: String(n), label: `${n} bar${n > 1 ? 's' : ''}` }))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {/* Chart */}
          <ol className="grid grid-cols-4 border-l border-t border-line3" aria-label="Bars">
            {part.bars.map((step, i) => {
              const chord = chords[i]
              const color = degreeColor(step.degree)
              const isSelected = selectedBar === i
              return (
                <li key={i} className="border-b border-r border-line3">
                  <button
                    type="button"
                    onClick={() => onSelectBar(isSelected ? null : i)}
                    aria-pressed={isSelected}
                    aria-label={`Bar ${i + 1}: ${chord.name}`}
                    className={cn(
                      'relative flex h-20 w-full flex-col justify-between p-2 text-left transition-colors',
                      playingBar === i ? 'bg-ember-dim' : 'hover:bg-white/[0.03]',
                      isSelected && 'ring-2 ring-inset ring-cream',
                    )}
                  >
                    <span className="text-[0.65rem] font-bold text-outline">{i + 1}</span>
                    <span className="truncate font-display text-xl font-bold sm:text-2xl" style={{ color }}>{chord.name}</span>
                    <span className="text-[0.65rem] font-semibold text-outline">{numeral(step)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="text-xs text-outline">
              {selectedBar === null ? 'Tap a bar to change its chord. Tap a chord below to hear it.' : `Bar ${selectedBar + 1} selected. Tap a chord below to put it there.`}
            </p>
            <label className="flex min-h-9 items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={loopPart} onChange={e => onLoopPart(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" />
              Loop only {part.name}
            </label>
          </div>

          {/* Palette */}
          <div className="space-y-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Chords in this key</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {triads.map((t, i) => {
                const step = { degree: i + 1, type: 'diatonic' }
                const color = degreeColor(i + 1)
                const inSelected = selectedBar !== null && stepValue(part.bars[selectedBar]) === stepValue(step)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => place(step)}
                    className={cn('flex h-16 flex-col items-center justify-center border-2 transition-transform active:scale-95', inSelected ? 'border-cream' : 'border-transparent')}
                    style={{ background: `${color}2e` }}
                  >
                    <span className="font-display text-lg font-bold" style={{ color }}>{t.name}</span>
                    <span className="text-[0.65rem] font-semibold text-outline">{t.numeral}</span>
                  </button>
                )
              })}
            </div>
            <button type="button" onClick={() => setMore(m => !m)} className="flex min-h-9 items-center text-xs font-semibold text-ember-l hover:text-cream" aria-expanded={more}>
              {more ? 'Fewer chords' : 'More chords: 7ths and borrowed chords'}
            </button>
            {more && (
              <div className="flex flex-wrap gap-1.5">
                {extra.map(o => {
                  const chord = buildChord(harmony[o.degree - 1], getChordType(o.type))
                  const color = degreeColor(o.degree)
                  return (
                    <button key={o.value} type="button" onClick={() => place(o)} className="flex h-10 min-w-16 flex-col items-center justify-center border border-line2 px-2 hover:border-line3">
                      <span className="text-sm font-bold" style={{ color }}>{chord.name}</span>
                      <span className="text-[0.65rem] text-outline">{numeralFor(o.degree, o.type)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {selectedChord && shape && (
          <div className="flex shrink-0 justify-center border border-line2 bg-bg3/60 px-3 pb-2 pt-3">
            <ChordDiagram name={selectedChord.name} fingering={shape} notes={selectedChord.notes} caption={`Bar ${(selectedBar ?? 0) + 1}`} />
          </div>
        )}
      </div>
    </Panel>
  )
}
