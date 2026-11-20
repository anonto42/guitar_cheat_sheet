import { cn } from '@/lib/utils'

interface ProgressBarProps {
  /** 0 to 1. */
  value: number
  label: string
  className?: string
}

/** Determinate progress bar with a moving highlight while it fills. */
export default function ProgressBar({ value, label, className }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={cn('h-2 overflow-hidden rounded-full bg-white/10', className)}
    >
      <div
        className="relative h-full rounded-full bg-gradient-to-r from-ember to-amber shadow-[0_0_12px_rgba(255,107,0,.55)] transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%` }}
      >
        {percent < 100 && <span className="shimmer absolute inset-0" />}
      </div>
    </div>
  )
}
