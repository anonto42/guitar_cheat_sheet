import type { StrumPattern } from '@/types'

/**
 * Single source for every strumming pattern. The reference entries in
 * data/entries/strumming.ts and the practice player both read from here.
 * Symbols: D down, U up, x muted chop, M palm-muted down, - rest (hand keeps moving).
 */
const EIGHTHS = ['1', '&', '2', '&', '3', '&', '4', '&']
const SIXTEENTHS = ['1', 'e', '&', 'a', '2', 'e', '&', 'a', '3', 'e', '&', 'a', '4', 'e', '&', 'a']

export const STRUM_PATTERNS: StrumPattern[] = [
  {
    id: 'down-strums', name: 'Basic Down Strums', time: '4/4', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['D', '-', 'D', '-', 'D', '-', 'D', '-'],
    summary: 'One downstroke on every beat. The first pattern to learn and the base for all the others.',
    details: 'Strum down on 1, 2, 3 and 4 and let each chord ring. Keep your hand swinging in steady eighth notes even when you are not touching the strings, so the up and down motion becomes automatic for later patterns.',
    usedBy: 'Beginner songs, ballads, punk, anything that needs a steady pulse',
    tip: 'Say "1 2 3 4" out loud and tap your foot on every number. Your foot never stops, even between chord changes.',
    tags: ['basic','beginner','downstroke','first strumming pattern','4/4'],
  },
  {
    id: 'folk-strum', name: 'Folk Strum (Old Faithful)', time: '4/4', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    summary: 'Down, down-up, up-down-up. The most used acoustic pattern of all.',
    details: 'Accent beat 1 with a firm downstroke. The missed strum on the "&" after 1 and the missed down on beat 3 are what give the pattern its bounce. Keep the hand moving through the gaps and only touch the strings on the written strokes.',
    usedBy: 'Folk, country, campfire songs, singer-songwriter, pop ballads',
    tip: 'If it feels stiff, play the full D U D U D U D U first, then simply stop the hand from hitting the strings on the rests.',
    tags: ['folk','acoustic','old faithful','campfire','D DU UDU','popular'],
  },
  {
    id: 'pop-eighths', name: 'Steady Eighths', time: '4/4', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
    summary: 'Down and up on every eighth note. Driving, even and full of energy.',
    details: 'Every downstroke lands on a number and every upstroke on an "&". Lean the weight into the downs and play the ups lighter and on the top strings only. This is the foundation that every other eighth-note pattern is cut from.',
    usedBy: 'Pop, rock, indie, upbeat acoustic songs',
    tip: 'Strum from the wrist, not the elbow. A loose wrist is what makes fast eighths easy.',
    tags: ['eighth notes','pop','rock','alternate strumming','driving'],
  },
  {
    id: 'reggae-offbeat', name: 'Reggae Offbeat', time: '4/4', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['-', 'U', '-', 'U', '-', 'U', '-', 'U'],
    summary: 'Short chops on the upbeats only. Leaves space and makes the groove bounce.',
    details: 'Play a short, crisp upstroke on every "&" and mute the strings straight away with the fretting hand. Silence on the beat is the whole point, so the chord should never ring into the next number.',
    usedBy: 'Reggae, ska, some funk and pop-punk verses',
    tip: 'Relax the fretting fingers right after each chop so the chord stops cleanly.',
    tags: ['reggae','ska','offbeat','upstroke','skank','chop'],
  },
  {
    id: 'blues-shuffle', name: 'Blues Shuffle', time: '4/4 swung', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['D', '-', 'D', 'U', 'D', '-', 'D', 'U'],
    summary: 'A swung groove with a long-short feel. The heartbeat of the blues.',
    details: 'Swing the eighth notes so each beat is a long note followed by a short one. Play it on dominant 7th chords for the classic sound. The same shape works as a lazy backbeat under a 12-bar blues.',
    usedBy: 'Blues, rock and roll, rockabilly, country blues',
    tip: 'Count "1-trip-let 2-trip-let" and hit the first and third parts of each triplet.',
    tags: ['blues','shuffle','swing','12-bar','triplet feel'],
  },
  {
    id: 'ballad-six-eight', name: 'Ballad 6/8', time: '6/8', stepsPerBeat: 3,
    counts: ['1', '2', '3', '4', '5', '6'],
    steps: ['D', '-', '-', 'D', 'U', '-'],
    summary: 'Two big pulses per bar with a rolling lilt. Slow, emotional and flowing.',
    details: 'Feel two beats per bar, each divided into three. The strong downs land on 1 and 4 and a small up fills the gap after the second pulse. In 6/8 the BPM in the practice player counts these two big beats.',
    usedBy: 'Slow ballads, worship songs, Irish and folk waltzes',
    tip: 'Count "ONE two three FOUR five six" and keep the six counts even.',
    tags: ['6/8','ballad','compound time','slow','worship'],
  },
  {
    id: 'waltz', name: 'Waltz 3/4', time: '3/4', stepsPerBeat: 2,
    counts: ['1', '&', '2', '&', '3', '&'],
    steps: ['D', '-', 'D', 'U', 'D', 'U'],
    summary: 'A strong first beat followed by two lighter strums. The classic three-count.',
    details: 'Play a heavy bass-note downstroke on beat 1, then strum the top strings on beats 2 and 3. Picking only the root note on beat 1 gives the traditional oom-pah-pah sound.',
    usedBy: 'Waltzes, country ballads, folk, some pop songs in three',
    tip: 'Count "ONE two three, ONE two three". Lean on every ONE.',
    tags: ['waltz','3/4','three four time','folk','country'],
  },
  {
    id: 'funk-sixteenths', name: 'Funk Sixteenths', time: '4/4', stepsPerBeat: 4, counts: SIXTEENTHS,
    steps: ['D', 'x', 'x', 'U', '-', 'U', 'x', 'U', 'D', 'x', 'x', 'U', '-', 'U', 'x', 'U'],
    summary: 'Sixteenth-note grid with muted chops between the chords. Tight and percussive.',
    details: 'The hand never stops moving in sixteenth notes. Strum the written chords and let the fretting hand release to mute on the x strokes so they sound like scratchy percussion. Accent the downbeats and keep the ups short.',
    usedBy: 'Funk, R&B, disco, neo-soul, pop with a groove',
    tip: 'Start at 60 BPM. Speed comes from relaxation, not from pushing harder.',
    tags: ['funk','sixteenth','muted','percussive','r&b','groove'],
  },
  {
    id: 'rock-chug', name: 'Palm-Muted Rock Chug', time: '4/4', stepsPerBeat: 2, counts: EIGHTHS,
    steps: ['D', 'M', 'M', 'M', 'D', 'M', 'M', 'M'],
    summary: 'Muted eighths with an open accent on beats 1 and 3. Tight, heavy and driving.',
    details: 'Rest the edge of your picking hand on the strings near the bridge for the muted notes and lift it for the accented downstrokes on 1 and 3. Play it on power chords for the classic rock and metal rhythm sound.',
    usedBy: 'Rock, hard rock, punk, metal, pop-punk',
    tip: 'Move the palm closer to the bridge for a tighter chug and further away for a looser sound.',
    tags: ['palm muting','rock','metal','chug','power chords','eighth notes'],
  },
]

export function getStrumPattern(id: string): StrumPattern {
  return STRUM_PATTERNS.find(p => p.id === id) ?? STRUM_PATTERNS[0]
}
