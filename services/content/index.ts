import { staticRepository } from './staticRepository'

export type { CategorySummary, ContentRepository, SearchIndexItem } from './types'

/** The active content source. Swap this single line to move to a backend. */
export const content = staticRepository
