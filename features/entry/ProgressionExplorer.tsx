'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Play, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import ChordDiagram from '@/components/music/ChordDiagram'
import { STRUM_PATTERNS } from '@/data/strumPatterns'
import { DEFAULT_MIX, type PlaybackConfig } from '@/lib/music/audio'
import { findFingerings } from '@/lib/music/fingerings'
import { getPracticeProgression, progressionChords } from '@/lib/music/progressions'
import { rootSlug } from '@/lib/music/scales'
import { voiceChord } from '@/lib/music/voicing'
import { usePlayer } from '@/features/practice/usePlayer'
import KeyPicker from './KeyPicker'
import ExplorerSection from './ExplorerSection'
import { useEntryRoot } from './useEntryRoot'

/** The progression written out bar by bar in any key, with a shape for each chord and a play button. */
export default function ProgressionExplorer({ progressionId, defaultRoot }: { progressionId: string; defaultRoot: string }) {
  const progression = getPracticeProgression(progressionId)
  const { root, roots, setRoot } = useEntryRoot(defaultRoot, progression.mode)
  const chords = useMemo(() => progressionChords(root, progression), [root, progression])
  const numerals = progression.numerals.split(' – ')
  const [bpm] = useState(84)

  const config: PlaybackConfig = useMemo(() => ({
    bpm,
    bars: chords.map(c => voiceChord(c.notes)),
    pattern: STRUM_PATTERNS[1],
    instrument: 'acoustic',
    bass: true,
    drums: 'rock',
    metronome: false,
    mix: DEFAULT_MIX,
  }), [bpm, chords])
  const player = usePlayer(config)

  return (
    <div className="space-y-10">
      <KeyPicker roots={roots} value={root} onChange={setRoot} suffix={progression.mode} />
      <ExplorerSection id="bars" title={`${progression.name} in ${root} ${progression.mode}`} hint="One box is one bar of 4 beats. Play each chord for the whole bar, then move to the next box. The numeral above shows the chord's place in the key.">
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {chords.map((chord, bar) => {
            const shape = findFingerings(chord.notes, { maxResults: 1, optional: chord.notes.length >= 5 ? [chord.notes[2]] : undefined })[0]
            const active = player.playing && player.position?.bar === bar && !player.position.countIn
            return (
              <li key={bar} className={cn('flex flex-col items-center border p-3 transition-colors', active ? 'border-ember bg-ember-dim' : 'border-line2 bg-surface/70')}>
                <p className="text-[0.65rem] font-bold tracking-wide text-outline">BAR {bar + 1} · <span className="text-ember-l">{numerals[bar % numerals.length] ?? ''}</span></p>
                {shape
                  ? <ChordDiagram name={chord.name} fingering={shape} notes={chord.notes} />
                  : <p className="py-6 font-display text-2xl font-bold text-cream">{chord.name}</p>}
              </li>
            )
          })}
        </ol>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button onClick={() => (player.playing ? player.stop() : player.start({ countIn: true }))} aria-pressed={player.playing}>
            {player.playing ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {player.playing ? 'Stop' : 'Play it'}
          </Button>
          <Link href={`/practice?key=${rootSlug(root)}&mode=${progression.mode}&progression=${progression.id}`} className="text-sm font-semibold text-ember-l hover:text-cream">
            Practise and solo over it in the Practice Studio
          </Link>
          {player.error && <p role="alert" className="text-sm text-tunings">{player.error}</p>}
        </div>
      </ExplorerSection>
    </div>
  )
}
