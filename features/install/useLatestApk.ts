'use client'

import { useEffect, useState } from 'react'

export type ApkStatus =
  | { state: 'checking' }
  | { state: 'ready'; url: string; version: string; sizeMb: number }
  | { state: 'none' }
  /** GitHub could not be reached (offline or rate limited): offer the link anyway. */
  | { state: 'unknown' }

interface ReleaseAsset { name: string; browser_download_url: string; size: number }
interface Release { tag_name: string; assets: ReleaseAsset[] }

/**
 * Looks up the newest GitHub Release and its APK, so the download button never points at a
 * release that does not exist yet. Uses the public GitHub API, which allows browser requests.
 */
export function useLatestApk(repoUrl: string, fileName: string): ApkStatus {
  const [status, setStatus] = useState<ApkStatus>({ state: 'checking' })

  useEffect(() => {
    const repo = new URL(repoUrl).pathname.replace(/^\/|\/$/g, '')
    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${repo}/releases/latest`, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then(async res => {
        if (res.status === 404) return setStatus({ state: 'none' })
        if (!res.ok) return setStatus({ state: 'unknown' })
        const release = (await res.json()) as Release
        const asset = release.assets.find(a => a.name === fileName)
        setStatus(asset
          ? { state: 'ready', url: asset.browser_download_url, version: release.tag_name, sizeMb: asset.size / 1048576 }
          : { state: 'none' })
      })
      .catch(err => { if ((err as Error).name !== 'AbortError') setStatus({ state: 'unknown' }) })
    return () => controller.abort()
  }, [repoUrl, fileName])

  return status
}
