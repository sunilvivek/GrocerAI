import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { SearchQuery } from "@/lib/search/domain"
import { clampScore, normalizeKeywordScore } from "@/lib/search/ranking"

/**
 * Maximum raw keyword relevance a product can reach. Used to normalize
 * keyword scores into the 0–1 range (one point per matched field).
 */
const KEYWORD_FIELDS = 4

/** Sort orderings for non-relevance sorts, shared by search paths. */
export const KEYWORD_ORDER: Record<
  Exclude<SearchQuery["sort"], "relevance">,
  Prisma.ProductOrderByWithRelationInput
> = {
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  rating: { rating: "desc" },
  newest: { createdAt: "desc" },
}

/** Builds the Prisma filter combining the query terms and business filters. */
export function buildKeywordWhere(
  q: string,
  filters: SearchQuery["filters"],
): Prisma.ProductWhereInput {
  return {
    isActive: true,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
    ...(filters.categorySlug
      ? { category: { slug: filters.categorySlug } }
      : {}),
    ...(filters.minPrice !== undefined
      ? { price: { gte: filters.minPrice } }
      : {}),
    ...(filters.maxPrice !== undefined
      ? { price: { lte: filters.maxPrice } }
      : {}),
    ...(filters.availableOnly ? { stock: { gt: 0 } } : {}),
  }
}

/** Counts how many keyword fields a product matches (0–4). */
function keywordHits(
  q: string,
  product: {
    name: string
    description: string | null
    brand: string | null
    categoryName: string
  },
): number {
  const needle = q.toLowerCase()
  let hits = 0
  if (product.name.toLowerCase().includes(needle)) hits += 1
  if (product.description?.toLowerCase().includes(needle)) hits += 1
  if (product.brand?.toLowerCase().includes(needle)) hits += 1
  if (product.categoryName.toLowerCase().includes(needle)) hits += 1
  return hits
}

export type KeywordMatch = {
  productId: string
  keywordScore: number
}

/**
 * Runs a keyword search: rows matching the query across name, description,
 * brand, or category are fetched and scored by how many fields matched.
 * When `q` is empty this degrades to a filter/sort-only listing.
 */
export async function keywordSearch(
  query: SearchQuery,
): Promise<KeywordMatch[]> {
  const where = buildKeywordWhere(query.q, query.filters)
  const orderBy =
    query.sort === "relevance" ? { name: "asc" as const } : KEYWORD_ORDER[query.sort]

  const rows = await prisma.product.findMany({
    where,
    orderBy,
    take: query.pageSize * 4,
    select: {
      id: true,
      name: true,
      description: true,
      brand: true,
      category: { select: { name: true } },
    },
  })

  const needle = query.q.toLowerCase()
  const relevanceRows = query.q
    ? rows.filter(
        (row) =>
          row.name.toLowerCase().includes(needle) ||
          row.description?.toLowerCase().includes(needle) ||
          row.brand?.toLowerCase().includes(needle) ||
          row.category.name.toLowerCase().includes(needle),
      )
    : rows

  return relevanceRows.map((row) => ({
    productId: row.id,
    keywordScore: clampScore(
      normalizeKeywordScore(
        keywordHits(query.q, {
          name: row.name,
          description: row.description,
          brand: row.brand,
          categoryName: row.category.name,
        }),
        KEYWORD_FIELDS,
      ),
    ),
  }))
}