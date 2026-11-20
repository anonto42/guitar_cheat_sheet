import { useId } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
}

/** Labelled native select, styled to match the site controls. */
export default function Select({ label, value, options, onChange, className }: SelectProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[0.65rem] font-bold uppercase tracking-widest text-outline">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-[var(--control-h)] w-full border border-line3 bg-surface px-3 text-sm text-cream hover:border-outline/50 focus-visible:border-ember"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
