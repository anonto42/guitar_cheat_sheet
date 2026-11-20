'use client'

import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLearnProgress } from './useLearnProgress'

/** Toggle that marks a learning step as done. */
export default function StepDoneButton({ slug }: { slug: string }) {
  const { done, toggle } = useLearnProgress()
  const isDone = done.includes(slug)
  return (
    <Button variant={isDone ? 'primary' : 'secondary'} onClick={() => toggle(slug)} aria-pressed={isDone}>
      <Check size={16} aria-hidden="true" />
      {isDone ? 'Done' : 'Mark as done'}
    </Button>
  )
}
