import { SITE } from './site'

/**
 * Native app distribution settings.
 * `null` renders a "coming soon" state instead of a broken link.
 */
export const APP = {
  id: 'com.guitarcheatsheet.app',
  name: 'Guitar Cheat Sheet',
  /** Added to the native app's user agent, so pages can tell they run inside the app before they draw. */
  userAgentTag: 'GuitarCheatSheetApp',
  android: {
    playStoreUrl: null as string | null,
    /** Built by .github/workflows/android.yml and attached to every tagged GitHub Release. */
    apkUrl: `${SITE.repoUrl}/releases/latest/download/guitar-cheat-sheet.apk` as string | null,
    releasesUrl: `${SITE.repoUrl}/releases`,
  },
  ios: {
    appStoreUrl: null as string | null,
  },
} as const
