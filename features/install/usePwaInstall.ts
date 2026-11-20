'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { detectPlatform, type DevicePlatform } from '@/lib/platform'
import { useAppInstalled } from './useAppInstalled'
import { INSTALL_PROMPT_EVENT, INSTALL_PROMPT_KEY } from './installPromptScript'

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
  /** Opens the browser's install dialog. Resolves to false when no prompt is available. */
  promptInstall: () => Promise<boolean>
}

const subscribeNoop = () => () => {}

function readPrompt(): BeforeInstallPromptEvent | null {
  return (window as unknown as Record<string, BeforeInstallPromptEvent | null | undefined>)[INSTALL_PROMPT_KEY] ?? null
}

function subscribePrompt(onChange: () => void) {
  window.addEventListener(INSTALL_PROMPT_EVENT, onChange)
  return () => window.removeEventListener(INSTALL_PROMPT_EVENT, onChange)
}

/**
 * Install state for the PWA. The browser's prompt event is captured by an inline script in the
 * root layout (see installPromptScript.ts) so it is never missed, then used here on demand.
 */
export function usePwaInstall(): PwaInstallState {
  const platform = useSyncExternalStore<DevicePlatform>(subscribeNoop, detectPlatform, () => 'desktop')
  const alreadyInstalled = useAppInstalled()
  const prompt = useSyncExternalStore(subscribePrompt, readPrompt, () => null)
  const [justInstalled, setJustInstalled] = useState(false)

  useEffect(() => {
    const onInstalled = () => setJustInstalled(true)
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  const promptInstall = useCallback(async () => {
    const event = readPrompt()
    if (!event) return false
    await event.prompt()
    const { outcome } = await event.userChoice
    // A prompt can only be used once; the browser fires a new event if it is dismissed.
    ;(window as unknown as Record<string, unknown>)[INSTALL_PROMPT_KEY] = null
    window.dispatchEvent(new Event(INSTALL_PROMPT_EVENT))
    if (outcome === 'accepted') setJustInstalled(true)
    return outcome === 'accepted'
  }, [])

  return { platform, installed: alreadyInstalled || justInstalled, canPrompt: prompt !== null, promptInstall }
}
