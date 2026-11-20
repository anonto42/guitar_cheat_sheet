import { cn } from '@/lib/utils'

interface NoteChipsProps {
  notes: string[]
  /** Note shown as the home note. */
  tonic?: string
  className?: string
}

/** Row of note names. The tonic is filled with the brand colour. */
export default function NoteChips({ notes, tonic, className }: NoteChipsProps) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Notes">
      {notes.map((note, i) => (
        <li
          key={`${note}-${i}`}
          className={cn(
            'min-w-10 px-2.5 py-1.5 text-center text-sm font-bold',
            note === tonic ? 'bg-ember text-bg2' : 'border border-line2 bg-surface/80 text-cream',
          )}
        >
          {note}
        </li>
      ))}
    </ul>
  )
}
