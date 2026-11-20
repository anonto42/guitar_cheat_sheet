import type { CapacitorConfig } from '@capacitor/cli'
import { APP } from './config/app'

const config: CapacitorConfig = {
  appId: APP.id,
  appName: APP.name,
  // Output of `npm run build:mobile` (Next.js static export).
  webDir: 'out',
  backgroundColor: '#0d0b08',
  server: { androidScheme: 'https' },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: false, // hidden by features/install/NativeBootstrap once the UI is ready
      backgroundColor: '#0d0b08',
      showSpinner: false,
    },
    StatusBar: { style: 'DARK', backgroundColor: '#0d0b08' },
  },
}

export default config
