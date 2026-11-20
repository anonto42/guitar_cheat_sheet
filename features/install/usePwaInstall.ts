'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { detectPlatform, type DevicePlatform } from '@/lib/platform'
import { useAppInstalled } from './useAppInstalled'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface PwaInstallState {
  platform: DevicePlatform
  /** The app is already running installed (PWA) or as a native build. */
  installed: boolean
  /** The browser offered a one-tap install prompt. */
  canPrompt: boolean
  promptInstall: () => Promise<void>
}

const subscribe = () => () => {}

/** Captures the browser's install prompt so a button of our own can trigger it. */
export function usePwaInstall(): PwaInstallState {
  const platform = useSyncExternalStore<DevicePlatform>(subscribe, detectPlatform, () => 'desktop')
  const alreadyInstalled = useAppInstalled()
  const [justInstalled, setJustInstalled] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => { setJustInstalled(true); setDeferred(null) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') setJustInstalled(true)
    setDeferred(null)
  }, [deferred])

  return { platform, installed: alreadyInstalled || justInstalled, canPrompt: deferred !== null, promptInstall }
}
