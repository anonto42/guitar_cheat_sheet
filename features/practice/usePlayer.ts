'use client'

import { useEffect, useRef, useState } from 'react'
import { PracticeEngine, type PlaybackConfig, type PlaybackPosition, type StartOptions } from '@/lib/music/audio'

/**
 * React wrapper around the practice engine. The engine reads the latest config on every tick,
 * so changing tempo, chords or instrument applies while it plays.
 */
export function usePlayer(config: PlaybackConfig) {
  const configRef = useRef(config)
  const engine = useRef<PracticeEngine | null>(null)
  const [position, setPosition] = useState<PlaybackPosition | null>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { configRef.current = config }, [config])

  useEffect(() => {
    engine.current = new PracticeEngine(() => configRef.current, setPosition)
    return () => engine.current?.stop()
  }, [])

  const start = async (options: StartOptions = {}) => {
    const current = engine.current
    if (!current || current.running) return
    try {
      setError(null)
      await current.start({ ...options, onEnd: () => { setPlaying(false); options.onEnd?.() } })
      setPlaying(true)
    } catch {
      setError('Audio could not start in this browser.')
    }
  }

  const stop = () => {
    engine.current?.stop()
    setPlaying(false)
  }

  return { position, playing, error, start, stop, engine }
}
