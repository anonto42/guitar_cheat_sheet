'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getStrumPattern } from '@/data/strumPatterns'
import { DEFAULT_MIX, type DrumStyle, type InstrumentId, type Mix, type PlaybackConfig } from '@/lib/music/audio'
import { chordsFromNotes, getPracticeProgression } from '@/lib/music/progressions'
import { SCALE_CATALOG, harmonyNotes, normaliseRoot, rootFromSlug, scaleChoice } from '@/lib/music/scales'
import { voiceChord } from '@/lib/music/voicing'
import type { StrumPattern } from '@/types'
import TransportBar from './TransportBar'
import SongEditor from './SongEditor'
import PatternEditor from './PatternEditor'
import SoundPanel from './SoundPanel'
import SoloHelper from './SoloHelper'
import Recorder from './Recorder'
import { flattenSong, songTemplate, type Song } from './song'
import { usePlayer } from './usePlayer'
import { useRecorder, type Take } from './useRecorder'

/**
 * Practice Studio: build a backing track (key, scale, song parts, chords, strumming, instrument,
 * bass, drums), play along at any tempo, record yourself, and see which notes to solo with.
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
  const [editingId, setEditingId] = useState(() => song.sections[0].id)
  const [scope, setScope] = useState<'song' | 'section'>('song')
  const [pattern, setPattern] = useState<StrumPattern>(() => getStrumPattern(params.get('pattern') ?? ''))
  const [bpm, setBpm] = useState(84)
  const [metronome, setMetronome] = useState(true)
  const [countIn, setCountIn] = useState(true)
  const [instrument, setInstrument] = useState<InstrumentId>('acoustic')
  const [drums, setDrums] = useState<DrumStyle>('off')
  const [bass, setBass] = useState(false)
  const [mix, setMix] = useState<Mix>(DEFAULT_MIX)
  const [showShapes, setShowShapes] = useState(true)

  const def = SCALE_CATALOG[scaleId]
  const choice = scaleChoice(scaleId)
  const harmony = useMemo(() => harmonyNotes(tonic, def), [tonic, def])
  const flat = useMemo(() => flattenSong(song, scope === 'section' ? editingId : null), [song, scope, editingId])
  const chords = useMemo(() => chordsFromNotes(harmony, flat.map(b => b.step)), [harmony, flat])

  const config: PlaybackConfig = useMemo(() => ({
    bpm, bars: chords.map(c => voiceChord(c.notes)), pattern, instrument, bass, drums, metronome, mix,
  }), [bpm, chords, pattern, instrument, bass, drums, metronome, mix])

  const player = usePlayer(config)
  const recorder = useRecorder()
  const position = player.playing ? player.position : null
  const playingBar = position && !position.countIn ? flat[position.bar] ?? null : null
  const current = position && !position.countIn ? chords[position.bar] ?? null : null

  const changeScale = (id: string) => {
    setScaleId(id)
    setTonic(t => normaliseRoot(t, SCALE_CATALOG[id].quality))
  }

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
    : `${tonic} ${choice.label.toLowerCase()} · ${flat.length} bars · ${pattern.time}`

  return (
    <div className="space-y-6">
      <TransportBar
        playing={player.playing} recording={recorder.recording}
        bpm={bpm} onBpm={setBpm}
        countIn={countIn} onCountIn={setCountIn}
        metronome={metronome} onMetronome={setMetronome}
        onPlay={togglePlay} onRecord={toggleRecord}
        status={status}
      />
      {player.error && <p role="alert" className="text-sm text-tunings">{player.error}</p>}

      <SongEditor
        tonic={tonic} scaleId={scaleId} quality={def.quality} harmony={harmony}
        onKey={setTonic} onScale={changeScale}
        song={song} onSong={setSong}
        editingId={editingId} onEditing={setEditingId}
        scope={scope} onScope={setScope}
        playing={playingBar}
        showShapes={showShapes} onShowShapes={setShowShapes}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PatternEditor pattern={pattern} onPattern={setPattern} activeStep={position && !position.countIn ? position.step : null} />
        <SoundPanel
          instrument={instrument} onInstrument={setInstrument}
          drums={drums} onDrums={setDrums}
          bass={bass} onBass={setBass}
          mix={mix} onMix={setMix}
        />
      </div>

      <SoloHelper tonic={tonic} scaleId={scaleId} scaleLabel={choice.label} current={current} />
      <Recorder takes={recorder.takes} error={recorder.error} onRemove={recorder.remove} onPlayWithBacking={playWithBacking} />
    </div>
  )
}
