'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Select from '@/components/ui/Select'
import StrumPatternView from '@/components/music/StrumPatternView'
import { DRUM_STYLES, INSTRUMENTS, type DrumStyle, type InstrumentId, type Mix } from '@/lib/music/audio'
import type { StrumPattern } from '@/types'
import { CustomStepsEditor, patternFor, patternOptionsFor, timeOf } from './patterns'
import Panel from '@/components/ui/Panel'

interface BandTracksProps {
  chordsOn: boolean
  onChordsOn: (on: boolean) => void
  instrument: InstrumentId
  onInstrument: (id: InstrumentId) => void
  pattern: StrumPattern
  onPattern: (pattern: StrumPattern) => void
  drumsOn: boolean
  onDrumsOn: (on: boolean) => void
  drumStyle: DrumStyle
  onDrumStyle: (style: DrumStyle) => void
  bass: boolean
  onBass: (on: boolean) => void
  metronome: boolean
  onMetronome: (on: boolean) => void
  mix: Mix
  onMix: (mix: Mix) => void
  /** Step of the bar playing right now, to light up the strum picture. */
  activeStep: number | null
}

interface TrackProps {
  name: string
  color: string
  on: boolean
  onToggle: (on: boolean) => void
  level: number
  onLevel: (level: number) => void
  children?: React.ReactNode
}

/** One row of the band, like a track header in GarageBand: on/off, what it plays, how loud. */
function Track({ name, color, on, onToggle, level, onLevel, children }: TrackProps) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 border-b border-line2 py-4 last:border-b-0 last:pb-0 sm:grid-cols-[8rem_minmax(0,1fr)_10rem]">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${name} ${on ? 'on' : 'off'}`}
        onClick={() => onToggle(!on)}
        className="flex h-10 items-center gap-2.5 text-left"
      >
        <span className={cn('relative h-5 w-9 border transition-colors', on ? 'border-transparent' : 'border-line3 bg-bg3')} style={on ? { background: color } : undefined}>
          <span className={cn('absolute top-0.5 h-3.5 w-3.5 bg-cream transition-all', on ? 'left-[1.1rem]' : 'left-0.5 opacity-60')} />
        </span>
        <span className={cn('font-display text-sm font-bold', on ? 'text-cream' : 'text-outline')}>{name}</span>
      </button>
      <div className={cn('min-w-0', !on && 'opacity-50')}>{children}</div>
      <label className={cn('col-span-2 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-outline sm:col-span-1', !on && 'opacity-50')}>
        Volume
        <input
          type="range" min={0} max={100} value={Math.round(level * 100)}
          onChange={e => onLevel(Number(e.target.value) / 100)}
          aria-label={`${name} volume`}
          className="min-w-0 flex-1 accent-[#ff6b00]"
          disabled={!on}
        />
      </label>
    </li>
  )
}

/** The backing band: chords, bass, drums and metronome, each on its own row. */
export default function BandTracks(props: BandTracksProps) {
  const { chordsOn, onChordsOn, instrument, onInstrument, pattern, onPattern, drumsOn, onDrumsOn, drumStyle, onDrumStyle, bass, onBass, metronome, onMetronome, mix, onMix, activeStep } = props
  const [showStrum, setShowStrum] = useState(false)
  const level = (key: keyof Mix) => (v: number) => onMix({ ...mix, [key]: v })
  const custom = pattern.id.startsWith('custom')

  return (
    <Panel aria-label="Band" className="space-y-2">
      <h2 className="text-[0.65rem] font-bold uppercase tracking-widest text-ember-l">Band</h2>
      <ul>
        <Track name="Chords" color="#ff6b00" on={chordsOn} onToggle={onChordsOn} level={mix.chords} onLevel={level('chords')}>
          <div className="flex flex-wrap gap-2">
            <Select
              className="min-w-0 flex-1 basis-40"
              label="Played by" hideLabel size="sm"
              value={instrument}
              onChange={v => onInstrument(v as InstrumentId)}
              options={INSTRUMENTS.filter(i => i.id !== 'none').map(i => ({ value: i.id, label: i.label }))}
            />
            <Select
              className="min-w-0 flex-1 basis-48"
              label="Strumming pattern" hideLabel size="sm"
              value={pattern.id}
              onChange={id => onPattern(patternFor(id))}
              options={patternOptionsFor(timeOf(pattern))}
            />
          </div>
        </Track>
        {(showStrum || custom) && (
          <li className="space-y-3 border-b border-line2 pb-5 pt-1">
            {instrument === 'pad' && <p className="text-sm text-outline">The synth pad holds each chord. Strum this pattern yourself while it plays.</p>}
            {!chordsOn && <p className="text-sm text-outline">Chords are off. Strum this pattern yourself over the band.</p>}
            {custom && <CustomStepsEditor pattern={pattern} onPattern={onPattern} />}
            <StrumPatternView pattern={pattern} activeStep={activeStep} size="sm" />
          </li>
        )}
        {!custom && (
          <li className="border-b border-line2 py-2">
            <button type="button" onClick={() => setShowStrum(s => !s)} aria-expanded={showStrum} className="flex h-9 items-center gap-1.5 text-xs font-semibold text-ember-l hover:text-cream">
              <ChevronDown className={cn('h-4 w-4 transition-transform', showStrum && 'rotate-180')} aria-hidden />
              {showStrum ? 'Hide the strumming' : `See how to strum: ${pattern.name}`}
            </button>
          </li>
        )}

        <Track name="Drums" color="#f0c93a" on={drumsOn} onToggle={onDrumsOn} level={mix.drums} onLevel={level('drums')}>
          <Select
            className="min-w-0 sm:max-w-xs"
            label="Drum beat" hideLabel size="sm"
            value={drumStyle}
            onChange={v => onDrumStyle(v as DrumStyle)}
            options={DRUM_STYLES.filter(d => d.id !== 'off').map(d => ({ value: d.id, label: d.label }))}
          />
        </Track>
        <Track name="Bass" color="#6eb4ff" on={bass} onToggle={onBass} level={mix.bass} onLevel={level('bass')}>
          <p className="text-xs text-outline">Plays the root note of each chord.</p>
        </Track>
        <Track name="Metronome" color="#a98a7d" on={metronome} onToggle={onMetronome} level={mix.click} onLevel={level('click')}>
          <p className="text-xs text-outline">A click on every beat.</p>
        </Track>
      </ul>
    </Panel>
  )
}
