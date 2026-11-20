'use client'

import ProgressBar from '@/components/ui/ProgressBar'
import { useLearnProgress } from './useLearnProgress'

/** "3 of 7 steps done" with a bar. Reads the same saved state as the step buttons. */
export default function LearnProgress({ total }: { total: number }) {
  const { done } = useLearnProgress()
  const count = Math.min(done.length, total)
  return (
    <div className="max-w-md">
      <ProgressBar value={total ? count / total : 0} label="Learning path progress" />
      <p className="mt-2 text-xs font-semibold text-outline">
        <span className="text-ember-l">{count}</span> of {total} steps done
      </p>
    </div>
  )
}
