import { prisma } from "@/lib/prisma"
import type { ProductMatch, SearchQuery, SearchResponse } from "@/lib/search/domain"
import { buildKeywordWhere, KEYWORD_ORDER, keywordSearch } from "@/lib/search/keyword"
import { combineScores } from "@/lib/search/ranking"
import { searchProductsByVector } from "@/lib/search/search"
import { toSearchResult } from "@/lib/search/utils"

/**
 * Minimum cosine similarity for a *semantic-only* candidate to be considered
 * relevant. Keyword matches are always kept — this only trims vector results
 * that would otherwise flood the list with unrelated products.
 */
const MIN_SEMANTIC_SIMILARITY = 0.25

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
      availableOnly: filters.availableOnly !== false,
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
    where: {
      id: { in: [...candidateIds] },
      isActive: true,
      ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
    },
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