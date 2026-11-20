'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STRUM_PATTERNS, getStrumPattern } from '@/data/strumPatterns'
import { MAJOR_KEYS, getMajorKey, soloScales } from '@/lib/music/keys'
import { PRACTICE_PROGRESSIONS, getPracticeProgression, progressionChords } from '@/lib/music/progressions'
import { voiceChord } from '@/lib/music/voicing'
import { PracticeEngine, type PlaybackConfig, type PlaybackPosition } from '@/lib/music/audio'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import ArrowLink from '@/components/ui/ArrowLink'
import NoteChips from '@/components/music/NoteChips'
import NoteMap from '@/components/music/NoteMap'

const STEP_GLYPH = { D: '↓', U: '↑', x: '×', M: '↓', '-': '·' } as const

/**
 * Practice player: pick a key, a progression and a strumming pattern, press play and strum along.
 * Below it, the scales that fit the key are mapped on the fretboard so the same page covers
 * "play the chords, then solo over them".
 */
export default function PracticeStudio() {
  const params = useSearchParams()
  const [keySlug, setKeySlug] = useState(() => (getMajorKey(params.get('key') ?? '') ? params.get('key')! : 'c'))
  const [progressionId, setProgressionId] = useState(() => getPracticeProgression(params.get('progression') ?? '').id)
  const [patternId, setPatternId] = useState(() => getStrumPattern(params.get('pattern') ?? '').id)
  const [bpm, setBpm] = useState(80)
  const [metronome, setMetronome] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState<PlaybackPosition | null>(null)
  const [soloId, setSoloId] = useState('major-pentatonic')
  const [error, setError] = useState<string | null>(null)

  const key = getMajorKey(keySlug) ?? MAJOR_KEYS[0]
  const progression = getPracticeProgression(progressionId)
  const pattern = getStrumPattern(patternId)
  const chords = useMemo(() => progressionChords(key, progression), [key, progression])
  const solos = useMemo(() => soloScales(key), [key])
  const solo = solos.find(s => s.id === soloId) ?? solos[0]

  // The engine reads the latest settings through this ref, so changes apply while it plays.
  const config = useRef<PlaybackConfig>({ bpm, chords: [], pattern, metronome })
  const engine = useRef<PracticeEngine | null>(null)

  useEffect(() => {
    config.current = { bpm, chords: chords.map(c => voiceChord(c.notes)), pattern, metronome }
  }, [bpm, chords, pattern, metronome])

  useEffect(() => {
    engine.current = new PracticeEngine(() => config.current, setPosition)
    return () => engine.current?.stop()
  }, [])

  const togglePlay = async () => {
    const current = engine.current
    if (!current) return
    if (current.running) {
      current.stop()
      setPlaying(false)
      return
    }
    try {
      setError(null)
      await current.start()
      setPlaying(true)
    } catch {
      setError('Audio could not start in this browser.')
    }
  }

  return (
    <div className="space-y-12">
      <section aria-label="Practice player" className="space-y-6 border border-line2 bg-surface/70 p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Key" value={keySlug} onChange={setKeySlug} options={MAJOR_KEYS.map(k => ({ value: k.slug, label: k.name }))} />
          <Select label="Progression" value={progressionId} onChange={setProgressionId} options={PRACTICE_PROGRESSIONS.map(p => ({ value: p.id, label: `${p.name} (${p.numerals})` }))} />
          <Select label="Strumming pattern" value={patternId} onChange={setPatternId} options={STRUM_PATTERNS.map(p => ({ value: p.id, label: `${p.name} (${p.time})` }))} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bpm" className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">
              Tempo <span className="text-ember-l">{bpm} BPM</span>
            </label>
            <input
              id="bpm" type="range" min={40} max={160} step={1} value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="h-[var(--control-h)] w-full accent-[#ff6b00]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" onClick={togglePlay} aria-pressed={playing}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {playing ? 'Stop' : 'Play'}
          </Button>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={metronome} onChange={e => setMetronome(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" />
            Click on the beat
          </label>
          {error && <p role="alert" className="text-sm text-tunings">{error}</p>}
        </div>

        <ol aria-label="Chords, one per bar" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {chords.map((chord, bar) => (
            <li
              key={bar}
              className={cn(
                'border p-4 transition-colors',
                position?.bar === bar ? 'border-ember bg-ember-dim' : 'border-line2 bg-bg3/60',
              )}
            >
              <p className="text-[0.6rem] font-bold uppercase tracking-widest text-outline">Bar {bar + 1}</p>
              <p className="mt-1 font-display text-2xl font-bold text-cream">{chord.name}</p>
              <p className="mt-1 text-xs text-outline">{chord.notes.join(' ')}</p>
            </li>
          ))}
        </ol>

        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">
            {pattern.name}, {pattern.time}
          </p>
          <ol aria-label="Strumming pattern" className="mt-3 flex gap-1 overflow-x-auto pb-1">
            {pattern.steps.map((symbol, i) => (
              <li
                key={i}
                className={cn(
                  'flex min-w-9 flex-col items-center border py-2 text-center',
                  position?.step === i && playing ? 'border-ember bg-ember text-bg2' : 'border-line2 bg-bg3/60 text-cream',
                )}
              >
                <span className="text-lg font-bold leading-none">{STEP_GLYPH[symbol]}</span>
                <span className="mt-1 text-[0.6rem] font-semibold opacity-70">{pattern.counts[i]}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-outline">↓ down, ↑ up, × muted chop, · rest (keep the hand moving).</p>
          <div className="mt-2"><ArrowLink href={`/strumming/${pattern.id}`}>How to play this pattern</ArrowLink></div>
        </div>
      </section>

      <section aria-label="Solo scale" className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-cream">Now solo over it</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Keep the loop running and play these notes over the chords. Land on the highlighted home note to sound resolved.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Scale to solo with">
          {solos.map(s => (
            <button
              key={s.id} type="button" role="tab" aria-selected={s.id === solo.id}
              onClick={() => setSoloId(s.id)}
              className={cn(
                'border px-4 py-2 text-xs font-semibold transition-colors',
                s.id === solo.id ? 'border-ember bg-ember text-bg2' : 'border-line2 bg-surface/70 text-outline hover:text-cream',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-outline">{solo.why}</p>
        <NoteChips notes={solo.notes} tonic={solo.tonic} />
        <NoteMap notes={solo.notes} tonic={solo.tonic} label={`${solo.label} notes on the fretboard`} />
        <Link href={`/${solo.guide.category}/${solo.guide.id}`} className="inline-block text-sm font-semibold text-ember-l hover:text-cream">
          Read the solo guide for this scale
        </Link>
      </section>
    </div>
  )
}
