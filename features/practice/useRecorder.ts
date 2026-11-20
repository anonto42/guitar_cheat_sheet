'use client'

import { useEffect, useRef, useState } from 'react'

export interface Take {
  id: string
  name: string
  url: string
  /** Seconds. */
  duration: number
  bpm: number
  mimeType: string
}

/**
 * Records the microphone with MediaRecorder. Takes stay in memory for this visit only and are
 * never uploaded; use Download to keep one.
 */
export function useRecorder() {
  const [takes, setTakes] = useState<Take[]>([])
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const session = useRef<{ recorder: MediaRecorder; stream: MediaStream; started: number; bpm: number } | null>(null)
  const urls = useRef<string[]>([])

  useEffect(() => () => {
    session.current?.stream.getTracks().forEach(t => t.stop())
    urls.current.forEach(u => URL.revokeObjectURL(u))
  }, [])

  const start = async (bpm: number): Promise<boolean> => {
    setError(null)
    if (typeof MediaRecorder === 'undefined') {
      setError('Recording is not supported in this browser.')
      return false
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
      recorder.onstop = () => {
        const s = session.current
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' })
        const url = URL.createObjectURL(blob)
        urls.current.push(url)
        setTakes(list => [
          ...list,
          {
            id: crypto.randomUUID(),
            name: `Take ${list.length + 1}`,
            url,
            duration: s ? (performance.now() - s.started) / 1000 : 0,
            bpm: s?.bpm ?? bpm,
            mimeType: blob.type,
          },
        ])
        session.current = null
      }
      recorder.start()
      session.current = { recorder, stream, started: performance.now(), bpm }
      setRecording(true)
      return true
    } catch (err) {
      const denied = err instanceof DOMException && err.name === 'NotAllowedError'
      setError(denied ? 'Microphone access was blocked. Allow it in your browser settings to record.' : 'Could not open the microphone.')
      return false
    }
  }

  const stop = () => {
    session.current?.recorder.stop()
    setRecording(false)
  }

  const remove = (id: string) => setTakes(list => list.filter(t => t.id !== id))

  return { takes, recording, error, start, stop, remove }
}
