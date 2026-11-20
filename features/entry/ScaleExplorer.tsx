'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import NoteChips from '@/components/music/NoteChips'
import NoteMap from '@/components/music/NoteMap'
import Segmented from '@/components/ui/Segmented'
import { SCALE_CATALOG, chordsForScale, scaleNotes, scalePositions } from '@/lib/music/scales'
import KeyPicker from './KeyPicker'
import ExplorerSection from './ExplorerSection'
import ChordShapes from './ChordShapes'
import { useEntryRoot } from './useEntryRoot'

interface ScaleExplorerProps {
  entryId: string
  title: string
  defaultRoot: string
}

/**
 * Interactive view for any scale, mode or solo scale: choose a key, see the notes, every
 * position on the neck, the chords that belong to it with real shapes, and all 12 keys at once.
 */
export default function ScaleExplorer({ entryId, title, defaultRoot }: ScaleExplorerProps) {
  const def = SCALE_CATALOG[entryId]
  const { root, roots, setRoot } = useEntryRoot(defaultRoot, def.quality)
  const [position, setPosition] = useState('all')
  const [chordIndex, setChordIndex] = useState(0)

  const notes = useMemo(() => scaleNotes(root, def), [root, def])
  const positions = useMemo(() => scalePositions(notes), [notes])
  const chords = useMemo(() => chordsForScale(root, def), [root, def])
  const range = positions.find(p => String(p.index) === position)
  const chord = chords[Math.min(chordIndex, chords.length - 1)]
  const name = `${root} ${title.replace(/\s*\(.*\)$/, '').replace(/:.*$/, '')}`

  return (
    <div className="space-y-10">
      <KeyPicker roots={roots} value={root} onChange={r => { setRoot(r); setChordIndex(0) }} />

      <ExplorerSection id="notes" title={`Notes of ${name}`} hint="The orange note is home. Start and end your lines there.">
        <NoteChips notes={notes} tonic={root} />
      </ExplorerSection>

      <ExplorerSection id="fretboard" title="On the fretboard" hint="Every place you can play these notes, frets 0 to 15. Pick a position to see one hand shape at a time.">
        <Segmented
          label="Position"
          value={position}
          onChange={setPosition}
          size="sm"
          options={[{ value: 'all', label: 'Whole neck' }, ...positions.map(p => ({ value: String(p.index), label: `Position ${p.index} (frets ${p.start}–${p.end})` }))]}
        />
        <NoteMap notes={notes} tonic={root} range={range ? [range.start, range.end] : undefined} label={`${name} on the fretboard`} />
      </ExplorerSection>

      {chords.length > 0 && (
        <ExplorerSection id="chords" title={`Chords that fit ${name}`} hint="Each chord is built only from notes of this scale. Tap a chord to see how to play it.">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {chords.map((c, i) => (
              <li key={`${c.name}-${i}`}>
                <button
                  type="button"
                  onClick={() => setChordIndex(i)}
                  aria-pressed={i === chordIndex}
                  className={cn(
                    'flex w-full flex-col items-center border px-2 py-3 transition-colors',
                    i === chordIndex ? 'border-ember bg-ember-dim' : 'border-line2 bg-surface/70 hover:bg-card',
                  )}
                >
                  <span className="text-xs font-bold tracking-wide text-ember-l">{c.numeral}</span>
                  <span className="mt-1 font-display text-xl font-bold text-cream">{c.name}</span>
                  <span className="mt-1 text-[0.7rem] text-outline">{c.notes.join(' ')}</span>
                </button>
              </li>
            ))}
          </ul>
          {chord && (
            <div className="pt-2">
              <p className="mb-3 text-sm text-muted">
                <span className="font-bold text-cream">{chord.name}</span> ({chord.quality}) uses {chord.notes.join(', ')}. Orange dots are the root.
              </p>
              <ChordShapes name={chord.name} notes={chord.notes} max={3} />
            </div>
          )}
        </ExplorerSection>
      )}

      <ExplorerSection id="all-keys" title="All 12 keys" hint="Tap a key to switch the whole page to it.">
        <div className="overflow-x-auto border border-line2 bg-surface/70">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line2 bg-bg3/60">
                {['Key', 'Notes', 'Chords'].map(h => (
                  <th key={h} scope="col" className="px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-outline">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roots.map(r => {
                const rowNotes = scaleNotes(r, def)
                const rowChords = chordsForScale(r, def)
                const active = r === root
                return (
                  <tr key={r} className={cn('border-b border-line last:border-b-0', active && 'bg-ember-dim')}>
                    <th scope="row" className="px-4 py-2.5">
                      <button type="button" onClick={() => setRoot(r)} className={cn('min-w-10 border px-2 py-1 text-sm font-bold', active ? 'border-ember bg-ember text-bg2' : 'border-line2 text-cream hover:border-ember/60')}>
                        {r}
                      </button>
                    </th>
                    <td className="px-4 py-2.5 font-semibold tracking-wide text-cream">{rowNotes.join('  ')}</td>
                    <td className="px-4 py-2.5 text-muted">
                      {rowChords.length ? rowChords.map(c => c.name).join('  ') : '–'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ExplorerSection>
    </div>
  )
}
