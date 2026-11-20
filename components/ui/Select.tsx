'use client'

import { forwardRef, useId } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
 * shadcn/ui-style select: Radix primitives styled with the site tokens. The primitives are
 * exported for custom layouts; most code should use the default <Select> wrapper below.
 */

export const SelectRoot = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { size?: 'sm' | 'md' }
>(({ className, children, size = 'md', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between gap-2 border border-line3 bg-surface px-3 text-left text-sm font-semibold text-cream transition-colors',
      'hover:border-outline/50 focus-visible:border-ember data-[state=open]:border-ember disabled:cursor-not-allowed disabled:opacity-50',
      '[&>span]:truncate',
      size === 'sm' ? 'h-9' : 'h-[var(--control-h)]',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} className="shrink-0 text-outline transition-transform [[data-state=open]_&]:rotate-180" aria-hidden="true" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        'relative z-[150] max-h-[min(24rem,var(--radix-select-content-available-height))] min-w-[8rem] overflow-hidden border border-line3 bg-bg3 text-cream shadow-2xl shadow-black/60 animate-fade-in',
        position === 'popper' && 'w-max min-w-[var(--radix-select-trigger-width)] max-w-[min(28rem,calc(100vw-2rem))]',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-outline">
        <ChevronUp size={14} aria-hidden="true" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-outline">
        <ChevronDown size={14} aria-hidden="true" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('px-2.5 pb-1 pt-2 text-[0.6rem] font-bold uppercase tracking-widest text-outline', className)} {...props} />
))
SelectLabel.displayName = 'SelectLabel'

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center py-2 pl-2.5 pr-8 text-sm text-muted outline-none',
      'data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-cream data-[state=checked]:font-semibold data-[state=checked]:text-ember-l',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-2.5 flex items-center">
      <SelectPrimitive.ItemIndicator><Check size={14} aria-hidden="true" /></SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

// ─── Wrapper ─────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  /** Options with the same group are listed under one heading, in order of first appearance. */
  group?: string
}

interface SelectProps {
  label: string
  /** Keep the label for screen readers only. */
  hideLabel?: boolean
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Form field name; the value is submitted with the form. */
  name?: string
  placeholder?: string
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

/** Radix does not allow "" as an item value, so it is swapped for a token internally. */
const EMPTY = '__empty__'
const encode = (v: string | undefined) => (v === '' ? EMPTY : v)
const decode = (v: string) => (v === EMPTY ? '' : v)

/** Labelled dropdown used across the site. */
export default function Select({
  label, hideLabel, options, value, defaultValue, onChange, name, placeholder, size = 'md', disabled, className,
}: SelectProps) {
  const id = useId()
  const groups: { name?: string; items: SelectOption[] }[] = []
  for (const option of options) {
    const last = groups[groups.length - 1]
    if (last && last.name === option.group) last.items.push(option)
    else groups.push({ name: option.group, items: [option] })
  }

  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-[0.65rem] font-bold uppercase tracking-widest text-outline', hideLabel && 'sr-only')}>{label}</label>
      <SelectRoot value={encode(value)} defaultValue={encode(defaultValue)} onValueChange={v => onChange?.(decode(v))} name={name} disabled={disabled}>
        <SelectTrigger id={id} size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group, i) => (
            <SelectGroup key={group.name ?? `g${i}`}>
              {group.name && <SelectLabel>{group.name}</SelectLabel>}
              {group.items.map(option => (
                <SelectItem key={option.value || EMPTY} value={encode(option.value) ?? EMPTY} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </SelectRoot>
    </div>
  )
}
