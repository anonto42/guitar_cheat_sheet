'use client'

import { useState } from 'react'
import { Download, Share, SquarePlus } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { DevicePlatform } from '@/lib/platform'

interface InstallActionProps {
  platform: DevicePlatform
  /** The browser has handed over its install prompt. */
  canPrompt: boolean
  onInstall: () => Promise<boolean>
}

/**
 * The "Install app" button. When the browser offers its prompt, one click installs the PWA.
 * Otherwise (iOS Safari, or a browser that has not offered it yet) the same click explains
 * the manual steps for that device instead of doing nothing.
 */
export default function InstallAction({ platform, canPrompt, onInstall }: InstallActionProps) {
  const [showHelp, setShowHelp] = useState(false)

  const handleClick = async () => {
    if (canPrompt) {
      const accepted = await onInstall()
      setShowHelp(!accepted)
    } else {
      setShowHelp(true)
    }
  }

  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={handleClick}>
        <Download size={16} aria-hidden="true" /> Install app
      </Button>

      {showHelp && platform === 'ios' && (
        <ol className="space-y-2 text-sm text-cream" aria-live="polite">
          <li className="flex items-center gap-2"><Share size={16} className="text-ember" aria-hidden="true" /> Tap Share in Safari</li>
          <li className="flex items-center gap-2"><SquarePlus size={16} className="text-ember" aria-hidden="true" /> Choose Add to Home Screen</li>
        </ol>
      )}

      {showHelp && platform !== 'ios' && (
        <p className="text-sm leading-relaxed text-outline" aria-live="polite">
          Your browser has not offered installation yet. Use the install icon in the address bar, or open the
          browser menu and choose Install app. Installing works in Chrome, Edge and Samsung Internet on a secure
          connection; open the production site rather than a development server.
        </p>
      )}
    </div>
  )
}
