import Link from 'next/link'
import NoteChips from './NoteChips'

interface ChordCardProps {
  name: string
  notes: string[]
  blurb?: string
  href?: string
}

/** One chord: symbol, tones and an optional one-line explanation linking to its reference entry. */
export default function ChordCard({ name, notes, blurb, href }: ChordCardProps) {
  const body = (
    <>
      <p className="font-display text-2xl font-bold text-cream">{name}</p>
      <NoteChips notes={notes} className="mt-3" />
      {blurb && <p className="mt-3 text-xs leading-relaxed text-outline">{blurb}</p>}
    </>
  )
  const classes = 'block h-full border border-line2 bg-surface/80 p-4 transition-colors'
  return href ? (
    <Link href={href} className={`${classes} hover:bg-card`}>{body}</Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}
