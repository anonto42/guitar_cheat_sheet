import { cn } from '@/lib/utils'

export interface WordPart {
  text: string
  /** Render with the animated ember gradient. */
  accent?: boolean
}

interface WordRevealProps {
  parts: WordPart[]
  /** Seconds before the first word appears. */
  delay?: number
  className?: string
}

/**
 * Heading text that rises into place one word at a time (fade, lift and un-blur).
 * Pure CSS, so it works in server components and the full text is in the HTML for search engines.
 */
export default function WordReveal({ parts, delay = 0, className }: WordRevealProps) {
  let index = 0
  return (
    <span className={cn('word-reveal', className)} style={{ '--d': `${delay}s` } as React.CSSProperties}>
      {parts.flatMap((part, p) =>
        part.text.split(' ').map((word, w, words) => {
          const i = index++
          const last = p === parts.length - 1 && w === words.length - 1
          return (
            <span key={`${p}-${w}`}>
              <span className={part.accent ? 'text-shimmer' : undefined} style={{ '--i': i } as React.CSSProperties}>{word}</span>
              {!last && ' '}
            </span>
          )
        }),
      )}
    </span>
  )
}
