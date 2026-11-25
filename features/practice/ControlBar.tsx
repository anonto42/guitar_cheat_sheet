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
    <div className={cn('flex flex-col justify-center px-3 py-1', className)}>
      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">{label}</span>
      {children}
    </div>
  )
}

/** Restyles the shared Select as a borderless value inside the display. */
const DISPLAY_SELECT = '[&_button]:h-9 [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-0'

/**
 * The studio's control bar, modelled on GarageBand: play and record on the left, then one
 * display with tempo, key, scale and time signature. It stays at the top while you scroll.
 * On phones and tablets only play, record and tempo stay pinned; key, scale and time sit just below, so the
 * pinned bar covers as little of the small screen as possible.
 */
export default function ControlBar(props: ControlBarProps) {
  const { playing, recording, onPlay, onRecord, bpm, onBpm, tonic, roots, onKey, scaleId, onScale, time, onTime, countIn, onCountIn, status } = props

  const songFields = (
    <>
      <Field label="Key" className="w-24 shrink-0">
        <Select label="Key" hideLabel size="sm" value={tonic} onChange={onKey} options={roots.map(r => ({ value: r, label: r }))} className={cn(DISPLAY_SELECT, '[&_button]:font-display [&_button]:text-lg')} />
      </Field>
      <Field label="Scale" className="min-w-0 flex-1">
        <Select label="Scale or mode" hideLabel size="sm" value={scaleId} onChange={onScale} options={SCALE_CHOICES.map(c => ({ value: c.id, label: c.label, group: c.group }))} className={cn(DISPLAY_SELECT, '[&_button]:text-sm')} />
      </Field>
      <Field label="Time" className="w-20 shrink-0">
        <Select label="Time signature" hideLabel size="sm" value={time} onChange={onTime} options={TIME_SIGNATURES} className={cn(DISPLAY_SELECT, '[&_button]:font-display [&_button]:text-lg')} />
      </Field>
    </>
  )
  const countInToggle = (
    <label className="flex min-h-9 shrink-0 items-center gap-2 text-sm text-muted" title="One bar of ticks before the music starts, so you are ready on beat 1">
      <input type="checkbox" checked={countIn} onChange={e => onCountIn(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Count-in
    </label>
  )

  return (
    <>
      <div className="sticky top-[calc(var(--nav-h)+var(--safe-top))] z-40 -mx-4 border-y border-line2 bg-bg2/95 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:border-x sm:px-5">
        <div className="flex items-stretch gap-2">
          <Button onClick={onPlay} aria-pressed={playing} disabled={recording} className="h-auto min-h-12 shrink-0 px-5">
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {playing ? 'Stop' : 'Play'}
          </Button>
          <Button variant="secondary" onClick={onRecord} aria-pressed={recording} aria-label={recording ? 'Stop recording' : 'Record'} className={cn('h-auto min-h-12 shrink-0 px-4', recording && 'border-tunings text-tunings')}>
            {recording ? <Square size={14} aria-hidden="true" /> : <Circle size={14} className="text-tunings" aria-hidden="true" />}
            <span className="hidden sm:inline">{recording ? 'Stop recording' : 'Record'}</span>
          </Button>

          {/* The display */}
          <div className="flex min-w-0 flex-1 items-stretch divide-x divide-line2 border border-line3 bg-bg3">
            <Field label="Tempo" className="shrink-0 px-1 sm:px-3">
              <div className="flex items-center">
                <button type="button" aria-label="Slower" onClick={() => onBpm(clampBpm(bpm - 1))} className="flex h-9 w-9 items-center justify-center text-outline hover:text-cream"><Minus size={14} /></button>
                <label className="sr-only" htmlFor="bpm-input">Tempo in beats per minute</label>
                <input
                  id="bpm-input" type="number" inputMode="numeric" min={30} max={220} value={bpm}
                  onChange={e => onBpm(clampBpm(Number(e.target.value) || bpm))}
                  className="h-9 w-11 bg-transparent text-center font-display text-lg font-bold text-cream"
                />
                <button type="button" aria-label="Faster" onClick={() => onBpm(clampBpm(bpm + 1))} className="flex h-9 w-9 items-center justify-center text-outline hover:text-cream"><Plus size={14} /></button>
                <span className="ml-1 hidden text-[0.65rem] font-bold text-outline min-[400px]:inline">BPM</span>
              </div>
            </Field>
            <div className="hidden min-w-0 flex-1 divide-x divide-line2 lg:flex">{songFields}</div>
          </div>

          <div className="hidden items-center pl-2 lg:flex">{countInToggle}</div>
        </div>
        <p className="mt-2 truncate text-xs font-semibold text-ember-l" aria-live="polite">{status}</p>
      </div>

      {/* Phones and tablets: the song settings sit below the pinned bar instead of inside it. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:hidden">
        <div className="flex min-w-0 flex-[1_1_16rem] items-stretch divide-x divide-line2 border border-line3 bg-bg3">{songFields}</div>
        {countInToggle}
      </div>
    </>
  )
}
