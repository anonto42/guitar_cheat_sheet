'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RhythmRow {
  id: string
  label: string
  /** Notes in one beat. */
  perBeat: number
  /** Spoken count for one beat, one word per note. */
  count: string[]
}

export const RHYTHM_ROWS: RhythmRow[] = [
  { id: 'quarter', label: 'Quarter notes: 1 note per beat', perBeat: 1, count: ['1'] },
  { id: 'eighth', label: 'Eighth notes: 2 notes per beat', perBeat: 2, count: ['1', '&'] },
  { id: 'triplet', label: 'Triplets: 3 notes per beat', perBeat: 3, count: ['1', 'trip', 'let'] },
  { id: 'sixteenth', label: 'Sixteenth notes: 4 notes per beat', perBeat: 4, count: ['1', 'e', '&', 'a'] },
]

const BEATS = 4

/**
 * Compare note values side by side. Every row fills the same 4 beats, so you can see that faster
 * rhythms only split each beat into more equal parts. Each row can be played as clicks.
 */
export default function RhythmGrid({ rows = RHYTHM_ROWS }: { rows?: RhythmRow[] }) {
  const [bpm, setBpm] = useState(70)
  const [playing, setPlaying] = useState<string | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const timers = useRef<number[]>([])

  const stop = () => {
    timers.current.forEach(t => window.clearTimeout(t))
    timers.current = []
    void ctxRef.current?.close()
    ctxRef.current = null
    setPlaying(null)
    setActive(null)
  }
  useEffect(() => stop, [])

  const play = (row: RhythmRow) => {
    stop()
    const ctx = new (window.AudioContext ?? window.webkitAudioContext!)()
    ctxRef.current = ctx
    const beat = 60 / bpm
    const start = ctx.currentTime + 0.1
    const total = BEATS * row.perBeat * 2 // two bars
    for (let i = 0; i < total; i++) {
      const t = start + (i * beat) / row.perBeat
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = i % row.perBeat === 0 ? 1500 : 950
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(i % row.perBeat === 0 ? 0.12 : 0.07, t)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.05)
      timers.current.push(window.setTimeout(() => setActive(i % (BEATS * row.perBeat)), (t - ctx.currentTime) * 1000))
    }
    timers.current.push(window.setTimeout(stop, (total * beat * 1000) / row.perBeat + 400))
    setPlaying(row.id)
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-sm text-muted">
        Tempo <span className="w-16 font-bold text-ember-l">{bpm} BPM</span>
        <input type="range" min={40} max={120} value={bpm} onChange={e => setBpm(Number(e.target.value))} className="h-9 w-40 accent-[#ff6b00]" />
      </label>
      {rows.map(row => (
        <div key={row.id} className="border border-line2 bg-surface/70 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-cream">{row.label}</p>
            <button
              type="button"
              onClick={() => (playing === row.id ? stop() : play(row))}
              className="flex h-9 items-center gap-1.5 border border-line2 px-3 text-xs font-semibold text-outline hover:text-cream"
            >
              {playing === row.id ? <Square size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}
              {playing === row.id ? 'Stop' : 'Hear it'}
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: BEATS }, (_, b) => (
              <div key={b} className="flex border border-line bg-bg3/60">
                {row.count.map((word, n) => {
                  const index = b * row.perBeat + n
                  const on = playing === row.id && active === index
                  return (
                    <span
                      key={n}
                      className={cn(
                        'flex flex-1 flex-col items-center py-1.5 text-[0.7rem] font-bold',
                        on ? 'bg-ember text-bg2' : n === 0 ? 'text-cream' : 'text-outline',
                      )}
                    >
                      <span className={cn('mb-1 h-2.5 w-2.5', on ? 'bg-bg2' : n === 0 ? 'bg-ember' : 'bg-ember/50')} />
                      {n === 0 ? String(b + 1) : word}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
