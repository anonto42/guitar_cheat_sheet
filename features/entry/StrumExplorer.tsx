'use client'

import { useMemo, useState } from 'react'
import { Play, Square } from 'lucide-react'
import Button from '@/components/ui/Button'
import StrumPatternView from '@/components/music/StrumPatternView'
import { getStrumPattern } from '@/data/strumPatterns'
import { DEFAULT_MIX, type PlaybackConfig } from '@/lib/music/audio'
import { buildChord, getChordType } from '@/lib/music/chordTypes'
import { voiceChord } from '@/lib/music/voicing'
import { usePlayer } from '@/features/practice/usePlayer'
import ExplorerSection from './ExplorerSection'

/** Picture of the pattern plus a "hear it" button that plays it on G and C with a click. */
export default function StrumExplorer({ patternId }: { patternId: string }) {
  const pattern = getStrumPattern(patternId)
  const [bpm, setBpm] = useState(70)
  const config: PlaybackConfig = useMemo(() => ({
    bpm,
    bars: ['G', 'G', 'C', 'C'].map(r => voiceChord(buildChord(r, getChordType('major')).notes)),
    pattern,
    instrument: 'acoustic',
    bass: false,
    drums: 'off',
    metronome: true,
    mix: DEFAULT_MIX,
  }), [bpm, pattern])
  const player = usePlayer(config)

  return (
    <ExplorerSection id="pattern" title="See and hear the pattern" hint="Read it left to right. Your hand moves down and up on every box, and only touches the strings where there is an arrow.">
      <StrumPatternView pattern={pattern} activeStep={player.playing ? player.position?.step : null} />
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button onClick={() => (player.playing ? player.stop() : player.start({ countIn: true }))} aria-pressed={player.playing}>
          {player.playing ? <Square size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {player.playing ? 'Stop' : 'Hear it on G and C'}
        </Button>
        <label className="flex items-center gap-3 text-sm text-muted">
          Tempo <span className="w-14 font-bold text-ember-l">{bpm} BPM</span>
          <input type="range" min={40} max={140} value={bpm} onChange={e => setBpm(Number(e.target.value))} className="w-40 accent-[#ff6b00]" />
        </label>
        {player.error && <p role="alert" className="text-sm text-tunings">{player.error}</p>}
      </div>
    </ExplorerSection>
  )
}
