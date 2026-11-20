import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  { ignores: ['.next/**', 'out/**', 'android/**', 'ios/**', 'public/sw.js', 'public/guitar-processor.js', 'next-env.d.ts'] },
]

export default config
