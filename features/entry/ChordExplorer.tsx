'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import NoteChips from '@/components/music/NoteChips'
import NoteMap from '@/components/music/NoteMap'
import { buildChord, getChordType } from '@/lib/music/chordTypes'
import { findFingerings, fingeringLabel } from '@/lib/music/fingerings'
import KeyPicker from './KeyPicker'
import ExplorerSection from './ExplorerSection'
import ChordShapes from './ChordShapes'
import { useEntryRoot } from './useEntryRoot'

interface ChordExplorerProps {
  typeId: string
  defaultRoot: string
  /** Arpeggio pages show the chord tones across the neck instead of only chord boxes. */
  arpeggio?: boolean
}

/** Any chord type in any key: notes, several shapes up the neck, and a table of all 12 keys. */
export default function ChordExplorer({ typeId, defaultRoot, arpeggio }: ChordExplorerProps) {
  const type = getChordType(typeId)
  const quality = typeId.startsWith('minor') || typeId === 'diminished' ? 'minor' : 'major'
  const { root, roots, setRoot } = useEntryRoot(defaultRoot, quality)
  const chord = useMemo(() => buildChord(root, type), [root, type])
  const optional = type.intervals.length >= 5 ? [chord.notes[2]] : undefined

  return (
    <div className="space-y-10">
      <KeyPicker roots={roots} value={root} onChange={setRoot} />

      <ExplorerSection id="notes" title={`${chord.name}: the notes`} hint={`${type.label}. ${type.blurb}`}>
        <NoteChips notes={chord.notes} tonic={root} />
      </ExplorerSection>

      <ExplorerSection id="shapes" title={`How to play ${chord.name}`} hint="Each box is the neck seen from the front: low E on the left, thin e on the right. Dots are fingers, o is an open string, × means do not play it. Orange dots are the root.">
        <ChordShapes name={chord.name} notes={chord.notes} optional={optional} />
      </ExplorerSection>

      {arpeggio && (
        <ExplorerSection id="fretboard" title={`${chord.name} arpeggio on the neck`} hint="Play these notes one at a time instead of strumming them together.">
          <NoteMap notes={chord.notes} tonic={root} label={`${chord.name} arpeggio notes`} />
        </ExplorerSection>
      )}

      <ExplorerSection id="all-keys" title="All 12 keys" hint="Tap a key to switch the page to it.">
        <div className="overflow-x-auto border border-line2 bg-surface/70">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line2 bg-bg3/60">
                {['Chord', 'Notes', 'Easiest shape (low E to high e)'].map(h => (
                  <th key={h} scope="col" className="px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-outline">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roots.map(r => {
                const c = buildChord(r, type)
                const shape = findFingerings(c.notes, { maxResults: 1, optional: type.intervals.length >= 5 ? [c.notes[2]] : undefined })[0]
                const active = r === root
                return (
                  <tr key={r} className={cn('border-b border-line last:border-b-0', active && 'bg-ember-dim')}>
                    <th scope="row" className="px-4 py-2.5">
                      <button type="button" onClick={() => setRoot(r)} className={cn('min-w-12 border px-2 py-1 text-sm font-bold', active ? 'border-ember bg-ember text-bg2' : 'border-line2 text-cream hover:border-ember/60')}>
                        {c.name}
                      </button>
                    </th>
                    <td className="px-4 py-2.5 font-semibold tracking-wide text-cream">{c.notes.join('  ')}</td>
                    <td className="px-4 py-2.5 font-mono text-muted">{shape ? fingeringLabel(shape) : '–'}</td>
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
