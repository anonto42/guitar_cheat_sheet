'use client'

import { Apple, CheckCircle2, Download, Globe } from 'lucide-react'
import { APP } from '@/config/app'
import Button, { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { usePwaInstall } from './usePwaInstall'
import { useLatestApk, type ApkStatus } from './useLatestApk'
import { SITE } from '@/config/site'
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
  const apk = useLatestApk(SITE.repoUrl, 'guitar-cheat-sheet.apk')
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
            <AndroidDownload apkUrl={android.apkUrl} releasesUrl={android.releasesUrl} status={apk} />
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

function AndroidDownload({ apkUrl, releasesUrl, status }: { apkUrl: string; releasesUrl: string; status: ApkStatus }) {
  if (status.state === 'checking') return <Button disabled className="w-full">Checking for the latest version…</Button>
  if (status.state === 'none') {
    return (
      <div className="space-y-2">
        <Button disabled className="w-full">Coming soon</Button>
        <p className="text-xs text-outline">The first Android release is being prepared. Install from the browser for now.</p>
      </div>
    )
  }
  const url = status.state === 'ready' ? status.url : apkUrl
  return (
    <div className="space-y-3">
      {/* A plain link: the file is served by GitHub Releases, not by this site. */}
      <a href={url} download className={cn(buttonVariants({ size: 'md' }), 'w-full')}>
        <Download size={16} aria-hidden="true" /> Download APK
        {status.state === 'ready' && <span className="font-normal opacity-80">({status.version}, {status.sizeMb.toFixed(1)} MB)</span>}
      </a>
      <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed text-outline">
        <li>Open the downloaded file.</li>
        <li>If Android asks, allow installing apps from your browser.</li>
        <li>Tap Install. Works on Android 7 and newer.</li>
      </ol>
      <a href={releasesUrl} className="inline-block text-xs font-semibold text-ember-l hover:text-cream" target="_blank" rel="noopener noreferrer">
        All versions and release notes
      </a>
    </div>
  )
}
