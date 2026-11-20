/**
 * Plain-English explanations shown at the top of entry pages, keyed by `category/id`.
 * Rules: short sentences, common words, one idea per sentence. Written for players who are
 * still learning English as well as guitar.
 */
export const SIMPLE_WORDS: Record<string, string> = {
  // Solos
  'solos/pentatonic-minor-solo': 'This is the easiest scale for solos. It has only 5 notes, so almost every note sounds good. Start in E, where many notes are open strings. Play a few notes, stop, then play again.',
  'solos/blues-scale-solo': 'This is the minor pentatonic with one extra note, the blue note. The blue note sounds sad and crying. Do not stay on it. Slide through it to the next note.',
  'solos/major-pentatonic-solo': 'Five happy notes. Use them over major chords for a bright country or pop sound. It is the same shape as the minor pentatonic, three frets lower.',
  'solos/natural-minor-solo': 'Seven notes with a dark, serious sound. It is the minor pentatonic plus two notes. Use it over minor songs in rock and metal.',
  'solos/dorian-solo': 'A minor scale that sounds a little happier. Only one note is different from natural minor. Santana and many jazz players use it.',
  'solos/mixolydian-solo': 'A major scale with one lower note at the top. It sounds bluesy and rock. Use it over dominant 7th chords like E7 or A7.',
  'solos/harmonic-minor-solo': 'A minor scale with one raised note near the top. It sounds exotic, like Middle Eastern or classical music. Neo-classical metal uses it a lot.',
  'solos/diminished-solo': 'A strange, tense scale that repeats every 3 frets. Use it for short moments of tension, then return to a normal scale.',
  'solos/whole-tone-solo': 'Every note is 2 frets from the next. It sounds dreamy and floating, like a movie dream scene. Use it for short moments only.',
  'solos/major-scale-solo': 'The seven notes of a major key. It sounds bright and happy. Learn it after the major pentatonic and add the two extra notes slowly.',
  'solos/rhythm-for-solos': 'Rhythm means when you play each note. Count the beat 1 2 3 4. Then play 1, 2, 3 or 4 equal notes inside each beat. Three notes per beat is called a triplet.',
  'solos/solo-construction': 'A good solo is like a short story. Start simple, grow bigger in the middle, and end on a strong note. Leave short silences so the music can breathe.',
  'solos/note-timing-solo': 'How long you hold each note matters. Long notes sound emotional. Short notes sound exciting. Use both in every solo.',
  'solos/call-response-phrasing': 'Play a short idea, like a question. Wait a moment. Then play an answer that is a little different. This makes your solo sound like talking.',

  // Theory
  'theory/circle-of-fifths': 'A circle of all 12 keys. Keys next to each other share most of their notes. Moving one step clockwise adds one sharp.',
  'theory/intervals': 'An interval is the distance between two notes. On guitar, each fret is one step called a semitone. Count frets to find the interval.',
  'theory/caged-system': 'You can play any chord in five places on the neck. The five shapes come from the open C, A, G, E and D chords.',
  'theory/relative-keys': 'Every major key has a minor key with the same notes. C major and A minor use the same notes. Only the home note is different.',
  'theory/transposing': 'Transposing means moving a song to another key. A capo does it for you: put it on a fret and play the same shapes.',
  'theory/nashville-number': 'Instead of chord names, write numbers 1 to 7. The numbers work in any key. 1 4 5 in C is C F G. In G it is G C D.',
  'theory/chord-inversions': 'An inversion is the same chord with a different lowest note. C, C/E and C/G all have the notes C E G.',
  'theory/chord-construction': 'Take a scale. Pick a note, skip one, pick one, skip one, pick one. Those three notes are a chord.',
  'theory/voice-leading': 'When you change chords, move your fingers as little as possible. Keep the notes that two chords share.',
  'theory/modes-explained': 'A mode is a scale that starts on a different note of the same key. Same notes, different home, different feeling.',
  'theory/pentatonic-positions': 'The pentatonic scale has 5 hand shapes. Together they cover the whole neck. Learn one, then connect it to the next.',
  'theory/diatonic-harmony': 'Every key has 7 chords made only from its notes. In every major key the order is major, minor, minor, major, major, minor, diminished.',
  'theory/secondary-dominants': 'A borrowed chord that pulls strongly to another chord in the key. It adds surprise and color.',
  'theory/chord-types': 'Every chord starts from a three-note triad. Change one note or add one note and you get a new chord type.',

  // Strumming
  'strumming/down-strums': 'Strum down once on every beat: 1 2 3 4. Keep your hand moving between strums.',
  'strumming/folk-strum': 'Down, down up, up down up. Your hand always moves down and up. Sometimes it misses the strings on purpose.',
  'strumming/pop-eighths': 'Down up down up, eight times per bar. Down on the numbers, up on the "and".',
}
