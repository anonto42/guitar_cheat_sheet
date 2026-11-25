'use client'

import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { SECTION_COLORS } from './colors'
import { SECTION_KINDS, SONG_TEMPLATES, newId, nextName, type SectionKind, type Song } from './song'
import Panel from '@/components/ui/Panel'

interface SongStripProps {
  song: Song
  /** Change made by hand (marks the song as the player's own). */
  onEdit: (song: Song) => void
  onTemplate: (id: string) => void
  selected: number
  onSelect: (index: number) => void
  /** Progress through the whole song, 0 to 1, or null when not playing it. */
  progress: number | null
  /** Block playing right now, or null. */
  playingIndex: number | null
  summary: string
}

/**
 * The arrangement as a strip of coloured blocks, like the tracks area of GarageBand:
 * each block is a part, its width is its length, and a line moves across while it plays.
 */
export default function SongStrip({ song, onEdit, onTemplate, selected, onSelect, progress, playingIndex, summary }: SongStripProps) {
  const scroller = useRef<HTMLDivElement>(null)

  // Keep the playing block in view when the strip scrolls sideways on a phone.
  useEffect(() => {
    const box = scroller.current
    const block = playingIndex === null ? null : box?.querySelector<HTMLElement>(`[data-part="${playingIndex}"]`)
    if (!box || !block || box.scrollWidth <= box.clientWidth) return
    box.scrollTo({ left: block.offsetLeft, behavior: 'smooth' })
  }, [playingIndex])

  const parts = song.order.map(id => song.sections.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s))
  const current = parts[selected] ?? parts[0]

  const move = (delta: number) => {
    const j = selected + delta
    if (j < 0 || j >= song.order.length) return
    const order = [...song.order]
    ;[order[selected], order[j]] = [order[j], order[selected]]
    onEdit({ ...song, order })
    onSelect(j)
  }
  const repeat = () => {
    onEdit({ ...song, order: [...song.order.slice(0, selected + 1), song.order[selected], ...song.order.slice(selected + 1)] })
    onSelect(selected + 1)
  }
  const remove = () => {
    if (song.order.length < 2) return
    const order = song.order.filter((_, j) => j !== selected)
    // A part that no longer plays anywhere is deleted with its last block.
    onEdit({ sections: song.sections.filter(s => order.includes(s.id)), order })
    onSelect(Math.min(selected, order.length - 1))
  }
  /** Change what kind of part this is (Verse, Chorus…). Every repeat of it changes too. */
  const retype = (kind: string) => {
    const others = { ...song, sections: song.sections.filter(x => x.id !== current.id) }
    const name = nextName(others, kind as SectionKind)
    onEdit({ ...song, sections: song.sections.map(x => (x.id === current.id ? { ...x, kind: kind as SectionKind, name } : x)) })
  }
  const add = (kind: string) => {
    const created = { id: newId(), kind: kind as SectionKind, name: nextName(song, kind as SectionKind), bars: [...current.bars] }
    onEdit({ sections: [...song.sections, created], order: [...song.order, created.id] })
    onSelect(song.order.length)
  }

  return (
    <Panel aria-label="Song" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold text-cream">Song</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted" aria-live="polite">{summary}</p>
        </div>
        <Select
          className="w-full shrink-0 sm:w-64"
          label="Start from"
          value={song.templateId ?? 'custom'}
          onChange={id => id !== 'custom' && onTemplate(id)}
          options={[...SONG_TEMPLATES, { value: 'custom', label: 'My own song', disabled: true }]}
        />
      </div>

      {/* The strip. On phones it scrolls sideways like a timeline; each bar gets the same width. */}
      <div ref={scroller} className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="relative w-max min-w-full sm:w-full">
          <ol className="flex gap-1" aria-label="Parts in playing order">
            {parts.map((part, i) => {
              const color = SECTION_COLORS[part.kind]
              const active = i === selected
              return (
                <li
                  key={`${part.id}-${i}`}
                  data-part={i}
                  className="min-w-[5.5rem] shrink-0 grow-0 basis-[calc(var(--bars)*1.5rem)] sm:min-w-0 sm:shrink sm:grow-[var(--bars)] sm:basis-0"
                  style={{ '--bars': part.bars.length } as React.CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-pressed={active}
                    aria-current={playingIndex === i ? 'step' : undefined}
                    className={cn('flex h-16 w-full flex-col justify-between border-2 px-2 py-1.5 text-left transition-colors', active ? 'border-cream' : 'border-transparent hover:border-line3')}
                    style={{ background: `${color}${playingIndex === i ? '55' : '33'}` }}
                  >
                    <span className="truncate text-xs font-bold" style={{ color }}>{part.name}</span>
                    <span className="text-xs font-semibold text-outline">{part.bars.length} bar{part.bars.length > 1 ? 's' : ''}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          {progress !== null && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream shadow-[0_0_8px_rgba(255,255,255,.8)]" style={{ left: `${progress * 100}%` }} />
          )}
        </div>
      </div>

      {/* Actions for the selected block */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Select
          className="min-w-0 sm:w-36"
          label="This part is a"
          hideLabel
          size="sm"
          value={current.kind}
          onChange={retype}
          options={SECTION_KINDS.map(k => ({ value: k, label: k }))}
        />
        <Button size="sm" variant="secondary" onClick={() => move(-1)} disabled={selected === 0} aria-label="Move earlier"><ArrowLeft size={14} /></Button>
        <Button size="sm" variant="secondary" onClick={() => move(1)} disabled={selected === song.order.length - 1} aria-label="Move later"><ArrowRight size={14} /></Button>
        <div className="col-span-3 grid grid-cols-2 gap-2 sm:contents">
          <Button size="sm" variant="secondary" onClick={repeat}><Copy size={14} aria-hidden="true" /> Play again</Button>
          <Button size="sm" variant="secondary" onClick={remove} disabled={song.order.length < 2}><X size={14} aria-hidden="true" /> Remove</Button>
        </div>
        <Select
          className="col-span-3 sm:ml-auto sm:w-40"
          label="Add a part"
          hideLabel
          size="sm"
          value=""
          onChange={kind => kind && add(kind)}
          options={[{ value: '', label: '+ Add a part', disabled: true }, ...SECTION_KINDS.map(k => ({ value: k, label: k }))]}
        />
      </div>
    </Panel>
  )
}
