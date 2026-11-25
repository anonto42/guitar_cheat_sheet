'use client'

import { Circle, Minus, Pause, Play, Plus, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { SCALE_CHOICES } from '@/lib/music/scales'
import { TIME_SIGNATURES } from './patterns'

interface ControlBarProps {
  playing: boolean
  recording: boolean
  onPlay: () => void
  onRecord: () => void
  bpm: number
  onBpm: (bpm: number) => void
  tonic: string
  roots: string[]
  onKey: (tonic: string) => void
  scaleId: string
  onScale: (id: string) => void
  /** Time signature, for example "4/4". */
  time: string
  onTime: (time: string) => void
  countIn: boolean
  onCountIn: (on: boolean) => void
  /** Where the song is right now, for example "Verse · bar 2 of 4 · Am". */
  status: string
}

const clampBpm = (n: number) => Math.min(220, Math.max(30, Math.round(n)))

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col justify-center px-3', className)}>
      <span className="text-[0.55rem] font-bold uppercase tracking-widest text-outline">{label}</span>
      {children}
    </div>
  )
}

/**
 * The studio's control bar, modelled on GarageBand: play and record on the left, then one
 * display with tempo, key, scale and time signature. It stays at the top while you scroll.
 */
export default function ControlBar(props: ControlBarProps) {
  const { playing, recording, onPlay, onRecord, bpm, onBpm, tonic, roots, onKey, scaleId, onScale, time, onTime, countIn, onCountIn, status } = props

  return (
    <div className="sticky top-[calc(var(--nav-h)+var(--safe-top))] z-40 -mx-4 border-y border-line2 bg-bg2/95 px-4 py-3 backdrop-blur-xl sm:px-5 sm:mx-0 sm:border-x">
      <div className="flex flex-wrap items-stretch gap-2.5">
        <div className="flex gap-2">
          <Button onClick={onPlay} aria-pressed={playing} disabled={recording} className="h-12 px-5">
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {playing ? 'Stop' : 'Play'}
          </Button>
          <Button variant="secondary" onClick={onRecord} aria-pressed={recording} className={cn('h-12 px-4', recording && 'border-tunings text-tunings')}>
            {recording ? <Square size={14} aria-hidden="true" /> : <Circle size={14} className="text-tunings" aria-hidden="true" />}
            <span className="hidden sm:inline">{recording ? 'Stop recording' : 'Record'}</span>
          </Button>
        </div>

        {/* The display */}
        <div className="order-last flex min-w-0 flex-[1_1_16rem] flex-wrap sm:order-none items-stretch divide-x divide-line2 border border-line3 bg-bg3">
          <Field label="Tempo">
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Slower" onClick={() => onBpm(clampBpm(bpm - 1))} className="flex h-7 w-6 items-center justify-center text-outline hover:text-cream"><Minus size={13} /></button>
              <label className="sr-only" htmlFor="bpm-input">Tempo in beats per minute</label>
              <input
                id="bpm-input" type="number" min={30} max={220} value={bpm}
                onChange={e => onBpm(clampBpm(Number(e.target.value) || bpm))}
                className="h-7 w-12 bg-transparent text-center font-display text-lg font-bold text-cream"
              />
              <button type="button" aria-label="Faster" onClick={() => onBpm(clampBpm(bpm + 1))} className="flex h-7 w-6 items-center justify-center text-outline hover:text-cream"><Plus size={13} /></button>
              <span className="text-[0.65rem] font-bold text-outline">BPM</span>
            </div>
          </Field>
          <Field label="Key" className="w-24">
            <Select label="Key" hideLabel size="sm" value={tonic} onChange={onKey} options={roots.map(r => ({ value: r, label: r }))} className="[&_button]:h-7 [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-0 [&_button]:font-display [&_button]:text-lg" />
          </Field>
          <Field label="Scale" className="min-w-[10rem] flex-1">
            <Select label="Scale or mode" hideLabel size="sm" value={scaleId} onChange={onScale} options={SCALE_CHOICES.map(c => ({ value: c.id, label: c.label, group: c.group }))} className="[&_button]:h-7 [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-0 [&_button]:text-sm" />
          </Field>
          <Field label="Time" className="w-20">
            <Select label="Time signature" hideLabel size="sm" value={time} onChange={onTime} options={TIME_SIGNATURES} className="[&_button]:h-7 [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-0 [&_button]:font-display [&_button]:text-lg" />
          </Field>
        </div>

        <div className="ml-auto flex items-center gap-4 px-1 sm:ml-0">
          <label className="flex items-center gap-2 text-sm text-muted" title="One bar of ticks before the music starts, so you are ready on beat 1">
            <input type="checkbox" checked={countIn} onChange={e => onCountIn(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Count-in
          </label>
        </div>
      </div>
      <p className="mt-2 truncate text-xs font-semibold text-ember-l" aria-live="polite">{status}</p>
    </div>
  )
}
