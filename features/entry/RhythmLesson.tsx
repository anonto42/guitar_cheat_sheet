'use client'

import Link from 'next/link'
import RhythmGrid from '@/components/music/RhythmGrid'
import Quiz, { type QuizQuestion } from '@/components/ui/Quiz'
import SimpleTable from '@/components/ui/SimpleTable'
import ExplorerSection from './ExplorerSection'

const TAB = `e|------------------------------------|
B|------------------------------------|
G|------------------------------------|
D|-----------4--7--4------------------|
A|--5--7--9-----------9--7--5--5------|
E|------------------------------------|
    1 trip let 2 trip let 3 trip let 4`

const OTHER_RHYTHMS = [
  ['Quarter notes', '1 – 2 – 3 – 4', 'One note on each beat. Slow and steady.'],
  ['Eighth notes', '1 & 2 & 3 & 4 &', 'Two notes per beat. Very common in rock.'],
  ['Sixteenth notes', '1 e & a 2 e & a', 'Four notes per beat. For fast runs.'],
  ['Triplets', '1 trip let 2 trip let', 'Three even notes per beat. Blues and rock love them.'],
  ['Sextuplets', '1 2 3 4 5 6 per beat', 'Six even notes per beat. Very fast lead runs.'],
  ['Dotted rhythm', 'long – short, long – short', 'One note lasts one and a half times as long as normal.'],
  ['Swing', 'LONG short LONG short', 'Pairs of notes played long then short, not equal.'],
]

const NOTATION = [
  ['h', 'Hammer-on', '7h9', 'Pick the 7th fret, then press the 9th fret hard without picking again.', '/techniques/hammer-on'],
  ['p', 'Pull-off', '9p7', 'Play the 9th fret, then pull the finger off so the 7th fret sounds.', '/techniques/pull-off'],
  ['b', 'Bend', '9b11', 'Push the string up until the 9th fret sounds like the 11th fret.', '/techniques/bending'],
  ['~', 'Vibrato', '7~~~', 'Shake the note a little up and down while it rings.', '/techniques/vibrato'],
  ['/ and \\', 'Slide', '7/9', 'Keep pressing and slide the finger to the new fret.', '/techniques/slide-technique'],
  ['PM', 'Palm mute', 'PM----', 'Rest the side of your picking hand on the strings near the bridge.', '/techniques/palm-muting'],
  ['↓ ↑', 'Alternate picking', '↓ ↑ ↓ ↑', 'Pick down, then up, then down. Never two downs in a row.', '/techniques/alternate-picking'],
]

const ROADMAP = [
  ['1', 'Quarter and eighth notes', 'Must learn'],
  ['2', 'Alternate picking', 'Must learn'],
  ['3', 'Triplets', 'Must learn'],
  ['4', 'Hammer-ons and pull-offs', 'Must learn'],
  ['5', 'Slides', 'Important'],
  ['6', 'Bends and vibrato', 'Important'],
  ['7', 'Sixteenth notes', 'Important'],
  ['8', 'Swing and shuffle feel', 'Next level'],
  ['9', 'Sextuplets', 'Next level'],
  ['10', 'Legato and fast picking', 'Advanced'],
]

const QUESTIONS: QuizQuestion[] = [
  { question: 'How many even notes are in one beat of a triplet?', options: ['2', '3', '4', '6'], answer: 1, explain: 'A triplet splits one beat into three equal notes: 1 trip let.' },
  { question: 'How many notes per beat are sixteenth notes?', options: ['2', '3', '4', '8'], answer: 2, explain: 'Sixteenth notes are four per beat: 1 e & a.' },
  { question: 'What does 7h9 mean in tab?', options: ['Slide', 'Hammer-on', 'Pull-off', 'Bend'], answer: 1, explain: 'h means hammer-on: pick fret 7, then hammer fret 9 without picking.' },
  { question: 'What does 9p7 mean?', options: ['Pull-off', 'Palm mute', 'Hammer-on', 'Vibrato'], answer: 0, explain: 'p means pull-off: pull the finger off fret 9 so fret 7 sounds.' },
]

/** Rhythm lesson for lead guitar, written in short, simple sentences. */
export default function RhythmLesson() {
  return (
    <div className="space-y-12">
      <ExplorerSection title="1. What is a triplet?" hint="A triplet is a rhythm, not a scale and not a special way to press the strings.">
        <div className="space-y-2 text-sm leading-relaxed text-muted">
          <p>Music moves in beats. Count them: <b className="text-cream">1 2 3 4</b>.</p>
          <p>A triplet puts <b className="text-cream">three equal notes inside one beat</b>. Count: <b className="text-cream">1 trip let, 2 trip let, 3 trip let, 4 trip let</b>.</p>
          <p>All the rows below take the same time. Faster rhythms just cut each beat into more equal parts. Press Hear it to feel the difference.</p>
        </div>
      </ExplorerSection>

      <ExplorerSection title="2. See and hear the rhythms" hint="The orange square is the start of each beat.">
        <RhythmGrid />
      </ExplorerSection>

      <ExplorerSection title="3. Play triplets on guitar" hint="This uses the D major pentatonic scale (D E F♯ A B). Pick every note evenly: down up down, up down up.">
        <pre className="overflow-x-auto border border-line2 bg-bg3/80 p-4 font-mono text-sm leading-6 text-cream">{TAB}</pre>
        <p className="text-sm text-muted">Notes: D E F♯ | F♯ A F♯ | F♯ E D | D. Start at 60 BPM. When it feels easy, go 5 BPM faster.</p>
      </ExplorerSection>

      <ExplorerSection title="4. Other rhythms you will meet">
        <SimpleTable head={['Rhythm', 'How to count', 'In simple words']} rows={OTHER_RHYTHMS.map(r => [...r])} />
      </ExplorerSection>

      <ExplorerSection title="5. Tab symbols for lead guitar" hint="These are techniques, not rhythms. Tap a name to open its full page.">
        <SimpleTable
          head={['Symbol', 'Technique', 'Example', 'What to do']}
          rows={NOTATION.map(([symbol, name, example, what, href]) => [
            symbol,
            <Link key="l" href={href} className="inline-flex min-h-9 min-w-9 items-center hover:text-ember-l">{name}</Link>,
            <code key="c" className="font-mono text-cream">{example}</code>,
            what,
          ])}
        />
      </ExplorerSection>

      <ExplorerSection title="6. What to learn first" hint="Go in this order. Each step makes the next one easier.">
        <SimpleTable head={['Step', 'Skill', 'Priority']} rows={ROADMAP.map(r => [...r])} />
      </ExplorerSection>

      <ExplorerSection title="7. Test yourself">
        <Quiz title="Rhythm quiz" questions={QUESTIONS} />
      </ExplorerSection>
    </div>
  )
}
