import { DRUM_STYLES, INSTRUMENTS, type DrumStyle, type InstrumentId } from '@/lib/music/audio'
import { scaleChoice } from '@/lib/music/scales'
import type { StrumPattern } from '@/types'
import { SONG_TEMPLATES } from './song'

interface PlaybackSummary {
  tonic: string
  scaleId: string
  templateId: string | undefined
  bars: number
  bpm: number
  pattern: StrumPattern
  instrument: InstrumentId
  drums: DrumStyle
  bass: boolean
}

const labelOf = <T extends string>(list: { id: T; label: string }[], id: T) => list.find(x => x.id === id)?.label ?? id

/** One plain-English paragraph that says exactly what the backing track will do. */
export function describePlayback(p: PlaybackSummary): string {
  const scale = scaleChoice(p.scaleId).label.toLowerCase()
  const shape = SONG_TEMPLATES.find(t => t.value === p.templateId)?.label.replace(/ \(.*\)$/, '').replace(/^Loop: /, '') ?? 'Your own song'
  const start = `${shape} in ${p.tonic} ${scale}: ${p.bars} bars at ${p.bpm} BPM.`
  const chords =
    p.instrument === 'none' ? 'No chord sound, so you strum the chords yourself.'
    : p.instrument === 'pad' ? 'A synth pad holds each chord for the whole bar.'
    : `${labelOf(INSTRUMENTS, p.instrument)} strums each chord with the ${p.pattern.name} pattern.`
  const band = [p.drums !== 'off' ? `drums play a ${labelOf(DRUM_STYLES, p.drums).toLowerCase()}` : '', p.bass ? 'bass plays the root note' : '']
    .filter(Boolean).join(' and ')
  return `${start} ${chords}${band ? ` ${band[0].toUpperCase()}${band.slice(1)}.` : ''}`
}
