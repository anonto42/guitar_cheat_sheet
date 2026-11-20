/**
 * Content hygiene check. Fails the build when copy contains typographic artefacts that make
 * text look machine-written:
 *   - em dashes (U+2014)
 *   - double hyphens used as a dash (" -- ")
 *
 * En dashes inside musical notation (W – W – H, 1 – ♭3 – 5, Am–F–C) are allowed.
 * Add `content-lint-ignore` on a line to exempt it.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIRS = ['app', 'components', 'features', 'config', 'data', 'services', 'lib', 'types', 'docs', '.claude', '.github']
const SCAN_FILES = ['README.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md', 'CHANGELOG.md']
const EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.json', '.yml', '.yaml'])
const RULES = [
  { name: 'em dash', test: line => line.includes('—') },
  { name: 'double hyphen used as a dash', test: line => / -- /.test(line) },
]

const files = []
const walk = dir => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.next')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full)
    else if (EXTENSIONS.has(extname(name))) files.push(full)
  }
}
for (const dir of SCAN_DIRS) { try { walk(join(root, dir)) } catch { /* directory may not exist */ } }
for (const file of SCAN_FILES) { try { statSync(join(root, file)); files.push(join(root, file)) } catch { /* optional */ } }

let problems = 0
for (const file of files) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('content-lint-ignore')) return
    for (const rule of RULES) {
      if (rule.test(line)) {
        problems++
        console.error(`${file.replace(root + '/', '')}:${i + 1}  ${rule.name}`)
      }
    }
  })
}

if (problems) {
  console.error(`\n${problems} content problem(s). Rewrite the sentence instead of using a dash (see CONTRIBUTING.md, "Writing style").`)
  process.exit(1)
}
console.log(`Content check passed (${files.length} files).`)
