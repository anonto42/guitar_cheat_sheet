'use client'

import { useEffect } from 'react'
import { isNativeApp } from '@/lib/platform'

/**
 * Wires the web app into the Capacitor shell: status bar colour, splash screen and the
 * Android back button. Does nothing in a normal browser. Renders nothing.
 */
export default function NativeBootstrap() {
  useEffect(() => {
    if (!isNativeApp()) return
    let removeBackListener: (() => void) | undefined

    ;(async () => {
      const [{ StatusBar, Style }, { SplashScreen }, { App }] = await Promise.all([
        import('@capacitor/status-bar'),
        import('@capacitor/splash-screen'),
        import('@capacitor/app'),
      ])
      await StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
      await StatusBar.setBackgroundColor({ color: '#0d0b08' }).catch(() => {})
      await SplashScreen.hide().catch(() => {})

      const handle = await App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) window.history.back()
        else App.exitApp()
      })
      removeBackListener = () => { handle.remove() }
    })()

    return () => removeBackListener?.()
  }, [])

  return null
}
