import { prisma } from "@/lib/prisma"
import { indexEmbeddings } from "@/lib/search"
import { searchProductsByVector, searchRecipesByVector } from "@/lib/search"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

/**
 * Verifies the vector infrastructure end to end:
 *   1. pgvector extension is present.
 *   2. Embeddings are generated and stored.
 *   3. Products can be searched semantically.
 *   4. Recipes can be searched semantically.
 *   5. Missing data is handled safely (empty text never reaches the provider).
 */
async function main() {
  const [productCount, recipeCount, extension] = await prisma.$transaction([
    prisma.product.count({ where: { isActive: true } }),
    prisma.recipe.count({ where: { isPublished: true } }),
    prisma.$queryRaw<Array<{ extname: string }>>`
      SELECT extname FROM pg_extension WHERE extname = 'vector'
    `,
  ])

  console.log("Environment:")
  console.log(`  products: ${productCount}, recipes: ${recipeCount}`)
  assert(extension.length === 1, "pgvector extension present")

  console.log("Indexing:")
  const result = await indexEmbeddings()
  console.log(
    `  embedded ${result.productsStored}/${result.productsProcessed} products, ` +
      `${result.recipesStored}/${result.recipesProcessed} recipes`,
  )

  // The indexer only embeds what changed; on a fresh DB it covers everything,
  // on an already-indexed DB it skips. What matters is that the store ends up
  // complete, so verify the DB state rather than the run delta.
  const [storedProducts, storedRecipes] = await prisma.$transaction([
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count FROM "products"
      WHERE "isActive" = true AND "embedding" IS NOT NULL
    `,
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count FROM "recipes"
      WHERE "isPublished" = true AND "embedding" IS NOT NULL
    `,
  ])
  assert(Number(storedProducts[0]?.count ?? 0) === productCount, "every active product got an embedding")
  assert(Number(storedRecipes[0]?.count ?? 0) === recipeCount, "every published recipe got an embedding")

  // Re-running the indexer must not regenerate existing embeddings.
  const secondRun = await indexEmbeddings()
  assert(
    secondRun.productsStored === 0 && secondRun.recipesStored === 0,
    "second index run is a no-op (no duplicate generation)",
  )

  console.log("Semantic product search:")
  const productHits = await searchProductsByVector("healthy high protein breakfast", { limit: 3 })
  assert(productHits.length > 0, `returned ${productHits.length} products`)

  console.log("Semantic recipe search:")
  const recipeHits = await searchRecipesByVector("quick vegetarian dinner", { limit: 3 })
  assert(recipeHits.length > 0, `returned ${recipeHits.length} recipes`)

  console.log("Missing data safety:")
  assert((await searchProductsByVector("   ")).length === 0, "empty query returns []")
  assert((await searchRecipesByVector("")).length === 0, "blank recipe query returns []")

  const ranked = await searchProductsByVector("protein", { limit: 10 })
  const sorted = [...ranked].sort((a, b) => b.similarity - a.similarity)
  assert(
    JSON.stringify(ranked.map((r) => r.id)) === JSON.stringify(sorted.map((r) => r.id)),
    "results are ranked by similarity descending",
  )

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })