'use client'

import { Download, Play, Trash2 } from 'lucide-react'
import type { Take } from './useRecorder'
import Panel from '@/components/ui/Panel'

interface RecorderProps {
  takes: Take[]
  error: string | null
  onRemove: (id: string) => void
  onPlayWithBacking: (take: Take, audio: HTMLAudioElement | null) => void
}

const extension = (mime: string) => (mime.includes('ogg') ? 'ogg' : mime.includes('mp4') ? 'm4a' : 'webm')

/** Your recorded takes for this visit. Nothing is uploaded; download a take to keep it. */
export default function Recorder({ takes, error, onRemove, onPlayWithBacking }: RecorderProps) {
  return (
    <Panel aria-label="Recordings" className="space-y-5">
      <div>
        <h2 className="font-display text-lg font-bold text-cream">Your recordings</h2>
        <p className="mt-1 text-sm text-muted">Press Record in the top bar. The backing starts with a count-in and your microphone records you playing along. Use headphones so the backing does not leak into the recording.</p>
      </div>
      {error && <p role="alert" className="text-sm text-tunings">{error}</p>}
      {takes.length === 0 ? (
        <p className="text-sm text-outline">No recordings yet.</p>
      ) : (
        <ol className="space-y-3">
          {takes.map(take => (
            <li key={take.id} className="flex flex-wrap items-center gap-3 border border-line2 bg-bg3/60 p-3">
              <div className="min-w-[8rem]">
                <p className="font-bold text-cream">{take.name}</p>
                <p className="text-xs text-outline">{take.duration.toFixed(1)} s at {take.bpm} BPM</p>
              </div>
              <audio id={`take-${take.id}`} controls src={take.url} className="h-9 min-w-0 flex-1" />
              <button type="button" onClick={() => onPlayWithBacking(take, document.getElementById(`take-${take.id}`) as HTMLAudioElement | null)} className="flex h-9 items-center gap-1.5 border border-line2 px-3 text-xs font-semibold text-outline hover:text-cream">
                <Play size={12} aria-hidden="true" /> With backing
              </button>
              <a href={take.url} download={`${take.name}.${extension(take.mimeType)}`} className="flex h-9 items-center gap-1.5 border border-line2 px-3 text-xs font-semibold text-outline hover:text-cream">
                <Download size={12} aria-hidden="true" /> Download
              </a>
              <button type="button" aria-label={`Delete ${take.name}`} onClick={() => onRemove(take.id)} className="flex h-9 w-9 items-center justify-center border border-line2 text-outline hover:text-tunings">
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
