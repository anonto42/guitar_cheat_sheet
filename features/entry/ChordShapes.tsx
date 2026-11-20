'use client'

import { useMemo } from 'react'
import ChordDiagram from '@/components/music/ChordDiagram'
import { findFingerings } from '@/lib/music/fingerings'

interface ChordShapesProps {
  name: string
  notes: string[]
  /** Bass note for slash chords. */
  bass?: string
  max?: number
  optional?: string[]
}

const POSITION = ['Open position', 'Around fret 3', 'Around fret 6', 'Around fret 9', 'Around fret 12']

/** Several playable shapes of one chord across the neck, worked out from its notes. */
export default function ChordShapes({ name, notes, bass, max = 4, optional }: ChordShapesProps) {
  const shapes = useMemo(() => findFingerings(notes, { bass, maxResults: max, optional }), [notes, bass, max, optional])
  if (!shapes.length) return <p className="text-sm text-outline">No comfortable shape found for this chord.</p>
  return (
    <div className="flex flex-wrap gap-4">
      {shapes.map((shape, i) => {
        const bucket = Math.min(4, Math.floor(Math.max(0, shape.baseFret) / 3))
        return (
          <div key={i} className="border border-line2 bg-bg3/60 px-3 pb-2 pt-3">
            <ChordDiagram name={name} fingering={shape} notes={notes} root={bass ? notes.find(n => n !== bass) ?? notes[0] : notes[0]} caption={POSITION[shape.frets.some(f => f === 0) ? 0 : bucket]} />
          </div>
        )
      })}
    </div>
  )
}
