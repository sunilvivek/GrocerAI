import { z } from "zod"

const MAX_QUERY_LENGTH = 200
const MAX_PAGE_SIZE = 48
const MIN_PAGE_SIZE = 1

const modeSchema = z.enum(["hybrid", "keyword", "semantic"]).default("hybrid")
const sortSchema = z
  .enum(["relevance", "price-asc", "price-desc", "rating", "newest"])
  .default("relevance")

const nullableNumber = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === "") return undefined
    const number = Number(value)
    return Number.isFinite(number) ? number : value
  },
  z.number().min(0).optional(),
)

export const searchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .max(MAX_QUERY_LENGTH, `Query must be at most ${MAX_QUERY_LENGTH} characters`)
    .default(""),
  mode: modeSchema,
  sort: sortSchema,
  category: z.string().trim().max(80).optional(),
  minPrice: nullableNumber,
  maxPrice: nullableNumber,
  availableOnly: z
    .preprocess((value) => value === "true" || value === true, z.boolean())
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(20),
})

export type SearchQueryInput = z.input<typeof searchQuerySchema>
export type SearchQueryParsed = z.output<typeof searchQuerySchema>

/** Coerces `page`/`pageSize` into valid bounds after schema parsing. */
export function clampPagination(page: number, pageSize: number, total: number) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return {
    page: Math.min(page, totalPages),
    pageSize,
    totalPages,
  }
}

export const SEARCH_SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
] as const