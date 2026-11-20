import { Download, Smartphone, WifiOff, Zap } from 'lucide-react'
import LogoMark from '@/components/brand/LogoMark'
import Button from '@/components/ui/Button'
import CtaPanel from '@/components/ui/CtaPanel'
import IconList from '@/components/ui/IconList'

const PERKS = [
  { icon: WifiOff, text: 'Every page works offline' },
  { icon: Zap, text: 'Opens instantly from your home screen' },
  { icon: Smartphone, text: 'Built for phones and tablets' },
]

/** Call to action that sends visitors to the /download page. */
export default function AppPromo() {
  return (
    <CtaPanel
      id="app-promo"
      title="Take it to rehearsal"
      description="Install Guitar Cheat Sheet on your phone and keep the whole reference in your pocket, even with no signal."
      decoration={<LogoMark size={260} className="pointer-events-none absolute -right-12 -top-10 opacity-[.07]" />}
      action={
        <Button href="/download" size="lg" className="w-full sm:w-auto">
          <Download size={16} aria-hidden="true" /> Get the app
        </Button>
      }
    >
      <IconList items={PERKS} />
    </CtaPanel>
  )
}
