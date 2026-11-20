import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ember text-bg2 hover:bg-ember-l',
        secondary: 'border border-line3 bg-transparent text-cream hover:border-ember/60 hover:text-ember-l',
        ghost: 'text-outline hover:bg-white/5 hover:text-cream',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonAsButton = ButtonVariants & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLink = ButtonVariants & Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }

export type ButtonProps = ButtonAsButton | ButtonAsLink

/** One button for the whole site. Passing `href` renders a Next.js link with identical styling. */
export default function Button(props: ButtonProps) {
  if ('href' in props && props.href !== undefined) {
    const { variant, size, className, href, ...rest } = props
    return <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...rest} />
  }
  const { variant, size, className, type = 'button', ...rest } = props as ButtonAsButton
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...rest} />
}

export { buttonVariants }
