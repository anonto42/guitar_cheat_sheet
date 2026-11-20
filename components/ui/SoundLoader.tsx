import { cn } from '@/lib/utils'

interface SoundLoaderProps {
  /** Visible text under the bars. Always announced to screen readers, even when hidden visually. */
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const HEIGHTS = { sm: 'h-4', md: 'h-8', lg: 'h-14' } as const
const WIDTHS = { sm: 'w-[3px] gap-[3px]', md: 'w-1 gap-1', lg: 'w-1.5 gap-1.5' } as const

/** Audio-equalizer loader: bars that pulse out of phase, in the ember brand colours. */
export default function SoundLoader({ label = 'Loading', size = 'md', className }: SoundLoaderProps) {
  return (
    <div role="status" className={cn('inline-flex flex-col items-center gap-3', className)}>
      <div className={cn('flex items-end', HEIGHTS[size], size === 'sm' ? 'gap-[3px]' : size === 'md' ? 'gap-1' : 'gap-1.5')} aria-hidden="true">
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className={cn('eq-bar h-full origin-bottom rounded-full bg-gradient-to-t from-ember to-amber', WIDTHS[size].split(' ')[0])}
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">{label}</span>
    </div>
  )
}
