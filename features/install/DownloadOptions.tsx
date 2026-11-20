'use client'

import { Apple, CheckCircle2, Download, Globe } from 'lucide-react'
import { APP } from '@/config/app'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { usePwaInstall } from './usePwaInstall'
import InstallAction from './InstallAction'

interface OptionProps {
  icon: React.ReactNode
  title: string
  description: string
  highlighted?: boolean
  children: React.ReactNode
}

function Option({ icon, title, description, highlighted, children }: OptionProps) {
  return (
    <div className={cn('flex flex-col rounded-xl border bg-surface p-5', highlighted ? 'border-ember/50' : 'border-line2')}>
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center text-ember">{icon}</span>
        <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-outline">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  )
}

/** Download page body: store links when configured, browser install everywhere else. */
export default function DownloadOptions() {
  const { platform, installed, canPrompt, promptInstall } = usePwaInstall()
  const { android, ios } = APP

  if (installed) {
    return (
      <div className="space-y-6">
        <p className="flex items-center gap-3 rounded-xl border border-theory/40 bg-theory/10 p-5 text-sm font-semibold text-theory">
          <CheckCircle2 size={20} aria-hidden="true" />
          You are already using the app.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Option
          icon={<Globe size={20} aria-hidden="true" />}
          title="Install from browser"
          description="Adds Guitar Cheat Sheet to your home screen or desktop. No store, no account, and updates arrive automatically."
          highlighted={platform === 'desktop'}
        >
          <InstallAction platform={platform} canPrompt={canPrompt} onInstall={promptInstall} />
        </Option>

        <Option
          icon={<Download size={20} aria-hidden="true" />}
          title="Android"
          description="Native Android build with the full library bundled for offline use."
          highlighted={platform === 'android'}
        >
          {android.playStoreUrl ? (
            <Button href={android.playStoreUrl} className="w-full">Get it on Google Play</Button>
          ) : android.apkUrl ? (
            <Button href={android.apkUrl} className="w-full">Download APK</Button>
          ) : (
            <Button disabled className="w-full">Coming soon</Button>
          )}
        </Option>

        <Option
          icon={<Apple size={20} aria-hidden="true" />}
          title="iPhone and iPad"
          description="Native iOS build with the full library bundled for offline use."
          highlighted={platform === 'ios'}
        >
          {ios.appStoreUrl ? (
            <Button href={ios.appStoreUrl} className="w-full">Download on the App Store</Button>
          ) : (
            <Button disabled className="w-full">Coming soon</Button>
          )}
        </Option>
      </div>

    </div>
  )
}
