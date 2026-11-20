'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from './Button'

export interface QuizQuestion {
  question: string
  options: string[]
  /** Index of the right option. */
  answer: number
  /** Short explanation shown after checking. */
  explain: string
}

/** Small multiple-choice quiz. Answers are checked in the browser; nothing is stored. */
export default function Quiz({ title, questions }: { title: string; questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null))
  const [checked, setChecked] = useState(false)
  const answered = picked.filter(p => p !== null).length
  const score = picked.filter((p, i) => p === questions[i].answer).length

  return (
    <div className="space-y-5 border border-line2 bg-surface/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-cream">{title}</h3>
        <p className="text-xs font-semibold text-outline">{checked ? `${score} of ${questions.length} right` : `${answered} of ${questions.length} answered`}</p>
      </div>
      <ol className="space-y-5">
        {questions.map((q, i) => (
          <li key={q.question}>
            <p className="font-semibold text-cream">{i + 1}. {q.question}</p>
            <div role="radiogroup" aria-label={q.question} className="mt-2 grid gap-2 sm:grid-cols-2">
              {q.options.map((option, j) => {
                const selected = picked[i] === j
                const right = checked && j === q.answer
                const wrong = checked && selected && j !== q.answer
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={checked}
                    onClick={() => setPicked(p => p.map((v, k) => (k === i ? j : v)))}
                    className={cn(
                      'flex items-center justify-between border px-3 py-2.5 text-left text-sm transition-colors',
                      right ? 'border-theory bg-theory/10 text-theory'
                        : wrong ? 'border-tunings bg-tunings/10 text-tunings'
                        : selected ? 'border-ember bg-ember-dim text-cream'
                        : 'border-line2 text-muted hover:border-line3',
                    )}
                  >
                    {option}
                    {right && <CheckCircle2 size={16} aria-hidden="true" />}
                    {wrong && <XCircle size={16} aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
            {checked && <p className="mt-2 text-sm text-outline">{q.explain}</p>}
          </li>
        ))}
      </ol>
      <div className="flex gap-3">
        <Button onClick={() => setChecked(true)} disabled={checked || answered < questions.length}>Check my answers</Button>
        {checked && <Button variant="secondary" onClick={() => { setPicked(questions.map(() => null)); setChecked(false) }}>Try again</Button>}
      </div>
    </div>
  )
}
