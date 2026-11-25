'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import ChordDiagram from '@/components/music/ChordDiagram'
import { PRACTICE_PROGRESSIONS, chordsFromNotes } from '@/lib/music/progressions'
import { findFingerings } from '@/lib/music/fingerings'
import { chordOptions, parseStep, stepValue } from './chordOptions'
import { SECTION_KINDS, SONG_TEMPLATES, newId, nextName, songTemplate, type FlatBar, type SectionKind, type Song } from './song'

interface SongTimelineProps {
  /** Seven notes chords are built from. */
  harmony: string[]
  song: Song
  onSong: (song: Song) => void
  editingId: string
  onEditing: (id: string) => void
  loopPart: boolean
  onLoopPart: (on: boolean) => void
  /** Bar playing right now, or null. */
  playing: FlatBar | null
  summary: string
}

const BAR_COUNTS = [1, 2, 3, 4, 6, 8, 12, 16]

/**
 * The song as one row of parts in playing order. Tap a part to change its chords below.
 * The same part can appear more than once (Verse, Chorus, Verse, Chorus).
 */
export default function SongTimeline({ harmony, song, onSong, editingId, onEditing, loopPart, onLoopPart, playing, summary }: SongTimelineProps) {
  const [selected, setSelected] = useState(() => Math.max(0, song.order.indexOf(editingId)))
  const index = song.order[selected] === editingId ? selected : Math.max(0, song.order.indexOf(editingId))
  const part = song.sections.find(s => s.id === editingId) ?? song.sections[0]
  const options = useMemo(() => chordOptions(harmony), [harmony])
  const [showShapes, setShowShapes] = useState(false)

  /** Any change by hand turns a template into the player's own song. */
  const editSong = (next: Song) => onSong({ ...next, templateId: undefined })
  const updatePart = (patch: Partial<typeof part>) =>
    editSong({ ...song, sections: song.sections.map(s => (s.id === part.id ? { ...s, presetId: undefined, ...patch } : s)) })

  const select = (i: number) => { setSelected(i); onEditing(song.order[i]) }

  const move = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= song.order.length) return
    const order = [...song.order]
    ;[order[i], order[j]] = [order[j], order[i]]
    editSong({ ...song, order })
    setSelected(j)
  }

  const repeat = (i: number) => {
    const order = [...song.order.slice(0, i + 1), song.order[i], ...song.order.slice(i + 1)]
    editSong({ ...song, order })
    setSelected(i + 1)
  }

  const remove = (i: number) => {
    if (song.order.length < 2) return
    const order = song.order.filter((_, j) => j !== i)
    // A part that no longer plays anywhere is deleted with its last appearance.
    const sections = song.sections.filter(s => order.includes(s.id))
    editSong({ sections, order })
    const next = Math.min(i, order.length - 1)
    setSelected(next)
    onEditing(order[next])
  }

  const addPart = (kind: string) => {
    const created = { id: newId(), kind: kind as SectionKind, name: nextName(song, kind as SectionKind), bars: [...part.bars] }
    editSong({ sections: [...song.sections, created], order: [...song.order, created.id] })
    setSelected(song.order.length)
    onEditing(created.id)
  }

  const chooseTemplate = (id: string) => {
    if (id === 'custom') return
    const next = songTemplate(id)
    onSong(next)
    setSelected(0)
    onEditing(next.sections[0].id)
  }

  const chords = chordsFromNotes(harmony, part.bars)
  const timesPlayed = song.order.filter(id => id === part.id).length

  return (
    <section aria-label="Your song" className="min-w-0 space-y-6 border border-line2 bg-surface/70 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-cream">Your song</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted" aria-live="polite">{summary}</p>
        </div>
        <Select
          className="w-full shrink-0 sm:w-64"
          label="Start from"
          value={song.templateId ?? 'custom'}
          onChange={chooseTemplate}
          options={[...SONG_TEMPLATES, { value: 'custom', label: 'My own song', disabled: true }]}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Song order. Tap a part to change its chords.</p>
        <ol className="flex flex-wrap items-stretch gap-2">
          {song.order.map((id, i) => {
            const s = song.sections.find(x => x.id === id)
            if (!s) return null
            const names = chordsFromNotes(harmony, s.bars).map(c => c.name)
            const isSelected = i === index
            const isPlaying = playing?.orderIndex === i && !loopPart
            return (
              <li key={`${id}-${i}`} className="flex items-stretch">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex min-w-[7.5rem] max-w-[13rem] flex-col items-start border px-3 py-2 text-left transition-colors',
                    isSelected ? 'border-ember bg-bg3' : 'border-line2 bg-bg3/50 hover:border-line3',
                    isPlaying && 'bg-ember-dim',
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold text-cream">{s.name}</span>
                    {isPlaying && <span className="h-2 w-2 shrink-0 bg-ember" aria-label="playing" />}
                  </span>
                  <span className="mt-0.5 w-full truncate text-xs text-outline">{names.join(' ')}</span>
                </button>
                {isSelected && (
                  <span className="flex flex-col border border-l-0 border-ember">
                    <button type="button" aria-label="Move earlier" onClick={() => move(i, -1)} disabled={i === 0} className="flex h-1/2 w-8 items-center justify-center text-outline hover:text-cream disabled:opacity-30"><ArrowLeft size={13} /></button>
                    <button type="button" aria-label="Move later" onClick={() => move(i, 1)} disabled={i === song.order.length - 1} className="flex h-1/2 w-8 items-center justify-center text-outline hover:text-cream disabled:opacity-30"><ArrowRight size={13} /></button>
                  </span>
                )}
              </li>
            )
          })}
          <li>
            <Select
              className="w-40"
              label="Add a part"
              hideLabel
              value=""
              onChange={kind => kind && addPart(kind)}
              options={[{ value: '', label: '+ Add a part', disabled: true }, ...SECTION_KINDS.map(k => ({ value: k, label: k }))]}
            />
          </li>
        </ol>
      </div>

      {/* Editor for the selected part */}
      <div className="space-y-4 border border-line2 bg-bg3/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold text-cream">{part.name}</h3>
            <p className="text-xs text-outline">Plays {timesPlayed} time{timesPlayed > 1 ? 's' : ''} in the song</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => repeat(index)}><Copy size={14} aria-hidden="true" /> Play it again</Button>
            <Button size="sm" variant="secondary" onClick={() => remove(index)} disabled={song.order.length < 2}><X size={14} aria-hidden="true" /> Remove</Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
          <Select
            label="Use a progression"
            value={part.presetId ?? 'custom'}
            onChange={id => { const p = PRACTICE_PROGRESSIONS.find(x => x.id === id); if (p) updatePart({ bars: p.steps, presetId: p.id }) }}
            options={[...PRACTICE_PROGRESSIONS.map(p => ({ value: p.id, label: `${p.name} (${p.numerals})` })), { value: 'custom', label: 'My own chords', disabled: true }]}
          />
          <Select
            label="Bars"
            value={String(part.bars.length)}
            onChange={v => updatePart({ bars: Array.from({ length: Number(v) }, (_, i) => part.bars[i] ?? part.bars[i % part.bars.length]) })}
            options={BAR_COUNTS.map(n => ({ value: String(n), label: `${n} bar${n > 1 ? 's' : ''}` }))}
          />
        </div>

        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {part.bars.map((step, i) => {
            const chord = chords[i]
            const value = stepValue(step)
            const active = playing?.sectionId === part.id && playing.barInSection === i
            const shape = showShapes ? findFingerings(chord.notes, { maxResults: 1, optional: chord.notes.length >= 5 ? [chord.notes[2]] : undefined })[0] : undefined
            return (
              <li key={i} className={cn('min-w-0 border p-2.5 transition-colors', active ? 'border-ember bg-ember-dim' : 'border-line2 bg-surface/60')}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[0.65rem] font-bold text-outline">BAR {i + 1}</span>
                  <span className="text-[0.65rem] text-outline">{chord.notes.join(' ')}</span>
                </div>
                <Select
                  label={`Chord in bar ${i + 1}`}
                  hideLabel
                  size="sm"
                  value={value}
                  onChange={v => updatePart({ bars: part.bars.map((b, j) => (j === i ? parseStep(v) : b)) })}
                  options={options.some(o => o.value === value) ? options : [...options, { value, label: chord.name }]}
                />
                {shape && <div className="mt-2 flex justify-center"><ChordDiagram name={chord.name} fingering={shape} notes={chord.notes} /></div>}
              </li>
            )
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showShapes} onChange={e => setShowShapes(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" />
            Show chord shapes
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={loopPart} onChange={e => onLoopPart(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" />
            Loop only {part.name} while practising
          </label>
        </div>
      </div>
    </section>
  )
}
