import { cn } from '@/lib/utils'

type NoteShape = 'quarter' | 'eighth' | 'beamed'

interface FloatingNote {
  shape: NoteShape
  /** Vertical position, % of viewport height. */
  top: number
  size: number
  /** Seconds for one full pass across the screen. */
  duration: number
  /** Negative delay so the page starts with notes already mid-screen. */
  delay: number
  /** Seconds for one up and down bob. */
  bob: number
  opacity: number
  color: string
}

const COLORS = ['#ff6b00', '#ffb693', '#ffdb9d', '#f0c93a', '#b987f5', '#6eb4ff']
const SHAPES: NoteShape[] = ['quarter', 'eighth', 'beamed', 'eighth', 'quarter', 'beamed']

/** Fixed layout so server and client render the same markup (no random values at render time). */
const NOTES: FloatingNote[] = Array.from({ length: 16 }, (_, i) => ({
  shape: SHAPES[i % SHAPES.length],
  top: 6 + ((i * 37) % 86),
  size: 22 + ((i * 13) % 26),
  duration: 46 + ((i * 11) % 34),
  delay: -((i * 17) % 70),
  bob: 5 + ((i * 3) % 6),
  opacity: 0.16 + ((i * 7) % 9) / 100,
  color: COLORS[i % COLORS.length],
}))

function NoteGlyph({ shape }: { shape: NoteShape }) {
  switch (shape) {
    case 'quarter':
      return (
        <svg viewBox="0 0 24 32" fill="currentColor"><ellipse cx="8" cy="25" rx="6" ry="4.5" transform="rotate(-20 8 25)" /><rect x="12.5" y="2" width="2.2" height="23" /></svg>
      )
    case 'eighth':
      return (
        <svg viewBox="0 0 24 32" fill="currentColor"><ellipse cx="8" cy="25" rx="6" ry="4.5" transform="rotate(-20 8 25)" /><rect x="12.5" y="2" width="2.2" height="23" /><path d="M14.7 2c1 6 8 7 8 14-1-3-4-5-8-5z" /></svg>
      )
    case 'beamed':
      return (
        <svg viewBox="0 0 34 32" fill="currentColor"><ellipse cx="7" cy="25" rx="5.5" ry="4.2" transform="rotate(-20 7 25)" /><ellipse cx="26" cy="22" rx="5.5" ry="4.2" transform="rotate(-20 26 22)" /><rect x="11" y="3" width="2.2" height="22" /><rect x="30" y="1" width="2.2" height="21" /><path d="M11 3 32.2 1v5L11 8z" /></svg>
      )
  }
}

/**
 * Site-wide background: deep dark base, a soft ember glow, faint staff lines and music
 * notes that slide slowly across the screen. Pure CSS motion, no JavaScript, and it stands
 * still for people who prefer reduced motion. Mount once in the root layout.
 */
export default function MusicBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(255,107,0,.12),transparent_70%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(185,135,245,.06),transparent_70%)]" />

      {/* Staff lines */}
      {[34, 70].map(top => (
        <div key={top} className="absolute inset-x-0 flex flex-col gap-3 opacity-[.07]" style={{ top: `${top}%` }}>
          {[0, 1, 2, 3, 4].map(n => <span key={n} className="h-px bg-ember-l" />)}
        </div>
      ))}

      {NOTES.map((n, i) => (
        <span
          key={i}
          className="bg-note absolute left-0"
          style={{
            top: `${n.top}%`,
            width: n.size,
            color: n.color,
            opacity: n.opacity,
            animationDuration: `${n.duration}s`,
            animationDelay: `${n.delay}s`,
          }}
        >
          <span className="bg-note-bob block" style={{ animationDuration: `${n.bob}s`, animationDelay: `${n.delay}s` }}>
            <NoteGlyph shape={n.shape} />
          </span>
        </span>
      ))}
    </div>
  )
}
