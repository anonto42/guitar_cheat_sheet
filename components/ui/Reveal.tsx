import { cn } from '@/lib/utils'

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds to wait before the element appears. */
  delay?: number
}

/** Fades and lifts its content into view on load. Pure CSS. */
export default function Reveal({ delay = 0, className, style, ...props }: RevealProps) {
  return <div className={cn('reveal', className)} style={{ '--d': `${delay}s`, ...style } as React.CSSProperties} {...props} />
}
