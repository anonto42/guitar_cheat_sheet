'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import NoteChips from '@/components/music/NoteChips'
import NoteMap from '@/components/music/NoteMap'
import Segmented from '@/components/ui/Segmented'
import { SCALE_CATALOG, rootSlug, scaleNotes } from '@/lib/music/scales'
import { spell } from '@/lib/music/notes'
import type { BuiltChord } from '@/lib/music/chordTypes'
import Panel from '@/components/ui/Panel'

interface SoloHelperProps {
  tonic: string
  /** Scale chosen for the song (a SCALE_CHOICES id). */
  scaleId: string
  scaleLabel: string
  /** The chord sounding right now, if playing. */
  current: BuiltChord | null
}

/** Which notes to solo with, where they are, and which of them match the chord playing right now. */
export default function SoloHelper({ tonic, scaleId, scaleLabel, current }: SoloHelperProps) {
  const options = useMemo(() => {
    const def = SCALE_CATALOG[scaleId]
    const minor = def.quality === 'minor'
    const minorTonic = minor ? tonic : spell(tonic, 6, 9)
    const majorTonic = minor ? spell(tonic, 3, 3) : tonic
    return [
      { id: 'song-scale', label: `${tonic} ${scaleLabel.toLowerCase()}`, notes: scaleNotes(tonic, def), tonic, guide: `/${scaleId.endsWith('-mode') ? 'modes' : 'scales'}/${scaleId}?key=${rootSlug(tonic)}`, how: 'The scale you chose for the song. Every chord here is built from it.' },
      { id: 'pent-major', label: `${majorTonic} major pentatonic`, notes: scaleNotes(majorTonic, SCALE_CATALOG['major-pentatonic']), tonic: majorTonic, guide: '/solos/major-pentatonic-solo', how: 'Bright and safe. Start here for happy songs.' },
      { id: 'pent-minor', label: `${minorTonic} minor pentatonic`, notes: scaleNotes(minorTonic, SCALE_CATALOG['minor-pentatonic']), tonic: minorTonic, guide: '/solos/pentatonic-minor-solo', how: 'The rock and blues sound. Bend the notes and add vibrato.' },
      { id: 'blues', label: `${minorTonic} blues`, notes: scaleNotes(minorTonic, SCALE_CATALOG['blues-scale']), tonic: minorTonic, guide: '/solos/blues-scale-solo', how: 'Minor pentatonic plus the blue note. Slide through the blue note, do not stop on it.' },
    ]
  }, [tonic, scaleId, scaleLabel])
  const [id, setId] = useState('song-scale')
  const scale = options.find(o => o.id === id) ?? options[0]
  const targets = current ? current.notes.filter(n => scale.notes.includes(n)) : []

  return (
    <Panel aria-label="Solo helper" className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-cream">Solo over it</h2>
        <p className="mt-1 text-sm text-muted">Keep the loop playing and improvise with one of these scales. While it plays, the notes of the current chord are outlined in gold. Land on them to sound strong.</p>
      </div>
      <Segmented label="Scale" value={id} onChange={setId} size="sm" options={options.map(o => ({ value: o.id, label: o.label }))} />
      <p className="text-sm text-outline">{scale.how}</p>
      <NoteChips notes={scale.notes} tonic={scale.tonic} />
      <p className="min-h-6 text-sm text-cream" aria-live="polite">
        {current ? <>Now playing <b>{current.name}</b>. Target notes: <b className="text-amber">{targets.length ? targets.join(' ') : current.notes.join(' ')}</b></> : 'Press Play to see target notes for each chord.'}
      </p>
      <NoteMap notes={scale.notes} tonic={scale.tonic} emphasis={current?.notes} label={`${scale.label} on the fretboard`} />
      <Link href={scale.guide} className="inline-flex min-h-9 items-center text-sm font-semibold text-ember-l hover:text-cream">How to solo with this scale</Link>
    </Panel>
  )
}
