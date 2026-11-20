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

// Native app sources for `npx @capacitor/assets generate` (Android launcher icons and splash screens).
import { mkdirSync } from 'node:fs'
const assets = join(root, 'assets')
mkdirSync(assets, { recursive: true })
const art = await sharp(svg, { density: 1200 }).resize(1024, 1024).png().toBuffer()
await sharp(art).toFile(join(assets, 'icon-only.png'))
const mark = await sharp(svg, { density: 1200 }).resize(660, 660).png().toBuffer()
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: mark, gravity: 'center' }]).png().toFile(join(assets, 'icon-foreground.png'))
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BACKGROUND } }).png().toFile(join(assets, 'icon-background.png'))
const splashMark = await sharp(svg, { density: 1200 }).resize(720, 720).png().toBuffer()
for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 4, background: BACKGROUND } })
    .composite([{ input: splashMark, gravity: 'center' }]).png().toFile(join(assets, name))
}
console.log('ok  assets/ (icon-only, icon-foreground, icon-background, splash, splash-dark)')
