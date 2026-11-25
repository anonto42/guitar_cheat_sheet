'use client'

import Select from '@/components/ui/Select'
import { DRUM_STYLES, INSTRUMENTS, type DrumStyle, type InstrumentId, type Mix } from '@/lib/music/audio'
import { ROOTS, SCALE_CHOICES, type ScaleQuality } from '@/lib/music/scales'
import type { StrumPattern } from '@/types'
import { PATTERN_OPTIONS, patternFor } from './patterns'

interface StudioSidebarProps {
  tonic: string
  onKey: (tonic: string) => void
  scaleId: string
  quality: ScaleQuality
  onScale: (scaleId: string) => void
  pattern: StrumPattern
  onPattern: (pattern: StrumPattern) => void
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
  { key: 'click', label: 'Metronome' },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="min-w-0 space-y-4 border border-line2 bg-surface/70 p-4">
      <h2 className="text-[0.7rem] font-bold uppercase tracking-widest text-ember-l">{title}</h2>
      {children}
    </section>
  )
}

/** The two settings cards beside the song: which key, and how the band sounds. */
export default function StudioSidebar(props: StudioSidebarProps) {
  const { tonic, onKey, scaleId, quality, onScale, pattern, onPattern, instrument, onInstrument, drums, onDrums, bass, onBass, mix, onMix } = props
  return (
    <div className="space-y-4">
      <Card title="Key">
        <Select label="Key" value={tonic} onChange={onKey} options={ROOTS[quality].map(r => ({ value: r, label: r }))} />
        <Select label="Scale or mode" value={scaleId} onChange={onScale} options={SCALE_CHOICES.map(c => ({ value: c.id, label: c.label, group: c.group }))} />
      </Card>

      <Card title="Sound">
        <Select label="Chords played by" value={instrument} onChange={v => onInstrument(v as InstrumentId)} options={INSTRUMENTS.map(i => ({ value: i.id, label: i.label }))} />
        <Select label="Strumming pattern" value={pattern.id} onChange={id => onPattern(patternFor(id))} options={PATTERN_OPTIONS} disabled={instrument === 'pad'} />
        <Select label="Drums" value={drums} onChange={v => onDrums(v as DrumStyle)} options={DRUM_STYLES.map(d => ({ value: d.id, label: d.label }))} />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={bass} onChange={e => onBass(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" />
          Add a bass guitar
        </label>
        <details className="border-t border-line pt-3">
          <summary className="cursor-pointer text-xs font-semibold text-outline hover:text-cream">Volume levels</summary>
          <div className="mt-3 space-y-2.5">
            {LEVELS.map(level => (
              <label key={level.key} className="flex items-center gap-3 text-xs font-semibold text-outline">
                <span className="w-[4.5rem]">{level.label}</span>
                <input
                  type="range" min={0} max={100} value={Math.round(mix[level.key] * 100)}
                  onChange={e => onMix({ ...mix, [level.key]: Number(e.target.value) / 100 })}
                  className="min-w-0 flex-1 accent-[#ff6b00]"
                />
              </label>
            ))}
          </div>
        </details>
      </Card>
    </div>
  )
}
