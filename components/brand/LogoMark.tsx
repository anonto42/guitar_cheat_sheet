import { useId } from 'react'

interface LogoMarkProps {
  size?: number
  className?: string
}

/**
 * Brand mark: a guitar pick with a fretboard cut into it.
 * Mirrors `public/favicon.svg` so the site, tab icon and app icon match.
 */
export default function LogoMark({ size = 32, className }: LogoMarkProps) {
  const id = useId()
  const grad = `${id}-grad`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={grad} x1="14" y1="6" x2="50" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffb693" />
          <stop offset=".45" stopColor="#ff7a1a" />
          <stop offset="1" stopColor="#d94f00" />
        </linearGradient>
      </defs>
      <path
        d="M32 5c-10.5 0-22 3.2-22 15.6C10 36.8 24 59 32 59s22-22.2 22-38.400C54 8.2 42.5 5 32 5Z"
        fill={`url(#${grad})`}
      />
      {/* strings */}
      <g stroke="#0d0b08" strokeWidth="2.2" strokeLinecap="round" opacity=".88">
        <path d="M24 17v30" />
        <path d="M32 15v36" />
        <path d="M40 17v30" />
      </g>
      {/* frets */}
      <g stroke="#0d0b08" strokeWidth="1.8" strokeLinecap="round" opacity=".55">
        <path d="M18 25h28" />
        <path d="M20 34h24" />
        <path d="M23 43h18" />
      </g>
      {/* played note */}
      <circle cx="32" cy="29.5" r="3.6" fill="#0d0b08" />
      <circle cx="32" cy="29.5" r="1.5" fill="#ffdb9d" />
    </svg>
  )
}
