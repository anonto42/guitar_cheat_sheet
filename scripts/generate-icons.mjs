/**
 * Generates every PNG icon from public/favicon.svg.
 * Run after changing the SVG:  npm run generate-icons
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public/favicon.svg'))
const BACKGROUND = '#0d0b08'

const icons = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'favicon-32x32.png', size: 32 },
]

for (const { file, size } of icons) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(join(root, 'public', file))
  console.log(`ok  ${file} (${size}x${size})`)
}

// Maskable icon: keep the artwork inside the central safe zone (80%) on a solid background.
const inner = await sharp(svg, { density: 384 }).resize(410, 410).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: BACKGROUND } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(join(root, 'public/icon-maskable-512.png'))
console.log('ok  icon-maskable-512.png (512x512)')
