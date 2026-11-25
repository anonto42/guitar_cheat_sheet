'use client'

import { cn } from '@/lib/utils'
import { STRUM_PATTERNS } from '@/data/strumPatterns'
import type { StrumPattern, StrumSymbol } from '@/types'

const EIGHTHS = ['1', '&', '2', '&', '3', '&', '4', '&']
const SIXTEENTHS = ['1', 'e', '&', 'a', '2', 'e', '&', 'a', '3', 'e', '&', 'a', '4', 'e', '&', 'a']

export const CUSTOM_TEMPLATES: Record<string, { label: string; time: string; counts: string[]; stepsPerBeat: number }> = {
  'custom-8': { label: '4/4, eighth notes', time: '4/4', counts: EIGHTHS, stepsPerBeat: 2 },
  'custom-16': { label: '4/4, sixteenth notes', time: '4/4', counts: SIXTEENTHS, stepsPerBeat: 4 },
  'custom-34': { label: '3/4', time: '3/4', counts: ['1', '&', '2', '&', '3', '&'], stepsPerBeat: 2 },
  'custom-68': { label: '6/8', time: '6/8', counts: ['1', '2', '3', '4', '5', '6'], stepsPerBeat: 3 },
}

export function customPattern(templateId: string, steps?: StrumSymbol[]): StrumPattern {
  const t = CUSTOM_TEMPLATES[templateId] ?? CUSTOM_TEMPLATES['custom-8']
  return {
    id: templateId, name: 'My pattern', time: t.time, counts: t.counts, stepsPerBeat: t.stepsPerBeat,
    steps: steps && steps.length === t.counts.length ? steps : t.counts.map((_, i) => (i % t.stepsPerBeat === 0 ? 'D' : '-')),
    summary: '', details: '', usedBy: '', tip: '', tags: [],
  }
}

const CYCLE: StrumSymbol[] = ['D', 'U', 'x', 'M', '-']
const LABEL: Record<StrumSymbol, string> = { D: '↓', U: '↑', x: '×', M: 'PM', '-': '·' }

/** Options for the strumming pattern dropdown: every preset, then "make my own" templates. */
export const PATTERN_OPTIONS = [
  ...STRUM_PATTERNS.map(p => ({ value: p.id, label: `${p.name} (${p.time})`, group: 'Patterns' })),
  ...Object.entries(CUSTOM_TEMPLATES).map(([id, t]) => ({ value: id, label: `Make my own: ${t.label}`, group: 'Your own' })),
]

/** Turn a dropdown value into a pattern. */
export function patternFor(id: string): StrumPattern {
  if (id.startsWith('custom')) return customPattern(id)
  return STRUM_PATTERNS.find(p => p.id === id) ?? STRUM_PATTERNS[0]
}

interface CustomStepsEditorProps {
  pattern: StrumPattern
  onPattern: (pattern: StrumPattern) => void
}

/** Tap a step to cycle it: down, up, muted chop, palm mute, rest. */
export function CustomStepsEditor({ pattern, onPattern }: CustomStepsEditorProps) {
  return (
    <div>
      <p className="mb-2 text-xs text-outline">Tap a step to change it: down, up, muted chop, palm mute, rest.</p>
      <div className="flex flex-wrap gap-1">
        {pattern.steps.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPattern({ ...pattern, steps: pattern.steps.map((x, j) => (j === i ? CYCLE[(CYCLE.indexOf(x) + 1) % CYCLE.length] : x)) })}
            className={cn('flex h-12 w-10 flex-col items-center justify-center border text-sm font-bold', i % pattern.stepsPerBeat === 0 ? 'border-line3' : 'border-line2', s === '-' ? 'text-outline' : 'text-cream')}
          >
            {LABEL[s]}
            <span className="text-[0.55rem] text-outline">{pattern.counts[i]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
