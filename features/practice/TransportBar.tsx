'use client'

import { useRef } from 'react'
import { Circle, Minus, Pause, Play, Plus, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface TransportBarProps {
  playing: boolean
  recording: boolean
  bpm: number
  onBpm: (bpm: number) => void
  countIn: boolean
  onCountIn: (on: boolean) => void
  metronome: boolean
  onMetronome: (on: boolean) => void
  onPlay: () => void
  onRecord: () => void
  status: string
}

const clampBpm = (n: number) => Math.min(220, Math.max(30, Math.round(n)))

/** Sticky controls at the top of the studio: play, record, tempo and click. */
export default function TransportBar(props: TransportBarProps) {
  const { playing, recording, bpm, onBpm, countIn, onCountIn, metronome, onMetronome, onPlay, onRecord, status } = props
  const taps = useRef<number[]>([])

  const tap = () => {
    const now = performance.now()
    const recent = [...taps.current.filter(t => now - t < 3000), now].slice(-5)
    taps.current = recent
    if (recent.length >= 2) {
      const gaps = recent.slice(1).map((t, i) => t - recent[i])
      onBpm(clampBpm(60000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length)))
    }
  }

  return (
    <div className="sticky top-[calc(var(--nav-h)+var(--safe-top))] z-40 -mx-4 border-y border-line2 bg-bg2/95 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:border-x">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onPlay} aria-pressed={playing} disabled={recording}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {playing ? 'Stop' : 'Play'}
        </Button>
        <Button variant="secondary" onClick={onRecord} aria-pressed={recording} className={cn(recording && 'border-tunings text-tunings')}>
          {recording ? <Square size={14} aria-hidden="true" /> : <Circle size={14} className="text-tunings" aria-hidden="true" />}
          {recording ? 'Stop recording' : 'Record'}
        </Button>

        <div className="flex items-center gap-1" role="group" aria-label="Tempo">
          <button type="button" aria-label="Slower" onClick={() => onBpm(clampBpm(bpm - 1))} className="flex h-[var(--control-h)] w-9 items-center justify-center border border-line3 text-outline hover:text-cream"><Minus size={14} /></button>
          <label className="sr-only" htmlFor="bpm-input">Tempo in BPM</label>
          <input
            id="bpm-input" type="number" min={30} max={220} value={bpm}
            onChange={e => onBpm(clampBpm(Number(e.target.value) || bpm))}
            className="h-[var(--control-h)] w-16 border border-line3 bg-surface text-center text-sm font-bold text-cream"
          />
          <button type="button" aria-label="Faster" onClick={() => onBpm(clampBpm(bpm + 1))} className="flex h-[var(--control-h)] w-9 items-center justify-center border border-line3 text-outline hover:text-cream"><Plus size={14} /></button>
          <span className="ml-1 text-xs font-bold text-outline">BPM</span>
        </div>
        <input type="range" min={30} max={220} value={bpm} onChange={e => onBpm(Number(e.target.value))} aria-label="Tempo slider" className="w-32 accent-[#ff6b00] sm:w-44" />
        <button type="button" onClick={tap} className="h-[var(--control-h)] border border-line3 px-3 text-xs font-bold text-outline hover:text-cream">Tap tempo</button>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={metronome} onChange={e => onMetronome(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Click
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={countIn} onChange={e => onCountIn(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Count-in
        </label>
        <p className="ml-auto text-sm font-semibold text-cream" aria-live="polite">{status}</p>
      </div>
    </div>
  )
}
