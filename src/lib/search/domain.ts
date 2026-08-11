import type { Category, Product } from "@prisma/client"

/**
 * How the search service should weight results.
 * - `hybrid`: blend keyword + semantic relevance
 * - `keyword`: lexical/string matching only
 * - `semantic`: vector similarity only
 */
export type SearchMode = "hybrid" | "keyword" | "semantic"

/** Supported result sort orders. */
export type SearchSort =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest"

/** Business filters applied *after* relevance ranking. */
export type SearchFilters = {
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  /** Only include products with stock > 0. */
  availableOnly?: boolean
}

export type SearchQuery = {
  q: string
  mode: SearchMode
  sort: SearchSort
  filters: SearchFilters
  page: number
  pageSize: number
}

/** A product surfaced by the search service, with its relevance scores. */
export type SearchResult = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  brand: string | null
  price: number
  compareAtPrice: number | null
  unit: string
  unitAmount: number
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  /** Normalized keyword relevance (0–1). */
  keywordScore: number
  /** Normalized semantic similarity (0–1), `null` when vector search was skipped. */
  semanticScore: number | null
  /** Final hybrid score (0–1). */
  score: number
}

export type SearchResponse = {
  query: SearchQuery
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type SortOption = {
  value: SearchSort
  label: string
}

/** Mapping of a Prisma product row (with category) to the search result shape. */
export type ProductWithCategory = Product & {
  category: Category
}

export type SemanticSearchOptions = {
  limit?: number
  /** Only return results at least this similar (cosine similarity, 0–1). */
  minSimilarity?: number
  /** Only return products that are in stock. Defaults to true. */
  availableOnly?: boolean
}

export type ProductMatch = {
  id: string
  similarity: number
}

export type RecipeMatch = {
  id: string
  similarity: number
}