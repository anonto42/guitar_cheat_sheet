import { DATA } from '@/data'
import { CATEGORY_CONFIG, isCategorySlug } from '@/data/categories'
import { LEARN_STEPS } from '@/data/learn'
import type { CategorySlug, GuitarEntry, LearnStep } from '@/types'
import type { CategorySummary, ContentRepository, SearchIndexItem } from './types'

function summarise(slug: CategorySlug): CategorySummary {
  return { slug, ...CATEGORY_CONFIG[slug], count: DATA.filter(e => e.category === slug).length }
}

/** Reads content from the static files in `data/`. */
export const staticRepository: ContentRepository = {
  async listEntries(filter) {
    return filter?.category ? DATA.filter(e => e.category === filter.category) : DATA
  },

  async getEntry(category, id) {
    return DATA.find(e => e.category === category && e.id === id) ?? null
  },

  async listCategories() {
    return (Object.keys(CATEGORY_CONFIG) as CategorySlug[]).map(summarise)
  },

  async getCategory(slug) {
    return isCategorySlug(slug) ? summarise(slug) : null
  },

  async getSearchIndex(): Promise<SearchIndexItem[]> {
    return DATA.map(({ id, category, title, summary, tags }) => ({ id, category, title, summary, tags }))
  },

  async getLearningPath(): Promise<LearnStep[]> {
    return LEARN_STEPS.map(({ entries, ...step }, i) => ({
      ...step,
      number: i + 1,
      entries: entries
        .map(ref => {
          const [category, id] = ref.split('/')
          return DATA.find(e => e.category === category && e.id === id)
        })
        .filter((e): e is GuitarEntry => e !== undefined),
    }))
  },
}
