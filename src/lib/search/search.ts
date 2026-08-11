import { prisma } from "@/lib/prisma"
import { embedText } from "@/lib/search/embedding"
import type {
  ProductMatch,
  RecipeMatch,
  SemanticSearchOptions,
} from "@/lib/search/domain"
import { toVectorLiteral } from "@/lib/search/vector"

/**
 * Embeds the query and returns product ids ranked by cosine similarity.
 * Missing/empty queries and embedding failures return an empty list rather
 * than throwing, so callers can safely fall back to keyword search.
 */
export async function searchProductsByVector(
  query: string,
  options: SemanticSearchOptions = {},
): Promise<ProductMatch[]> {
  const { limit = 20, minSimilarity = 0 } = options
  const vector = await embedText(query)
  if (!vector) return []

  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; similarity: number }>>`
      SELECT p."id"::text AS "id", 1 - (p."embedding" <=> ${toVectorLiteral(vector)}::vector) AS "similarity"
      FROM "products" p
      WHERE p."embedding" IS NOT NULL
        AND p."isActive" = true
        AND p."stock" > 0
        AND 1 - (p."embedding" <=> ${toVectorLiteral(vector)}::vector) >= ${minSimilarity}
      ORDER BY p."embedding" <=> ${toVectorLiteral(vector)}::vector
      LIMIT ${limit}
    `
    return rows.map((row) => ({ id: row.id, similarity: row.similarity }))
  } catch {
    return []
  }
}

/**
 * Same as {@link searchProductsByVector} but for published recipes.
 */
export async function searchRecipesByVector(
  query: string,
  options: SemanticSearchOptions = {},
): Promise<RecipeMatch[]> {
  const { limit = 20, minSimilarity = 0 } = options
  const vector = await embedText(query)
  if (!vector) return []

  try {
    const rows = await prisma.$queryRaw<Array<{ id: string; similarity: number }>>`
      SELECT r."id"::text AS "id", 1 - (r."embedding" <=> ${toVectorLiteral(vector)}::vector) AS "similarity"
      FROM "recipes" r
      WHERE r."embedding" IS NOT NULL
        AND r."isPublished" = true
        AND 1 - (r."embedding" <=> ${toVectorLiteral(vector)}::vector) >= ${minSimilarity}
      ORDER BY r."embedding" <=> ${toVectorLiteral(vector)}::vector
      LIMIT ${limit}
    `
    return rows.map((row) => ({ id: row.id, similarity: row.similarity }))
  } catch {
    return []
  }
}