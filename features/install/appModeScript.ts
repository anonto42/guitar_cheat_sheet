/**
 * Inline script that runs before the page draws. When the site runs as an app (inside the
 * Capacitor shell, or launched from the home screen as an installed PWA) it sets
 * `data-app` on <html>, so the `app:` Tailwind variant can switch to the app layout with no flicker.
 */
import { APP } from '@/config/app'

export const appModeScript = `
(function () {
  try {
    var c = window.Capacitor;
    var native = navigator.userAgent.indexOf('${APP.userAgentTag}') !== -1 || !!(c && c.isNativePlatform && c.isNativePlatform());
    var standalone = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    if (native || standalone) document.documentElement.setAttribute('data-app', native ? 'native' : 'standalone');
  } catch (e) {}
})();
`
