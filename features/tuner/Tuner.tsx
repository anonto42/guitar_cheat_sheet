'use client'

import { useEffect, useRef, useState } from 'react'
import { PitchDetector } from 'pitchy'
import Link from 'next/link'
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { TUNINGS, getTuning, type TuningString } from '@/lib/music/tunings'

const NOTE_NAMES = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B']
const IN_TUNE_CENTS = 5

interface Reading {
  frequency: number
  note: string
  stringIndex: number
  cents: number
}

const centsBetween = (frequency: number, target: number) => 1200 * Math.log2(frequency / target)

function noteName(frequency: number): string {
  const midi = Math.round(69 + 12 * Math.log2(frequency / 440))
  return `${NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`
}

interface TunerProps {
  /** Tuning to start with, by tuning entry id. */
  tuningId?: string
  /** Show the dropdown to switch tunings. */
  selectable?: boolean
}

/**
 * Microphone tuner. Pitch detection uses the open source pitchy library (McLeod Pitch Method,
 * MIT licence). Audio never leaves the device. Each string button also plays a reference note,
 * for tuning by ear without a microphone.
 */
export default function Tuner({ tuningId, selectable = true }: TunerProps) {
  const [currentId, setCurrentId] = useState(tuningId ?? TUNINGS[0].id)
  const tuning = getTuning(currentId)
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reading, setReading] = useState<Reading | null>(null)
  const [locked, setLocked] = useState<number | null>(null)

  const session = useRef<{ ctx: AudioContext; stream: MediaStream; frame: number } | null>(null)
  const history = useRef<number[]>([])
  const settings = useRef({ strings: tuning.strings, locked })
  useEffect(() => { settings.current = { strings: tuning.strings, locked } }, [tuning, locked])

  const stop = () => {
    const s = session.current
    if (s) {
      cancelAnimationFrame(s.frame)
      s.stream.getTracks().forEach(t => t.stop())
      void s.ctx.close()
    }
    session.current = null
    setListening(false)
    setReading(null)
  }

  useEffect(() => stop, [])

  const start = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = new (window.AudioContext ?? window.webkitAudioContext!)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      ctx.createMediaStreamSource(stream).connect(analyser)
      const buffer = new Float32Array(analyser.fftSize)
      const detector = PitchDetector.forFloat32Array(analyser.fftSize)
      detector.minVolumeDecibels = -50

      const loop = () => {
        analyser.getFloatTimeDomainData(buffer)
        const [pitch, clarity] = detector.findPitch(buffer, ctx.sampleRate)
        if (clarity > 0.9 && pitch > 55 && pitch < 1400) {
          const h = history.current
          h.push(pitch)
          if (h.length > 5) h.shift()
          const smooth = [...h].sort((a, b) => a - b)[Math.floor(h.length / 2)]
          const { strings, locked: lock } = settings.current
          const index = lock ?? strings.reduce((best, s, i) =>
            Math.abs(centsBetween(smooth, s.frequency)) < Math.abs(centsBetween(smooth, strings[best].frequency)) ? i : best, 0)
          setReading({ frequency: smooth, note: noteName(smooth), stringIndex: index, cents: centsBetween(smooth, strings[index].frequency) })
        }
        if (session.current) session.current.frame = requestAnimationFrame(loop)
      }
      session.current = { ctx, stream, frame: requestAnimationFrame(loop) }
      setListening(true)
    } catch (err) {
      const denied = err instanceof DOMException && err.name === 'NotAllowedError'
      setError(denied ? 'Microphone access was blocked. Allow it in your browser settings and try again.' : 'Could not open the microphone on this device.')
    }
  }

  const playReference = (string: TuningString) => {
    const ctx = new (window.AudioContext ?? window.webkitAudioContext!)()
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = string.frequency
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 2.6)
    osc.onended = () => void ctx.close()
  }

  const cents = reading ? Math.max(-50, Math.min(50, reading.cents)) : 0
  const inTune = reading !== null && Math.abs(reading.cents) <= IN_TUNE_CENTS
  const farOff = reading !== null && Math.abs(reading.cents) > 50
  const status = !reading
    ? listening ? 'Play one string and let it ring.' : 'Press Start tuner and allow the microphone.'
    : inTune ? 'In tune'
    : reading.cents < 0 ? 'Too low. Tighten the string (tune up).' : 'Too high. Loosen the string (tune down).'

  return (
    <div className="space-y-6 border border-line2 bg-surface/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-4">
        {selectable && (
          <Select className="w-full sm:w-auto sm:min-w-[18rem]" label="Tuning" value={currentId} onChange={id => { setCurrentId(id); setLocked(null) }} options={TUNINGS.map(t => ({ value: t.id, label: t.name }))} />
        )}
        {!selectable && (
          <div className="flex flex-col gap-1.5">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Tuning</span>
            <p className="flex h-[var(--control-h)] items-center border border-line3 bg-surface px-3 text-sm font-semibold text-cream">{tuning.name}</p>
          </div>
        )}
        <Button onClick={listening ? stop : start} variant={listening ? 'secondary' : 'primary'} className="h-[var(--control-h)]">
          {listening ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          {listening ? 'Stop tuner' : 'Start tuner'}
        </Button>
      </div>
      {!selectable && (
        <p className="-mt-2 text-xs text-outline">
          Need a different tuning? <Link href="/tuner" className="font-semibold text-ember-l hover:text-cream">Open the full tuner</Link>
        </p>
      )}
      {error && <p role="alert" className="text-sm text-tunings">{error}</p>}

      <div className="text-center" aria-live="polite">
        <p className={cn('font-display text-6xl font-bold', inTune ? 'text-theory' : 'text-cream')}>{reading?.note ?? '–'}</p>
        <p className="mt-1 text-sm text-outline">
          {reading ? `${reading.frequency.toFixed(1)} Hz · target ${tuning.strings[reading.stringIndex].label} ${tuning.strings[reading.stringIndex].frequency.toFixed(1)} Hz` : ' '}
        </p>
        <div className="relative mx-auto mt-5 h-10 max-w-xl border border-line2 bg-bg3/80">
          <div className="absolute inset-y-0 left-1/2 w-[10%] -translate-x-1/2 bg-theory/20" />
          {[-50, -25, 0, 25, 50].map(c => (
            <span key={c} className="absolute -bottom-5 -translate-x-1/2 text-[0.6rem] text-outline" style={{ left: `${50 + c}%` }}>{c > 0 ? `+${c}` : c}</span>
          ))}
          <div
            className={cn('absolute inset-y-0 w-1 -translate-x-1/2 transition-[left] duration-100', inTune ? 'bg-theory' : farOff ? 'bg-tunings' : 'bg-ember')}
            style={{ left: `${50 + cents}%` }}
          />
        </div>
        <p className={cn('mt-8 text-base font-semibold', inTune ? 'text-theory' : 'text-muted')}>{status}</p>
      </div>

      <div>
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-outline">Strings, thick to thin. Tap the speaker to hear the note.</p>
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {tuning.strings.map((s, i) => {
            const active = reading?.stringIndex === i
            return (
              <li key={i} className={cn('border p-2 text-center', active ? (inTune ? 'border-theory bg-theory/10' : 'border-ember bg-ember-dim') : 'border-line2 bg-bg3/60')}>
                <p className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">String {6 - i}</p>
                <p className="font-display text-2xl font-bold text-cream">{s.note}</p>
                <p className="text-[0.65rem] text-outline">{s.label}</p>
                <div className="mt-2 flex justify-center gap-1">
                  <button type="button" onClick={() => playReference(s)} aria-label={`Play reference ${s.label}`} className="flex h-8 w-8 items-center justify-center border border-line2 text-outline hover:text-cream">
                    <Volume2 size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocked(locked === i ? null : i)}
                    aria-pressed={locked === i}
                    className={cn('h-8 border px-2 text-[0.65rem] font-bold', locked === i ? 'border-ember text-ember-l' : 'border-line2 text-outline hover:text-cream')}
                  >
                    {locked === i ? 'Locked' : 'Lock'}
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
        <p className="mt-3 text-xs text-outline">The tuner finds the closest string by itself. Lock a string if you are tuning far away from the target.</p>
      </div>
    </div>
  )
}
