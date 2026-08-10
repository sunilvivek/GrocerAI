export { embedManyTexts, embedText } from "@/lib/search/embedding"
export { indexEmbeddings } from "@/lib/search/indexer"
export {
  searchProductsByVector,
  searchRecipesByVector,
  type ProductMatch,
  type RecipeMatch,
  type SemanticSearchOptions,
} from "@/lib/search/search"
export { buildProductDocument, buildRecipeDocument } from "@/lib/search/text"
export { toVectorLiteral, vectorToArray } from "@/lib/search/vector"