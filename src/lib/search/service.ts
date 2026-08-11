import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type {
  ProductMatch,
  SearchQuery,
  SearchResponse,
} from "@/lib/search/domain"
import {
  clampScore,
  combineScores,
  normalizeKeywordScore,
} from "@/lib/search/ranking"
import { searchProductsByVector } from "@/lib/search/search"
import { toSearchResult } from "@/lib/search/utils"

/**
 * Maximum raw keyword relevance a product can reach. Used to normalize
 * keyword scores into the 0–1 range (one point per matched field).
 */
const KEYWORD_FIELDS = 4

/**
 * Minimum cosine similarity for a *semantic-only* candidate to be considered
 * relevant. Keyword matches are always kept — this only trims vector results
 * that would otherwise flood the list with unrelated products.
 */
const MIN_SEMANTIC_SIMILARITY = 0.25

const KEYWORD_ORDER: Record<
  Exclude<SearchQuery["sort"], "relevance">,
  Prisma.ProductOrderByWithRelationInput
> = {
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  rating: { rating: "desc" },
  newest: { createdAt: "desc" },
}

function buildKeywordWhere(
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
function keywordHits(q: string, product: { name: string; description: string | null; brand: string | null; categoryName: string }): number {
  const needle = q.toLowerCase()
  let hits = 0
  if (product.name.toLowerCase().includes(needle)) hits += 1
  if (product.description?.toLowerCase().includes(needle)) hits += 1
  if (product.brand?.toLowerCase().includes(needle)) hits += 1
  if (product.categoryName.toLowerCase().includes(needle)) hits += 1
  return hits
}

/**
 * Runs a keyword-only search: rows are fetched with Prisma's `contains` query
 * and sorted by the requested order, then scored by how many fields matched.
 */
async function keywordSearch(
  query: SearchQuery,
): Promise<Array<{ productId: string; keywordScore: number }>> {
  const where = buildKeywordWhere(query.q, query.filters)
  const orderBy =
    query.sort === "relevance"
      ? { name: "asc" as const }
      : KEYWORD_ORDER[query.sort]

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

  const relevanceRows = rows.filter(
    (row) =>
      !query.q ||
      row.name.toLowerCase().includes(query.q.toLowerCase()) ||
      row.description?.toLowerCase().includes(query.q.toLowerCase()) ||
      row.brand?.toLowerCase().includes(query.q.toLowerCase()) ||
      row.category.name.toLowerCase().includes(query.q.toLowerCase()),
  )

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

/**
 * Runs the active search mode and returns a paginated, hybrid-ranked response.
 * Never throws: embedding/DB failures degrade to a keyword-only result.
 */
export async function searchProducts(query: SearchQuery): Promise<SearchResponse> {
  const { q, filters, sort, page, pageSize } = query

  if (!q.trim()) {
    // Empty query: browse mode, filters + sort only.
    const where = buildKeywordWhere("", filters)
    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: sort === "relevance" ? { name: "asc" } : KEYWORD_ORDER[sort],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    return {
      query,
      results: rows.map((row) => toSearchResult(row, { keywordScore: 0, semanticScore: null, score: 0 })),
      total,
      page,
      pageSize,
      totalPages,
    }
  }

  let keywordRanking: Array<{ productId: string; keywordScore: number }> = []
  let semanticRanking: ProductMatch[] = []

  if (query.mode === "keyword" || query.mode === "hybrid") {
    keywordRanking = await keywordSearch(query)
  }
  if (query.mode === "semantic" || query.mode === "hybrid") {
    semanticRanking = await searchProductsByVector(q, {
      limit: pageSize * 4,
      minSimilarity: MIN_SEMANTIC_SIMILARITY,
    })
  }

  // Merge by product id, preferring the stronger source when both exist.
  const semanticById = new Map(semanticRanking.map((m) => [m.id, m.similarity]))
  const keywordIds = new Set(keywordRanking.map((r) => r.productId))
  const candidateIds = new Set([
    ...keywordIds,
    ...semanticRanking.map((m) => m.id),
  ])

  if (candidateIds.size === 0) {
    return { query, results: [], total: 0, page, pageSize, totalPages: 1 }
  }

  const rows = await prisma.product.findMany({
    where: { id: { in: [...candidateIds] }, isActive: true },
    include: { category: true },
  })

  const scored = rows.map((row) => {
    const keywordHit = keywordRanking.find((r) => r.productId === row.id)
    const semanticScore = semanticById.get(row.id) ?? null
    const keywordScore = keywordHit?.keywordScore ?? 0
    const score = combineScores(keywordScore, semanticScore)
    return {
      row,
      scores: { keywordScore, semanticScore, score },
    }
  })

  // Apply explicit filters not already handled by keyword search, then sort.
  const availableOnly = filters.availableOnly === true
  const filtered = scored.filter(
    (item) =>
      (!availableOnly || item.row.stock > 0) &&
      (filters.minPrice === undefined || item.row.price.gte(filters.minPrice)) &&
      (filters.maxPrice === undefined || item.row.price.lte(filters.maxPrice)),
  )

  const sorted =
    query.sort === "relevance"
      ? [...filtered].sort((a, b) => b.scores.score - a.scores.score)
      : filtered.sort((a, b) => {
          if (query.sort === "price-asc" || query.sort === "price-desc") {
            const cmp = a.row.price.comparedTo(b.row.price)
            return query.sort === "price-asc" ? cmp : -cmp
          }
          if (query.sort === "rating") return b.row.rating - a.row.rating
          return b.row.createdAt.getTime() - a.row.createdAt.getTime()
        })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize

  return {
    query: { ...query, page: safePage },
    results: sorted.slice(start, start + pageSize).map((item) =>
      toSearchResult(item.row, item.scores),
    ),
    total,
    page: safePage,
    pageSize,
    totalPages,
  }
}