'use client'

import { cn } from '@/lib/utils'

interface SegmentedProps<T extends string> {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  className?: string
  size?: 'sm' | 'md'
}

/** Row of toggle buttons where exactly one is selected (tabs, positions, keys). */
export default function Segmented<T extends string>({ label, value, options, onChange, className, size = 'md' }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {options.map(option => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'border font-semibold transition-colors',
              size === 'sm' ? 'h-9 min-w-10 px-2.5 text-xs' : 'h-[var(--control-h)] min-w-10 px-3.5 text-sm',
              selected ? 'border-ember bg-ember text-bg2' : 'border-line2 bg-surface/70 text-outline hover:border-line3 hover:text-cream',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
