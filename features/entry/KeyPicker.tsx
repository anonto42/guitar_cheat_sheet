'use client'

import Segmented from '@/components/ui/Segmented'

interface KeyPickerProps {
  roots: string[]
  value: string
  onChange: (root: string) => void
  /** Text after the root in the label, for example "major" or "minor". */
  suffix?: string
}

/** Twelve key buttons. Everything below it on the page redraws in the chosen key. */
export default function KeyPicker({ roots, value, onChange, suffix }: KeyPickerProps) {
  return (
    <div className="border border-line2 bg-surface/70 p-4">
      <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-outline">
        Choose a key <span className="text-ember-l">{value}{suffix ? ` ${suffix}` : ''}</span>
      </p>
      <Segmented label="Key" value={value} onChange={onChange} options={roots.map(r => ({ value: r, label: r }))} size="sm" />
    </div>
  )
}
