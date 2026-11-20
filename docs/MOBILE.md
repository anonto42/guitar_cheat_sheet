# Mobile apps

Three ways to run the app on a phone, all from the same codebase.

## 1. Installable web app (PWA)
Works today. `app/manifest.ts` and the service worker make the site installable from Chrome, Edge and Safari. The `/download` page shows the install button when the browser offers one, and Add to Home Screen steps on iOS.

## 2. Native shell with Capacitor
The web app is exported as static files and wrapped in a native WebView, with the full library bundled.

One-time setup (needs Android Studio for Android, Xcode on macOS for iOS):
```bash
npm install
npm run build:mobile      # static export into out/
npm run cap:add:android   # creates android/
npm run cap:add:ios       # creates ios/ (macOS only)
```
Day to day:
```bash
npm run cap:sync          # rebuild and copy into the native projects
npm run cap:open:android  # open Android Studio, then Run
npm run cap:open:ios      # open Xcode, then Run
```
Notes:
- `scripts/build-mobile.mjs` temporarily moves `app/og` aside because image generation needs a server, and restores it afterwards.
- Inside the native app the service worker is not registered (files are already local) and the "Get the app" prompts are hidden.
- `features/install/NativeBootstrap` handles status bar colour, splash screen and the Android back button.
- App id and name live in `config/app.ts`.

## 3. Store links on /download
When the apps are published, set the URLs in `config/app.ts`:
```ts
android: { playStoreUrl: 'https://play.google.com/store/apps/details?id=…', apkUrl: null },
ios: { appStoreUrl: 'https://apps.apple.com/app/…' },
```
Buttons switch from "Coming soon" to real links automatically.

## Icons
Edit `public/favicon.svg`, then run `npm run generate-icons`. For native launcher icons use `@capacitor/assets` with `public/icon-512.png` as the source.
