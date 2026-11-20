'use client'

import Select from '@/components/ui/Select'
import { DRUM_STYLES, INSTRUMENTS, type DrumStyle, type InstrumentId, type Mix } from '@/lib/music/audio'

interface SoundPanelProps {
  instrument: InstrumentId
  onInstrument: (id: InstrumentId) => void
  drums: DrumStyle
  onDrums: (style: DrumStyle) => void
  bass: boolean
  onBass: (on: boolean) => void
  mix: Mix
  onMix: (mix: Mix) => void
}

const LEVELS: { key: keyof Mix; label: string }[] = [
  { key: 'chords', label: 'Chords' },
  { key: 'bass', label: 'Bass' },
  { key: 'drums', label: 'Drums' },
  { key: 'click', label: 'Click' },
]

/** Choose what backs you up and how loud each part is. */
export default function SoundPanel({ instrument, onInstrument, drums, onDrums, bass, onBass, mix, onMix }: SoundPanelProps) {
  return (
    <section aria-label="Sound" className="space-y-4 border border-line2 bg-surface/70 p-5">
      <h2 className="font-display text-lg font-bold text-cream">Sound</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Chord instrument" value={instrument} onChange={v => onInstrument(v as InstrumentId)} options={INSTRUMENTS.map(i => ({ value: i.id, label: i.label }))} />
        <Select label="Drums" value={drums} onChange={v => onDrums(v as DrumStyle)} options={DRUM_STYLES.map(d => ({ value: d.id, label: d.label }))} />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={bass} onChange={e => onBass(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Bass guitar plays the root note
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {LEVELS.map(level => (
          <label key={level.key} className="flex items-center gap-3 text-xs font-semibold text-outline">
            <span className="w-14">{level.label}</span>
            <input
              type="range" min={0} max={100} value={Math.round(mix[level.key] * 100)}
              onChange={e => onMix({ ...mix, [level.key]: Number(e.target.value) / 100 })}
              className="flex-1 accent-[#ff6b00]"
            />
          </label>
        ))}
      </div>
    </section>
  )
}
