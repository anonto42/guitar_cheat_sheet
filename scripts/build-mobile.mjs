/**
 * Builds the static bundle used by the Capacitor native apps.
 *
 *   npm run build:mobile            static export to ./out
 *   npm run build:mobile -- --sync  also run `cap sync` to copy it into android/ and ios/
 *
 * The /og image route needs a server (edge runtime), so it is moved aside for the
 * export and always restored afterwards, even when the build fails.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, renameSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ogDir = join(root, 'app/og')
const parked = join(root, 'app/_og.parked')

const run = (cmd, args, env = {}) =>
  spawnSync(cmd, args, { cwd: root, stdio: 'inherit', env: { ...process.env, ...env }, shell: process.platform === 'win32' })

if (existsSync(parked)) renameSync(parked, ogDir) // recover from an interrupted earlier run
if (existsSync(ogDir)) renameSync(ogDir, parked)

let status = 1
try {
  status = run('npx', ['next', 'build'], { BUILD_TARGET: 'mobile' }).status ?? 1
} finally {
  if (existsSync(parked)) renameSync(parked, ogDir)
}

if (status === 0 && process.argv.includes('--sync')) status = run('npx', ['cap', 'sync']).status ?? 1
process.exit(status)
