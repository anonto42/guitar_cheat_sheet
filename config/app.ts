/**
 * Native app distribution settings.
 * Set a store/download URL to enable the matching button on /download.
 * `null` renders a "coming soon" state instead of a broken link.
 */
export const APP = {
  id: 'com.guitarcheatsheet.app',
  name: 'Guitar Cheat Sheet',
  android: {
    playStoreUrl: null as string | null,
    apkUrl: null as string | null,
  },
  ios: {
    appStoreUrl: null as string | null,
  },
} as const
