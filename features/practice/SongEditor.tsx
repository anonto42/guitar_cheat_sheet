'use client'

import { useMemo } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Select from '@/components/ui/Select'
import Segmented from '@/components/ui/Segmented'
import Button from '@/components/ui/Button'
import ChordDiagram from '@/components/music/ChordDiagram'
import { PRACTICE_PROGRESSIONS, chordsFromNotes } from '@/lib/music/progressions'
import { findFingerings } from '@/lib/music/fingerings'
import { ROOTS, SCALE_CHOICES, type ScaleQuality } from '@/lib/music/scales'
import { chordOptions, parseStep, stepValue } from './chordOptions'
import { SECTION_KINDS, SONG_TEMPLATES, newId, nextName, songTemplate, type FlatBar, type SectionKind, type Song } from './song'

interface SongEditorProps {
  tonic: string
  scaleId: string
  quality: ScaleQuality
  /** Seven notes chords are built from. */
  harmony: string[]
  onKey: (tonic: string) => void
  onScale: (scaleId: string) => void
  song: Song
  onSong: (song: Song) => void
  editingId: string
  onEditing: (id: string) => void
  scope: 'song' | 'section'
  onScope: (scope: 'song' | 'section') => void
  /** Bar playing right now, or null. */
  playing: FlatBar | null
  showShapes: boolean
  onShowShapes: (on: boolean) => void
}

const BAR_COUNTS = [1, 2, 3, 4, 6, 8, 12, 16]

/**
 * Set up the song: key and scale, the parts (intro, verse, chorus…) with the chords in each bar,
 * and the order the parts are played in.
 */
export default function SongEditor(props: SongEditorProps) {
  const { tonic, scaleId, quality, harmony, onKey, onScale, song, onSong, editingId, onEditing, scope, onScope, playing, showShapes, onShowShapes } = props
  const section = song.sections.find(s => s.id === editingId) ?? song.sections[0]
  const options = useMemo(() => chordOptions(harmony), [harmony])
  const chords = useMemo(() => chordsFromNotes(harmony, section.bars), [harmony, section.bars])

  const updateSection = (patch: Partial<typeof section>) =>
    onSong({ ...song, sections: song.sections.map(s => (s.id === section.id ? { ...s, ...patch } : s)) })

  const setCount = (count: number) =>
    updateSection({ bars: Array.from({ length: count }, (_, i) => section.bars[i] ?? section.bars[i % section.bars.length]) })

  const addSection = (kind: string) => {
    const created = { id: newId(), kind: kind as SectionKind, name: nextName(song, kind as SectionKind), bars: [...section.bars] }
    onSong({ sections: [...song.sections, created], order: [...song.order, created.id] })
    onEditing(created.id)
  }

  const removeSection = () => {
    if (song.sections.length < 2) return
    const sections = song.sections.filter(s => s.id !== section.id)
    onSong({ sections, order: song.order.filter(id => id !== section.id) })
    onEditing(sections[0].id)
  }

  const move = (index: number, delta: number) => {
    const order = [...song.order]
    const target = index + delta
    if (target < 0 || target >= order.length) return
    ;[order[index], order[target]] = [order[target], order[index]]
    onSong({ ...song, order })
  }

  const nameOf = (id: string) => song.sections.find(s => s.id === id)?.name ?? ''

  return (
    <section aria-label="Song" className="min-w-0 space-y-6 border border-line2 bg-surface/70 p-5">
      <h2 className="font-display text-lg font-bold text-cream">Song</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select label="Key" value={tonic} onChange={onKey} options={ROOTS[quality].map(r => ({ value: r, label: r }))} />
        <Select
          label="Scale or mode"
          value={scaleId}
          onChange={onScale}
          options={SCALE_CHOICES.map(c => ({ value: c.id, label: c.label, group: c.group }))}
        />
        <Select
          label="Start from a song shape"
          placeholder="Choose a template"
          value=""
          onChange={id => { if (!id) return; const next = songTemplate(id); onSong(next); onEditing(next.sections[0].id) }}
          options={[{ value: '', label: 'Choose a template', disabled: true }, ...SONG_TEMPLATES]}
        />
      </div>

      {/* Parts */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Parts of the song</p>
          <Segmented
            label="What to loop"
            size="sm"
            value={scope}
            onChange={onScope}
            options={[{ value: 'song', label: 'Play whole song' }, { value: 'section', label: `Loop ${section.name} only` }]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {song.sections.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onEditing(s.id)}
              aria-pressed={s.id === section.id}
              className={cn(
                'relative h-9 border px-3 text-sm font-semibold transition-colors',
                s.id === section.id ? 'border-ember bg-ember text-bg2' : 'border-line2 bg-bg3/60 text-muted hover:text-cream',
              )}
            >
              {s.name}
              {playing?.sectionId === s.id && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-amber" aria-label="playing" />}
            </button>
          ))}
          <Select
            className="w-44"
            label="Add a part"
            hideLabel
            size="sm"
            value=""
            onChange={kind => kind && addSection(kind)}
            options={[{ value: '', label: '+ Add a part', disabled: true }, ...SECTION_KINDS.map(k => ({ value: k, label: `+ ${k}` }))]}
          />
        </div>
      </div>

      {/* Editing one part */}
      <div className="space-y-4 border border-line2 bg-bg3/40 p-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Select
            label={`Chords for ${section.name}: start from a progression`}
            placeholder="Choose a progression"
            value=""
            onChange={id => { const p = PRACTICE_PROGRESSIONS.find(x => x.id === id); if (p) updateSection({ bars: p.steps }) }}
            options={[{ value: '', label: 'Choose a progression', disabled: true }, ...PRACTICE_PROGRESSIONS.map(p => ({ value: p.id, label: `${p.name} (${p.numerals})` }))]}
          />
          <Select label="Bars in this part" value={String(section.bars.length)} onChange={v => setCount(Number(v))} options={BAR_COUNTS.map(n => ({ value: String(n), label: `${n} bar${n > 1 ? 's' : ''}` }))} />
          <Button variant="secondary" onClick={removeSection} disabled={song.sections.length < 2} aria-label={`Delete ${section.name}`}>
            <Trash2 size={14} aria-hidden="true" /> Delete part
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Chord in each bar</p>
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={showShapes} onChange={e => onShowShapes(e.target.checked)} className="h-4 w-4 accent-[#ff6b00]" /> Show chord shapes
          </label>
        </div>
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {section.bars.map((step, i) => {
            const chord = chords[i]
            const active = playing?.sectionId === section.id && playing.barInSection === i
            const shape = showShapes ? findFingerings(chord.notes, { maxResults: 1, optional: chord.notes.length >= 5 ? [chord.notes[2]] : undefined })[0] : undefined
            const value = stepValue(step)
            return (
              <li key={i} className={cn('border p-2 transition-colors', active ? 'border-ember bg-ember-dim' : 'border-line2 bg-bg3/60')}>
                <Select
                  label={`Bar ${i + 1}`}
                  size="sm"
                  value={value}
                  onChange={v => updateSection({ bars: section.bars.map((b, j) => (j === i ? parseStep(v) : b)) })}
                  options={options.some(o => o.value === value) ? options : [...options, { value, label: chord.name }]}
                />
                {shape && <div className="mt-2 flex justify-center"><ChordDiagram name={chord.name} fingering={shape} notes={chord.notes} /></div>}
                {!showShapes && <p className="mt-1 text-xs text-outline">{chord.notes.join(' ')}</p>}
              </li>
            )
          })}
        </ol>
      </div>

      {/* Order */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">Song order ({song.order.length} parts)</p>
          <Button size="sm" variant="secondary" onClick={() => onSong({ ...song, order: [...song.order, section.id] })}>
            <Plus size={14} aria-hidden="true" /> Add {section.name} to the end
          </Button>
        </div>
        <ol className="flex flex-wrap gap-2">
          {song.order.map((id, i) => {
            const active = scope === 'song' && playing?.orderIndex === i
            return (
              <li key={`${id}-${i}`} className={cn('flex items-center border text-sm', active ? 'border-ember bg-ember-dim' : 'border-line2 bg-bg3/60')}>
                <span className="px-2 text-[0.65rem] font-bold text-outline">{i + 1}</span>
                <button type="button" onClick={() => onEditing(id)} className="py-1.5 pr-2 font-semibold text-cream hover:text-ember-l">{nameOf(id)}</button>
                <button type="button" aria-label="Move earlier" onClick={() => move(i, -1)} className="flex h-8 w-7 items-center justify-center text-outline hover:text-cream"><ArrowLeft size={12} /></button>
                <button type="button" aria-label="Move later" onClick={() => move(i, 1)} className="flex h-8 w-7 items-center justify-center text-outline hover:text-cream"><ArrowRight size={12} /></button>
                <button type="button" aria-label="Remove from order" onClick={() => onSong({ ...song, order: song.order.filter((_, j) => j !== i) })} className="flex h-8 w-7 items-center justify-center text-outline hover:text-tunings"><X size={12} /></button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
