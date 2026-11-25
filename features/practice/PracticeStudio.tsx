'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getStrumPattern } from '@/data/strumPatterns'
import { DEFAULT_MIX, type DrumStyle, type InstrumentId, type Mix, type PlaybackConfig } from '@/lib/music/audio'
import { chordsFromNotes, getPracticeProgression } from '@/lib/music/progressions'
import { ROOTS, SCALE_CATALOG, harmonyNotes, normaliseRoot, rootFromSlug, scaleChoice } from '@/lib/music/scales'
import { voiceChord } from '@/lib/music/voicing'
import type { StrumPattern } from '@/types'
import ControlBar from './ControlBar'
import SongStrip from './SongStrip'
import ChordChart from './ChordChart'
import BandTracks from './BandTracks'
import { describePlayback } from './describe'
import { firstPatternFor, timeOf } from './patterns'
import SoloHelper from './SoloHelper'
import Recorder from './Recorder'
import { flattenSong, songTemplate, type Song, type SongSection } from './song'
import { usePlayer } from './usePlayer'
import { useRecorder, type Take } from './useRecorder'

/**
 * Practice Studio: build a backing track and play along. The layout follows GarageBand:
 * a control bar on top, the song as coloured blocks, the selected part as a chord chart,
 * then one row per instrument of the band. Below that, the solo helper and your recordings.
 * Starting values can come from the URL: ?key=g&scale=dorian-mode&progression=andalusian&pattern=folk-strum
 * (mode=minor is accepted as a shortcut for the natural minor scale).
 */
export default function PracticeStudio() {
  const params = useSearchParams()
  const preset = getPracticeProgression(params.get('progression'))
  const initialScale = params.get('scale')
    ? scaleChoice(params.get('scale')).id
    : params.get('mode') === 'minor' || (!params.get('mode') && params.get('progression') && preset.mode === 'minor') ? 'natural-minor' : 'major-scale'
  const initialQuality = SCALE_CATALOG[initialScale].quality

  const [scaleId, setScaleId] = useState(initialScale)
  const [tonic, setTonic] = useState(() => rootFromSlug(params.get('key'), initialQuality, initialQuality === 'minor' ? 'A' : 'C'))
  const [song, setSong] = useState<Song>(() => songTemplate(preset.id))
  const [selected, setSelected] = useState(0)
  const [selectedBar, setSelectedBar] = useState<number | null>(null)
  const [loopPart, setLoopPart] = useState(false)
  const [pattern, setPattern] = useState<StrumPattern>(() => getStrumPattern(params.get('pattern') ?? ''))
  const [bpm, setBpm] = useState(84)
  const [metronome, setMetronome] = useState(true)
  const [countIn, setCountIn] = useState(true)
  const [chordsOn, setChordsOn] = useState(true)
  const [instrument, setInstrument] = useState<InstrumentId>('acoustic')
  const [drumsOn, setDrumsOn] = useState(false)
  const [drumStyle, setDrumStyle] = useState<DrumStyle>('rock')
  const [bass, setBass] = useState(false)
  const [mix, setMix] = useState<Mix>(DEFAULT_MIX)

  const def = SCALE_CATALOG[scaleId]
  const choice = scaleChoice(scaleId)
  const harmony = useMemo(() => harmonyNotes(tonic, def), [tonic, def])
  const partId = song.order[selected] ?? song.order[0]
  const part = song.sections.find(s => s.id === partId) ?? song.sections[0]
  const flat = useMemo(() => flattenSong(song, loopPart ? part.id : null), [song, loopPart, part.id])
  const chords = useMemo(() => chordsFromNotes(harmony, flat.map(b => b.step)), [harmony, flat])
  const playedBy: InstrumentId = chordsOn ? instrument : 'none'
  const drums: DrumStyle = drumsOn ? drumStyle : 'off'

  const config: PlaybackConfig = useMemo(() => ({
    bpm, bars: chords.map(c => voiceChord(c.notes)), pattern, instrument: playedBy, bass, drums, metronome, mix,
  }), [bpm, chords, pattern, playedBy, bass, drums, metronome, mix])

  const player = usePlayer(config)
  const recorder = useRecorder()
  const position = player.playing ? player.position : null
  const live = position && !position.countIn ? position : null
  const playingBar = live ? flat[live.bar] ?? null : null
  const current = live ? chords[live.bar] ?? null : null
  const progress = live && !loopPart && flat.length ? (live.bar + live.step / pattern.steps.length) / flat.length : null

  const changeScale = (id: string) => {
    setScaleId(id)
    setTonic(t => normaliseRoot(t, SCALE_CATALOG[id].quality))
  }

  const selectPart = (i: number) => {
    setSelected(i)
    setSelectedBar(null)
  }

  const editSong = (next: Song) => setSong({ ...next, templateId: undefined })

  const useTemplate = (id: string) => {
    setSong(songTemplate(id))
    selectPart(0)
  }

  /** Change the selected part. Chords placed by hand drop the progression name. */
  const editPart = (patch: Partial<SongSection>) =>
    editSong({ ...song, sections: song.sections.map(s => (s.id === part.id ? { ...s, presetId: undefined, ...patch } : s)) })

  const togglePlay = () => (player.playing ? player.stop() : player.start({ countIn }))

  const toggleRecord = async () => {
    if (recorder.recording) {
      recorder.stop()
      player.stop()
      return
    }
    const ok = await recorder.start(bpm)
    if (ok && !player.playing) await player.start({ countIn: true })
  }

  const playWithBacking = async (_take: Take, audio: HTMLAudioElement | null) => {
    if (!audio) return
    player.stop()
    audio.currentTime = 0
    await player.start({ countIn: true })
    void audio.play()
  }

  const status = recorder.recording
    ? 'Recording…'
    : position?.countIn ? 'Get ready…'
    : playingBar && current ? `${playingBar.sectionName} · bar ${playingBar.barInSection + 1} of ${playingBar.sectionLength} · ${current.name}`
    : loopPart ? `Press play to loop ${part.name} (${part.bars.length} bars)`
    : `Press play to hear the whole song (${flat.length} bars)`

  return (
    <div className="space-y-6">
      <ControlBar
        playing={player.playing} recording={recorder.recording}
        onPlay={togglePlay} onRecord={toggleRecord}
        bpm={bpm} onBpm={setBpm}
        tonic={tonic} roots={ROOTS[def.quality]} onKey={setTonic}
        scaleId={scaleId} onScale={changeScale}
        time={timeOf(pattern)} onTime={t => setPattern(firstPatternFor(t))}
        countIn={countIn} onCountIn={setCountIn}
        status={status}
      />
      {player.error && <p role="alert" className="text-sm text-tunings">{player.error}</p>}

      <SongStrip
        song={song} onEdit={editSong} onTemplate={useTemplate}
        selected={selected} onSelect={selectPart}
        progress={progress}
        summary={describePlayback({ tonic, scaleId, templateId: song.templateId, bars: flat.length, bpm, pattern, instrument: playedBy, drums, bass })}
      />

      <ChordChart
        harmony={harmony}
        part={part} onPart={editPart}
        selectedBar={selectedBar} onSelectBar={setSelectedBar}
        playingBar={playingBar && playingBar.sectionId === part.id ? playingBar.barInSection : null}
        loopPart={loopPart} onLoopPart={setLoopPart}
      />

      <BandTracks
        chordsOn={chordsOn} onChordsOn={setChordsOn}
        instrument={instrument} onInstrument={setInstrument}
        pattern={pattern} onPattern={setPattern}
        drumsOn={drumsOn} onDrumsOn={setDrumsOn}
        drumStyle={drumStyle} onDrumStyle={setDrumStyle}
        bass={bass} onBass={setBass}
        metronome={metronome} onMetronome={setMetronome}
        mix={mix} onMix={setMix}
        activeStep={live ? live.step : null}
      />

      <SoloHelper tonic={tonic} scaleId={scaleId} scaleLabel={choice.label} current={current} />
      <Recorder takes={recorder.takes} error={recorder.error} onRemove={recorder.remove} onPlayWithBacking={playWithBacking} />
    </div>
  )
}
