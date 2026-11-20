'use client'

/** In-tab history of visited pages, kept in sessionStorage so "Back" can name the real previous page. */
const KEY = 'gcs-history'
export const HISTORY_EVENT = 'gcs-history-change'

export interface VisitedPage {
  path: string
  title: string
}

export function readHistory(): VisitedPage[] {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(KEY) ?? '[]')
    return Array.isArray(value) ? (value as VisitedPage[]) : []
  } catch {
    return []
  }
}

export function writeHistory(pages: VisitedPage[]) {
  try { sessionStorage.setItem(KEY, JSON.stringify(pages.slice(-30))) } catch { /* storage may be blocked */ }
  window.dispatchEvent(new Event(HISTORY_EVENT))
}

/** "Major Scale (Guitar Scales, All 12 Keys) | Guitar Cheat Sheet" becomes "Major Scale". */
export function shortTitle(title: string): string {
  return title.split(' | ')[0].split(' (')[0].split(': ')[0].trim() || 'previous page'
}
