import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Accent colour (hex). Falls back to the ember brand colour. */
  accent?: string
}

/** Small uppercase label tinted by a category accent. */
export default function Badge({ accent = '#ff6b00', className, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-widest',
        className,
      )}
      style={{ color: accent, background: `${accent}1f`, borderColor: `${accent}59`, ...style }}
      {...props}
    />
  )
}
