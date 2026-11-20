'use client'

import { useMemo } from 'react'
import { buildSlashChords, getChordType } from '@/lib/music/chordTypes'
import KeyPicker from './KeyPicker'
import ExplorerSection from './ExplorerSection'
import ChordShapes from './ChordShapes'
import { useEntryRoot } from './useEntryRoot'

/** Slash chords of the chosen root: the major and minor triad over their 3rd and 5th. */
export default function SlashChordExplorer({ defaultRoot }: { defaultRoot: string }) {
  const { root, roots, setRoot } = useEntryRoot(defaultRoot, 'major')
  const groups = useMemo(() => [
    { label: 'Major', chords: buildSlashChords(root, getChordType('major')) },
    { label: 'Minor', chords: buildSlashChords(root, getChordType('minor')) },
  ], [root])

  return (
    <div className="space-y-10">
      <KeyPicker roots={roots} value={root} onChange={setRoot} />
      {groups.map(group => (
        <ExplorerSection key={group.label} title={`${group.label} chord with another bass note`} hint="The note after the slash is the lowest note you play. The rest of the chord stays the same.">
          <div className="space-y-6">
            {group.chords.map(chord => (
              <div key={chord.name}>
                <p className="mb-2 text-sm text-muted">
                  <span className="font-bold text-cream">{chord.name}</span>: bass {chord.notes[0]}, chord tones {chord.notes.slice(1).join(' ')}
                </p>
                <ChordShapes name={chord.name} notes={chord.notes} bass={chord.notes[0]} max={3} />
              </div>
            ))}
          </div>
        </ExplorerSection>
      ))}
    </div>
  )
}
