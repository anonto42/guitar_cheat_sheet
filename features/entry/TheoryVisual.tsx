'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import NoteChips from '@/components/music/NoteChips'
import ChordDiagram from '@/components/music/ChordDiagram'
import SimpleTable from '@/components/ui/SimpleTable'
import { CHORD_TYPES, buildChord, getChordType } from '@/lib/music/chordTypes'
import { findFingerings, type Fingering } from '@/lib/music/fingerings'
import { pitchClass, spell, spellAll } from '@/lib/music/notes'
import { MAJOR_INTERVALS, NATURAL_MINOR_INTERVALS, ROOTS, triadsOf } from '@/lib/music/scales'
import KeyPicker from './KeyPicker'
import ExplorerSection from './ExplorerSection'
import ChordShapes from './ChordShapes'
import { useEntryRoot } from './useEntryRoot'

const FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'D♭', 'A♭', 'E♭', 'B♭', 'F']
const pcEq = (a: string, b: string) => pitchClass(a) === pitchClass(b)

/** Theory pages get a worked example in the chosen key. Returns null for topics without one. */
export default function TheoryVisual({ entryId }: { entryId: string }) {
  const { root, roots, setRoot } = useEntryRoot('C', 'major')
  const major = useMemo(() => spellAll(root, MAJOR_INTERVALS), [root])
  const triads = useMemo(() => triadsOf(major), [major])

  const body = (() => {
    switch (entryId) {
      case 'circle-of-fifths': return <CircleOfFifths root={root} onSelect={setRoot} />
      case 'intervals': return <Intervals root={root} />
      case 'caged-system': return <Caged root={root} />
      case 'relative-keys': return <Relative root={root} major={major} />
      case 'transposing': return <Transposing root={root} />
      case 'nashville-number': return <Nashville triads={triads} />
      case 'chord-inversions': return <Inversions root={root} />
      case 'chord-construction': return <Stacking root={root} major={major} />
      case 'voice-leading': return <VoiceLeading triads={triads} />
      case 'modes-explained': return <Modes major={major} />
      case 'diatonic-harmony': return <Diatonic major={major} triads={triads} />
      case 'secondary-dominants': return <Secondary triads={triads} />
      case 'chord-types': return <ChordTypes root={root} />
      default: return null
    }
  })()
  if (!body) return null

  return (
    <div className="space-y-8">
      <KeyPicker roots={roots} value={root} onChange={setRoot} suffix="major" />
      {body}
    </div>
  )
}

function CircleOfFifths({ root, onSelect }: { root: string; onSelect: (r: string) => void }) {
  const index = FIFTHS.findIndex(k => pcEq(k, root))
  const minor = (k: string) => spell(k, 6, 9) + 'm'
  const size = 320
  const c = size / 2
  const point = (i: number, r: number) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    return [c + Math.cos(a) * r, c + Math.sin(a) * r]
  }
  const neighbours = [(index + 11) % 12, (index + 1) % 12]
  return (
    <ExplorerSection title="The circle of fifths" hint="Each step clockwise adds one sharp. Keys next to each other share six of their seven notes. The inner ring shows each key's relative minor. Tap a key.">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="max-w-full" role="img" aria-label="Circle of fifths">
          <circle cx={c} cy={c} r={150} fill="none" stroke="rgba(169,138,125,.25)" />
          <circle cx={c} cy={c} r={95} fill="none" stroke="rgba(169,138,125,.18)" />
          {FIFTHS.map((k, i) => {
            const [x, y] = point(i, 125)
            const [mx, my] = point(i, 72)
            const selected = i === index
            const near = neighbours.includes(i)
            return (
              <g key={k} onClick={() => onSelect(ROOTS.major.find(r => pcEq(r, k)) ?? k)} className="cursor-pointer">
                <rect x={x - 19} y={y - 15} width={38} height={30} fill={selected ? '#ff6b00' : near ? 'rgba(255,107,0,.25)' : '#1c1b1b'} stroke="rgba(169,138,125,.35)" />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={selected ? '#0d0b08' : '#e5e2e1'}>{k}</text>
                <text x={mx} y={my + 4} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={selected ? '#ffb693' : '#a98a7d'}>{minor(k)}</text>
              </g>
            )
          })}
        </svg>
        <ul className="space-y-2 text-sm text-muted">
          <li><b className="text-cream">{root} major</b> is home.</li>
          <li><b className="text-cream">{FIFTHS[neighbours[1]]}</b> (one step clockwise) is the V chord and adds one sharp.</li>
          <li><b className="text-cream">{FIFTHS[neighbours[0]]}</b> (one step back) is the IV chord and adds one flat.</li>
          <li><b className="text-cream">{minor(root)}</b> is the relative minor: same notes, different home.</li>
        </ul>
      </div>
    </ExplorerSection>
  )
}

const INTERVALS: [string, number, number, string][] = [
  ['Unison', 1, 0, 'Same note'], ['Minor 2nd', 2, 1, 'Tense, horror film'], ['Major 2nd', 2, 2, 'One step of a scale'],
  ['Minor 3rd', 3, 3, 'Sad, minor chords'], ['Major 3rd', 3, 4, 'Happy, major chords'], ['Perfect 4th', 4, 5, 'Open, "Here comes the bride"'],
  ['Tritone', 4, 6, 'Restless, the "devil" interval'], ['Perfect 5th', 5, 7, 'Strong, power chords'], ['Minor 6th', 6, 8, 'Bittersweet'],
  ['Major 6th', 6, 9, 'Warm, sixth chords'], ['Minor 7th', 7, 10, 'Bluesy, dominant 7th chords'], ['Major 7th', 7, 11, 'Dreamy, major 7th chords'], ['Octave', 8, 12, 'Same note, higher'],
]

function Intervals({ root }: { root: string }) {
  return (
    <ExplorerSection title={`Every interval from ${root}`} hint="On one string, each fret is one semitone. So an interval of 5 semitones is 5 frets up the same string.">
      <SimpleTable
        head={['Interval', 'Semitones (frets)', `Note from ${root}`, 'How it sounds']}
        rows={INTERVALS.map(([name, degree, semis, sound]) => [name, String(semis), spell(root, degree, semis), sound])}
      />
    </ExplorerSection>
  )
}

function Caged({ root }: { root: string }) {
  const notes = buildChord(root, getChordType('major')).notes
  const shapes = useMemo(() => findFingerings(notes, { maxResults: 5 }), [notes])
  return (
    <ExplorerSection title={`${root} major in five places on the neck`} hint="These shapes come from the open C, A, G, E and D chords moved up the neck. Learn where they connect and you can play any chord anywhere.">
      <div className="flex flex-wrap gap-4">
        {shapes.map((s, i) => (
          <div key={i} className="border border-line2 bg-bg3/60 px-3 pb-2 pt-3">
            <ChordDiagram name={root} fingering={s} notes={notes} caption={`Shape ${i + 1}`} />
          </div>
        ))}
      </div>
    </ExplorerSection>
  )
}

function Relative({ root, major }: { root: string; major: string[] }) {
  const minorRoot = major[5]
  const minor = spellAll(minorRoot, NATURAL_MINOR_INTERVALS)
  return (
    <ExplorerSection title={`${root} major and ${minorRoot} minor share the same notes`} hint="Only the home note changes. Play the same notes but end on the orange note to hear major or minor.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-line2 bg-surface/70 p-4"><p className="mb-2 font-bold text-cream">{root} major</p><NoteChips notes={major} tonic={root} /></div>
        <div className="border border-line2 bg-surface/70 p-4"><p className="mb-2 font-bold text-cream">{minorRoot} minor</p><NoteChips notes={minor} tonic={minorRoot} /></div>
      </div>
    </ExplorerSection>
  )
}

function Transposing({ root }: { root: string }) {
  const rows = ROOTS.major.map(r => {
    const t = triadsOf(spellAll(r, MAJOR_INTERVALS))
    return { r, chords: [t[0], t[3], t[4], t[5]].map(c => c.name) }
  })
  const capo = ['C', 'A', 'G', 'E', 'D']
    .map(shape => ({ shape, fret: (pitchClass(root) - pitchClass(shape) + 12) % 12 }))
    .filter(x => x.fret <= 7)
    .sort((a, b) => a.fret - b.fret)
  return (
    <>
      <ExplorerSection title="Capo shortcuts" hint={`To sound in ${root} using easy open chord shapes, put the capo here and play the shapes as if you were in that key.`}>
        <ul className="flex flex-wrap gap-2">
          {capo.map(c => (
            <li key={c.shape} className="border border-line2 bg-surface/70 px-4 py-3 text-sm text-muted">
              {c.fret === 0 ? 'No capo' : `Capo fret ${c.fret}`}: play <b className="text-cream">{c.shape} shapes</b>
            </li>
          ))}
        </ul>
      </ExplorerSection>
      <ExplorerSection title="I – IV – V – vi in every key" hint="The same song moved to another key keeps the same numbers. Only the letters change.">
        <SimpleTable head={['Key', 'I', 'IV', 'V', 'vi']} rows={rows.map(row => [row.r === root ? <b key="k" className="text-ember">{row.r}</b> : row.r, ...row.chords])} />
      </ExplorerSection>
    </>
  )
}

function Nashville({ triads }: { triads: ReturnType<typeof triadsOf> }) {
  const song = [1, 5, 6, 4]
  return (
    <ExplorerSection title="Numbers to chords" hint="Musicians write 1 5 6 4 instead of chord names. Pick any key and the numbers turn into the right chords.">
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {triads.map((t, i) => (
          <li key={i} className="flex flex-col items-center border border-line2 bg-surface/70 py-3">
            <span className="font-display text-2xl font-bold text-ember">{i + 1}</span>
            <span className="mt-1 font-bold text-cream">{t.name}</span>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">Example: <b className="text-cream">1 – 5 – 6 – 4</b> = {song.map(n => triads[n - 1].name).join(' – ')}</p>
    </ExplorerSection>
  )
}

function Inversions({ root }: { root: string }) {
  const [r, third, fifth] = buildChord(root, getChordType('major')).notes
  const versions = [
    { label: 'Root position', bass: r, name: root },
    { label: '1st inversion (3rd in the bass)', bass: third, name: `${root}/${third}` },
    { label: '2nd inversion (5th in the bass)', bass: fifth, name: `${root}/${fifth}` },
  ]
  return (
    <ExplorerSection title={`${root} major with three different bass notes`} hint="All three use the same notes. Only the lowest note changes, which makes basslines smoother.">
      <div className="grid gap-6 sm:grid-cols-3">
        {versions.map(v => (
          <div key={v.label}>
            <p className="mb-2 text-sm font-semibold text-cream">{v.label}</p>
            <ChordShapes name={v.name} notes={[r, third, fifth]} bass={v.bass} max={2} />
          </div>
        ))}
      </div>
    </ExplorerSection>
  )
}

function Stacking({ root, major }: { root: string; major: string[] }) {
  return (
    <ExplorerSection title={`Building chords from the ${root} major scale`} hint="Start on any note, skip one, take one, skip one, take one. The three orange notes in each row are that chord.">
      <div className="overflow-x-auto border border-line2 bg-surface/70 p-3">
        <table className="min-w-[30rem] border-collapse text-sm">
          <tbody>
            {triadsOf(major).map((t, i) => (
              <tr key={i}>
                <th scope="row" className="pr-4 text-left font-bold text-cream">{t.numeral} {t.name}</th>
                {Array.from({ length: 9 }, (_, j) => {
                  const n = major[(i + j) % 7]
                  const used = j === 0 || j === 2 || j === 4
                  return <td key={j} className={cn('h-9 w-9 border border-line text-center font-bold', used ? 'bg-ember text-bg2' : 'text-outline/60')}>{n}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ExplorerSection>
  )
}

function VoiceLeading({ triads }: { triads: ReturnType<typeof triadsOf> }) {
  const shapes = useMemo(() => {
    const chain = [triads[0], triads[3], triads[4], triads[0]]
    let previous: Fingering | null = null
    return chain.map(c => {
      const options = findFingerings(c.notes, { maxResults: 5 })
      const pick: Fingering = previous
        ? options.reduce((best, f) => (Math.abs(f.baseFret - previous!.baseFret) < Math.abs(best.baseFret - previous!.baseFret) ? f : best), options[0])
        : options[0]
      previous = pick
      return { chord: c, shape: pick }
    })
  }, [triads])
  return (
    <ExplorerSection title="I – IV – V – I with small moves" hint="Each shape stays close to the last one, so most fingers barely move. Notes shared by two chords can stay where they are.">
      <div className="flex flex-wrap gap-4">
        {shapes.map(({ chord, shape }, i) => shape && (
          <div key={i} className="border border-line2 bg-bg3/60 px-3 pb-2 pt-3">
            <ChordDiagram name={chord.name} fingering={shape} notes={chord.notes} caption={chord.numeral} />
          </div>
        ))}
      </div>
    </ExplorerSection>
  )
}

const MODE_NAMES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']
const MODE_IDS = ['ionian', 'dorian-mode', 'phrygian-mode', 'lydian-mode', 'mixolydian-mode', 'aeolian-mode', 'locrian-mode']

function Modes({ major }: { major: string[] }) {
  return (
    <ExplorerSection title="Seven modes from one set of notes" hint="Each row uses the same notes. Only the starting note, and so the home sound, changes.">
      <SimpleTable
        head={['Mode', 'Home note', 'Notes']}
        rows={MODE_NAMES.map((name, i) => [
          <Link key="m" href={`/modes/${MODE_IDS[i]}?key=${encodeURIComponent(major[i].toLowerCase().replace('♯', '-sharp').replace('♭', '-flat'))}`} className="hover:text-ember-l">{name}</Link>,
          major[i],
          [...major.slice(i), ...major.slice(0, i)].join(' '),
        ])}
      />
    </ExplorerSection>
  )
}

function seventhName(root: string, third: string, fifth: string, seventh: string): string {
  const t = (pitchClass(third) - pitchClass(root) + 12) % 12
  const f = (pitchClass(fifth) - pitchClass(root) + 12) % 12
  const s = (pitchClass(seventh) - pitchClass(root) + 12) % 12
  if (t === 4 && s === 11) return `${root}maj7`
  if (t === 4 && s === 10) return `${root}7`
  if (t === 3 && f === 6) return `${root}m7♭5`
  return `${root}m7`
}

function Diatonic({ major, triads }: { major: string[]; triads: ReturnType<typeof triadsOf> }) {
  return (
    <ExplorerSection title="Every chord in the key" hint="The triad is three notes. Add one more third on top and you get the 7th chord.">
      <SimpleTable
        head={['Number', 'Triad', 'Notes', '7th chord']}
        rows={triads.map((t, i) => [t.numeral, t.name, t.notes.join(' '), seventhName(major[i], major[(i + 2) % 7], major[(i + 4) % 7], major[(i + 6) % 7])])}
      />
    </ExplorerSection>
  )
}

function Secondary({ triads }: { triads: ReturnType<typeof triadsOf> }) {
  const targets = triads.slice(1, 6)
  return (
    <ExplorerSection title="The dominant 7th that leads to each chord" hint="Play the V7 chord just before its target. It pulls strongly into it, even though it is not in the key.">
      <SimpleTable
        head={['Target chord', 'Its V7', 'Notes', 'Written']}
        rows={targets.map(t => {
          const v7 = buildChord(spell(t.notes[0], 5, 7), getChordType('dominant7'))
          return [t.name, v7.name, v7.notes.join(' '), `V7/${t.numeral}`]
        })}
      />
    </ExplorerSection>
  )
}

function ChordTypes({ root }: { root: string }) {
  const common = CHORD_TYPES.filter(t => ['major', 'minor', 'sus2', 'sus4', 'sixth', 'power', 'dominant7', 'major7', 'minor7'].includes(t.id))
  return (
    <ExplorerSection title={`One root, many chord types: ${root}`} hint="Each chord is the triad with one change. Compare the shapes to see which finger moves.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {common.map(type => {
          const chord = buildChord(root, type)
          const shape = findFingerings(chord.notes, { maxResults: 1 })[0]
          return (
            <div key={type.id} className="flex items-center gap-3 border border-line2 bg-surface/70 p-3">
              {shape && <ChordDiagram name={chord.name} fingering={shape} notes={chord.notes} />}
              <div>
                <p className="font-bold text-cream">{type.label}</p>
                <p className="mt-1 text-xs text-outline">{type.blurb}</p>
                <p className="mt-2 text-xs font-semibold text-ember-l">{chord.notes.join(' ')}</p>
              </div>
            </div>
          )
        })}
      </div>
    </ExplorerSection>
  )
}
