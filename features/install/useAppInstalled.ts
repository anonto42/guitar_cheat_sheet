'use client'

import { useSyncExternalStore } from 'react'
import { isNativeApp, isStandalone } from '@/lib/platform'

const subscribe = () => () => {}

/** True when the site is running as an installed PWA or inside the native app. False during SSR. */
export function useAppInstalled(): boolean {
  return useSyncExternalStore(subscribe, () => isStandalone() || isNativeApp(), () => false)
}
