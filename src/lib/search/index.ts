export {
  type ProductMatch,
  type ProductWithCategory,
  type RecipeMatch,
  type SearchFilters,
  type SearchMode,
  type SearchQuery,
  type SearchResponse,
  type SearchResult,
  type SearchSort,
  type SemanticSearchOptions,
  type SortOption,
} from "@/lib/search/domain"
export {
  clampPagination,
  searchQuerySchema,
  SEARCH_SORT_OPTIONS,
  type SearchQueryInput,
  type SearchQueryParsed,
} from "@/lib/search/validation"
export {
  clampScore,
  combineScores,
  DEFAULT_RANKING_WEIGHTS,
  normalizeKeywordScore,
  type RankingWeights,
} from "@/lib/search/ranking"
export { toSearchResult } from "@/lib/search/utils"
export { searchProducts } from "@/lib/search/service"
export { embedManyTexts, embedText } from "@/lib/search/embedding"
export { indexEmbeddings } from "@/lib/search/indexer"
export {
  searchProductsByVector,
  searchRecipesByVector,
} from "@/lib/search/search"
export { buildProductDocument, buildRecipeDocument } from "@/lib/search/text"
export { toVectorLiteral, vectorToArray } from "@/lib/search/vector"