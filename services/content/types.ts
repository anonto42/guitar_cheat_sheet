import type { CategoryConfig, CategorySlug, GuitarEntry, LearnStep } from '@/types'

/** Lightweight record used for client-side search. Keep it small: it is downloaded by the browser. */
export interface SearchIndexItem {
  id: string
  category: CategorySlug
  title: string
  summary: string
  tags: string[]
}

export interface CategorySummary extends CategoryConfig {
  slug: CategorySlug
  count: number
}

/**
 * Content access contract.
 *
 * Today it is implemented on top of static files in `data/`. To move to a
 * backend or database, write another implementation of this interface
 * (for example `apiRepository.ts`) and swap it in `services/content/index.ts`.
 * No component or page needs to change.
 */
export interface ContentRepository {
  listEntries(filter?: { category?: CategorySlug }): Promise<GuitarEntry[]>
  getEntry(category: string, id: string): Promise<GuitarEntry | null>
  listCategories(): Promise<CategorySummary[]>
  getCategory(slug: string): Promise<CategorySummary | null>
  getSearchIndex(): Promise<SearchIndexItem[]>
  getLearningPath(): Promise<LearnStep[]>
}
