/** Runtime platform checks. Safe to call during SSR (they return false on the server). */

interface CapacitorGlobal {
  isNativePlatform?: () => boolean
  getPlatform?: () => string
}

function capacitor(): CapacitorGlobal | undefined {
  return typeof window === 'undefined' ? undefined : (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor
}

/** True when running inside the Capacitor native shell (Android or iOS app). */
export function isNativeApp(): boolean {
  return capacitor()?.isNativePlatform?.() === true
}

/** True when launched from the home screen as an installed PWA. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

export type DevicePlatform = 'android' | 'ios' | 'desktop'

export function detectPlatform(): DevicePlatform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  // iPadOS reports as Mac with touch support.
  if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  return 'desktop'
}
