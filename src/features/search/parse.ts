import type { SearchQuery } from "@/lib/search/domain"
import { searchQuerySchema } from "@/lib/search/validation"

export type SearchPageParams = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

/**
 * Parses and normalizes incoming `/products` query params into a valid
 * `SearchQuery`. Invalid values fall back to safe defaults rather than erroring,
 * so the page always renders something useful.
 */
export async function parseSearchQuery(
  searchParams: Awaited<SearchPageParams["searchParams"]>,
): Promise<SearchQuery> {
  const input = {
    q: first(searchParams.q),
    mode: first(searchParams.mode),
    sort: first(searchParams.sort),
    category: first(searchParams.category),
    minPrice: first(searchParams.minPrice),
    maxPrice: first(searchParams.maxPrice),
    availableOnly: first(searchParams.availableOnly),
    page: first(searchParams.page),
    pageSize: first(searchParams.pageSize),
  }

  const parsed = searchQuerySchema.safeParse(input)

  if (!parsed.success) {
    return {
      q: "",
      mode: "hybrid",
      sort: "relevance",
      filters: {},
      page: 1,
      pageSize: 20,
    }
  }

  return {
    q: parsed.data.q,
    mode: parsed.data.mode,
    sort: parsed.data.sort,
    filters: {
      categorySlug: parsed.data.category || undefined,
      minPrice: parsed.data.minPrice,
      maxPrice: parsed.data.maxPrice,
      availableOnly: parsed.data.availableOnly,
    },
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
  }
}
