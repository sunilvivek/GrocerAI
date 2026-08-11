import type { ProductWithCategory, SearchResult } from "@/lib/search/domain"

/**
 * Converts a Prisma product row (with its category) into the search result
 * shape. Money values are serialized from `Decimal` to plain numbers so the
 * result can be returned to the client without a Decimal dependency.
 */
export function toSearchResult(
  product: ProductWithCategory,
  scores: { keywordScore: number; semanticScore: number | null; score: number },
): SearchResult {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.image,
    brand: product.brand,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
    unit: product.unit,
    unitAmount: product.unitAmount.toNumber(),
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    keywordScore: scores.keywordScore,
    semanticScore: scores.semanticScore,
    score: scores.score,
  }
}