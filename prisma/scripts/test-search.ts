import { searchProducts } from "@/lib/search"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

function baseQuery(overrides: Record<string, unknown> = {}) {
  return {
    q: "",
    mode: "hybrid" as const,
    sort: "relevance" as const,
    filters: {},
    page: 1,
    pageSize: 20,
    ...overrides,
  }
}

/**
 * Validates the hybrid search service end to end:
 *   1. Keyword search finds lexical matches.
 *   2. Semantic search finds meaning-based matches.
 *   3. Hybrid blending ranks the best match first.
 *   4. Filters scope results correctly.
 *   5. Pagination slices and reports totals correctly.
 *   6. Empty / malformed queries degrade safely.
 */
async function main() {
  console.log("Keyword search:")
  const milk = await searchProducts(baseQuery({ q: "milk", mode: "keyword" }))
  assert(milk.total > 0, `"milk" returned ${milk.total} products`)
  assert(
    milk.results.some((r) => /milk/i.test(r.name)),
    "at least one result contains 'milk' in the name",
  )

  console.log("Semantic search:")
  const dairy = await searchProducts(
    baseQuery({ q: "creamy dairy product", mode: "semantic" }),
  )
  assert(dairy.total > 0, `"creamy dairy product" returned ${dairy.total} products`)
  assert(
    dairy.results.every((r) => r.semanticScore !== null),
    "semantic results carry a semanticScore",
  )

  console.log("Hybrid ranking:")
  const butter = await searchProducts(baseQuery({ q: "butter" }))
  assert(butter.total > 0, `hybrid "butter" returned ${butter.total} products`)
  const scores = butter.results.map((r) => r.score)
  assert(
    scores.every((score, i) => i === 0 || scores[i - 1] >= score),
    "hybrid results are sorted by score descending",
  )
  assert(butter.results[0]?.name.toLowerCase().includes("butter"), "top hybrid hit mentions butter")

  console.log("Filters:")
  const bakeryButter = await searchProducts(
    baseQuery({
      q: "butter",
      filters: { categorySlug: "dairy", minPrice: 300, maxPrice: 350, availableOnly: true },
    }),
  )
  assert(bakeryButter.results.length > 0, `filtered "butter" returned ${bakeryButter.results.length} products`)
  assert(
    bakeryButter.results.every(
      (r) =>
        r.category.slug === "dairy" &&
        r.price >= 300 &&
        r.price <= 350 &&
        r.stock > 0,
    ),
    "every filtered result matches category, price range, and availability",
  )
  assert(
    bakeryButter.results.every((r) => r.category.slug === "dairy"),
    "no cross-category leaks with categorySlug filter",
  )

  const browse = await searchProducts(
    baseQuery({ filters: { categorySlug: "produce" }, sort: "price-asc" }),
  )
  assert(browse.total > 0, `browse produce returned ${browse.total} products`)
  assert(
    browse.results.every((r) => r.category.slug === "produce"),
    "browse respects category filter",
  )

  console.log("Pagination:")
  const pageOne = await searchProducts(baseQuery({ q: "vegetables", page: 1, pageSize: 4 }))
  const pageTwo = await searchProducts(baseQuery({ q: "vegetables", page: 2, pageSize: 4 }))
  assert(pageOne.total === pageTwo.total, "pagination reports a stable total")
  assert(pageTwo.totalPages === Math.ceil(pageTwo.total / 4), "totalPages matches ceil(total/pageSize)")
  const pageOneIds = new Set(pageOne.results.map((r) => r.id))
  const overlap = pageTwo.results.filter((r) => pageOneIds.has(r.id)).length
  assert(overlap === 0, "page 2 does not repeat page 1 results")
  assert(pageTwo.results.length === 4 || pageTwo.results.length <= 4, "page 2 carries at most pageSize results")

  const overPage = await searchProducts(baseQuery({ q: "vegetables", page: 999 }))
  assert(overPage.page <= overPage.totalPages, "out-of-range page clamps to the last page")

  console.log("Robustness:")
  const empty = await searchProducts(baseQuery())
  assert(empty.total > 0, "empty query falls back to browse mode")
  const noMatch = await searchProducts(baseQuery({ q: "zzzz-nonexistent-zzzz" }))
  assert(noMatch.total === 0 && noMatch.results.length === 0, "no-match query returns empty results")

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    const { prisma } = await import("@/lib/prisma")
    await prisma.$disconnect()
  })
