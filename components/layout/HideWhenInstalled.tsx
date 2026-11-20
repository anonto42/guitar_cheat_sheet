'use client'

import { useAppInstalled } from '@/features/install/useAppInstalled'

/** Hides "get the app" prompts for people who already have it. */
export default function HideWhenInstalled({ children }: { children: React.ReactNode }) {
  return useAppInstalled() ? null : <>{children}</>
}
