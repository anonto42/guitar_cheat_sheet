import { cn } from '@/lib/utils'

interface SimpleTableProps {
  head: string[]
  rows: React.ReactNode[][]
  className?: string
}

/** Compact data table that scrolls sideways on narrow screens. The first column is a row header. */
export default function SimpleTable({ head, rows, className }: SimpleTableProps) {
  return (
    <div className={cn('overflow-x-auto border border-line2 bg-surface/70', className)}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line2 bg-bg3/60">
            {head.map(h => (
              <th key={h} scope="col" className="px-4 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-outline">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-line last:border-b-0">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-4 py-3 font-bold text-cream">{cell}</th>
                ) : (
                  <td key={c} className="px-4 py-3 text-muted">{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
