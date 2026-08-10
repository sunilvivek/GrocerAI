import { indexEmbeddings } from "@/lib/search"

/**
 * CLI entrypoint for generating/storing embeddings for products and recipes.
 *
 * Usage:
 *   pnpm db:index                # index rows missing or with stale embeddings
 *   pnpm db:index --force        # re-embed every active row
 *   pnpm db:index --limit 500    # cap rows processed (each of products/recipes)
 */
async function main() {
  const force = process.argv.includes("--force")
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="))
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined

  if (limit !== undefined && (Number.isNaN(limit) || limit <= 0)) {
    console.error("Usage: pnpm db:index [--force] [--limit=<n>]")
    process.exit(1)
  }

  const result = await indexEmbeddings({ force, limit })

  console.log(
    [
      "Indexing complete:",
      `  products: ${result.productsStored}/${result.productsProcessed} embedded`,
      `  recipes:  ${result.recipesStored}/${result.recipesProcessed} embedded`,
    ].join("\n"),
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await import("@/lib/prisma").then(({ prisma }) => prisma.$disconnect())
  })