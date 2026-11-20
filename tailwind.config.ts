import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Surfaces */
        bg:      '#131313',
        bg2:     '#0d0b08',
        bg3:     '#0e0e0e',
        surface: '#1c1b1b',
        card:    '#201f1f',
        card2:   '#2a2727',

        /* Borders */
        line:  'rgba(169,138,125,.1)',
        line2: 'rgba(169,138,125,.18)',
        line3: 'rgba(169,138,125,.28)',

        /* Ember palette */
        ember:     '#ff6b00',
        'ember-l': '#ffb693',
        'ember-dim': 'rgba(255,107,0,.12)',
        amber:     '#ffdb9d',

        /* Text */
        cream:   '#e5e2e1',
        muted:   '#e2bfb0',
        outline: '#a98a7d',

        /* Category accents */
        scales:       '#f0c93a',
        modes:        '#5fd3c8',
        chords:       '#6eb4ff',
        progressions: '#b987f5',
        techniques:   '#ff8c42',
        theory:       '#4dd98a',
        tunings:      '#ff6b8a',
        solos:        '#ff4d6d',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        serif:   ['var(--font-display)'],
        sans:    ['var(--font-sans)'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      height: { nav: 'var(--nav-h)' },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'overlay-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in .18s ease-out',
        'slide-in-left': 'slide-in-left .22s cubic-bezier(.32,.72,0,1)',
        'overlay-in': 'overlay-in .18s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
