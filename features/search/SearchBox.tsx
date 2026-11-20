'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Search, X } from 'lucide-react'
import { CATEGORY_CONFIG } from '@/data/categories'
import { cn } from '@/lib/utils'
import { searchItems } from '@/lib/search'
import { useSearchIndex } from './useSearchIndex'

interface SearchBoxProps {
  className?: string
  autoFocus?: boolean
  /** Called after the user navigates to a result (used to close overlays). */
  onNavigate?: () => void
  placeholder?: string
}

/** Search input with a live results popover. Keyboard: arrows, Enter and Escape. */
export default function SearchBox({
  className, autoFocus, onNavigate, placeholder = 'Search scales, chords, techniques',
}: SearchBoxProps) {
  const router = useRouter()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(0)
  const { items, status } = useSearchIndex(focused)

  const results = useMemo(() => searchItems(items, query, 8), [items, query])
  const open = focused && query.trim().length > 0

  // Close the popover on outside click.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  const go = useCallback((href: string) => {
    setFocused(false)
    setQuery('')
    inputRef.current?.blur()
    router.push(href)
    onNavigate?.()
  }, [router, onNavigate])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (query) setQuery('')
      else inputRef.current?.blur()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = results[active]
      if (hit) go(`/${hit.category}/${hit.id}`)
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex h-10 items-center gap-2 rounded-lg border bg-surface px-3 transition-colors',
          focused ? 'border-ember/60 bg-bg3' : 'border-line2 hover:border-line3',
        )}
      >
        <Search size={16} className={focused ? 'text-ember' : 'text-outline'} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          aria-label="Search the reference"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={query}
          placeholder={placeholder}
          onChange={e => { setQuery(e.target.value); setActive(0) }}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 appearance-none bg-transparent outline-none focus-visible:outline-none text-sm text-cream placeholder:text-outline/60 [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-outline hover:text-cream"
          >
            <X size={12} />
          </button>
        ) : null}
      </div>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-lg border border-line2 bg-bg3 p-1.5 shadow-2xl shadow-black/60 animate-fade-in sm:min-w-[22rem]"
        >
          {status === 'loading' && <p className="px-3 py-4 text-sm text-outline">Loading index…</p>}
          {status === 'error' && <p className="px-3 py-4 text-sm text-outline">Search is unavailable right now. Check your connection and try again.</p>}
          {status === 'ready' && results.length === 0 && (
            <p className="px-3 py-4 text-sm text-outline">No matches for &ldquo;{query.trim()}&rdquo;.</p>
          )}
          {results.map((hit, i) => {
            const cat = CATEGORY_CONFIG[hit.category]
            return (
              <button
                key={`${hit.category}/${hit.id}`}
                id={`${listId}-${i}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(`/${hit.category}/${hit.id}`)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors',
                  i === active ? 'bg-white/[0.06]' : 'bg-transparent',
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-cream">{hit.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-outline">
                    <span className="font-semibold" style={{ color: cat.a }}>{cat.label}</span>
                    <span className="mx-1.5 opacity-50" aria-hidden="true">&middot;</span>
                    {hit.summary}
                  </span>
                </span>
                {i === active && <CornerDownLeft size={14} className="shrink-0 text-outline" aria-hidden="true" />}
              </button>
            )
          })}
          {status === 'ready' && results.length > 0 && (
            <button
              type="button"
              onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
              className="mt-1 w-full rounded-md border-t border-line px-3 py-2.5 text-left text-xs font-semibold text-ember-l hover:bg-white/[0.04]"
            >
              See all results for &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  )
}
