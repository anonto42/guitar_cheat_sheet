import type { CategoryConfig, GuitarEntry } from '@/types'
import { cn } from '@/lib/utils'

/** Split "a | b | c" into separate lines so long formulas stay readable. */
function parts(text: string): string[] {
  return text.split(/\s*\|\s*/).map(s => s.trim()).filter(Boolean)
}

function Card({ label, lines, accent }: { label: string; lines: string[]; accent: string }) {
  return (
    <div className="border border-line2 bg-surface/80 p-4">
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">{label}</p>
      {lines.length === 1 ? (
        <p className="mt-2 text-base font-semibold leading-snug" style={{ color: accent }}>{lines[0]}</p>
      ) : lines.every(l => l.length <= 6) ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {lines.map((line, i) => (
            <li key={i} className="min-w-9 border border-line2 bg-bg3/60 px-2 py-1 text-center text-sm font-bold text-cream">{line}</li>
          ))}
        </ul>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2 text-sm leading-snug text-cream">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0" style={{ background: accent }} aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Formula, degrees and example as clear cards. Long content stacks instead of squeezing into columns. */
export default function InfoCards({ entry, cat, compact = false }: { entry: GuitarEntry; cat: CategoryConfig; compact?: boolean }) {
  const cards = [
    { label: cat.formulaLabel ?? 'Formula', lines: parts(entry.formula) },
    { label: cat.degreesLabel ?? 'Degrees', lines: parts(entry.degrees) },
    { label: `${cat.exampleLabel ?? 'Example in'} ${entry.example.root}`, lines: entry.example.notes },
  ].filter((c, i) => c.lines.length > 0 && (!compact || i === 0))
  const long = cards.some(c => c.lines.some(l => l.length > 40) || c.lines.join(' ').length > 160)
  return (
    <div className={cn('grid gap-3', long ? 'grid-cols-1' : 'md:grid-cols-3')}>
      {cards.map(c => <Card key={c.label} label={c.label} lines={c.lines} accent={cat.a} />)}
    </div>
  )
}
