'use client'

import type { EntryMusic } from '@/lib/music/entryMusic'
import Tuner from '@/features/tuner/Tuner'
import ScaleExplorer from './ScaleExplorer'
import ChordExplorer from './ChordExplorer'
import SlashChordExplorer from './SlashChordExplorer'
import StrumExplorer from './StrumExplorer'
import ProgressionExplorer from './ProgressionExplorer'
import TheoryVisual from './TheoryVisual'
import RhythmLesson from './RhythmLesson'

/** Picks the interactive view for an entry page. */
export default function EntryVisual({ music }: { music: EntryMusic }) {
  switch (music.kind) {
    case 'scale': return <ScaleExplorer entryId={music.entryId} title={music.title} defaultRoot={music.defaultRoot} />
    case 'chord': return <ChordExplorer typeId={music.typeId} defaultRoot={music.defaultRoot} arpeggio={music.arpeggio} />
    case 'slash': return <SlashChordExplorer defaultRoot={music.defaultRoot} />
    case 'strum': return <StrumExplorer patternId={music.patternId} />
    case 'progression': return <ProgressionExplorer progressionId={music.progressionId} defaultRoot={music.defaultRoot} />
    case 'theory': return <TheoryVisual entryId={music.entryId} />
    case 'tuning': return <Tuner tuningId={music.tuningId} selectable={false} />
    case 'rhythm': return <RhythmLesson />
  }
}
