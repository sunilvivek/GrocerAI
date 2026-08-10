import { prisma } from "@/lib/prisma"
import { embedManyTexts } from "@/lib/search/embedding"
import { buildProductDocument, buildRecipeDocument } from "@/lib/search/text"
import { toVectorLiteral } from "@/lib/search/vector"

const INDEX_BATCH_SIZE = 25
const SELECT_LIMIT = 200

type IndexOptions = {
  /** Batch size for both provider calls and DB writes. */
  batchSize?: number
  /** Re-embed every active row, ignoring the staleness check. */
  force?: boolean
  /** Cap on total rows processed per run (used by the CLI). */
  limit?: number
}

/**
 * Indexes products and recipes that are missing or have stale embeddings.
 *
 * Safe by design:
 * - Only rows with no embedding, or whose `embeddingUpdatedAt` is older than
 *   their `updatedAt`, are re-embedded.
 * - Records without meaningful text are skipped instead of failing the batch.
 * - Embeddings are written through raw SQL (the column is `Unsupported`).
 * - Provider calls are batched; rows are processed until `limit` total.
 *
 * Returns a summary of what was processed and stored.
 */
export async function indexEmbeddings(options: IndexOptions = {}): Promise<{
  productsProcessed: number
  productsStored: number
  recipesProcessed: number
  recipesStored: number
}> {
  const { batchSize = INDEX_BATCH_SIZE, force = false, limit = SELECT_LIMIT } = options

  const [candidateProducts, candidateRecipes] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        updatedAt: true,
        embeddingUpdatedAt: true,
        name: true,
        description: true,
        brand: true,
        unit: true,
        servingSize: true,
        calories: true,
        proteinGrams: true,
        carbsGrams: true,
        fatGrams: true,
        fiberGrams: true,
        sugarGrams: true,
        tags: true,
        category: { select: { name: true } },
      },
      take: limit,
    }),
    prisma.recipe.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        updatedAt: true,
        embeddingUpdatedAt: true,
        title: true,
        description: true,
        cuisine: true,
        tags: true,
        ingredients: {
          select: {
            quantity: true,
            unit: true,
            note: true,
            ingredient: { select: { name: true } },
          },
        },
      },
      take: limit,
    }),
  ])

  const products = force
    ? candidateProducts
    : candidateProducts.filter(
        (row) => !row.embeddingUpdatedAt || row.embeddingUpdatedAt < row.updatedAt,
      )
  const recipes = force
    ? candidateRecipes
    : candidateRecipes.filter(
        (row) => !row.embeddingUpdatedAt || row.embeddingUpdatedAt < row.updatedAt,
      )

  let productsStored = 0
  let recipesStored = 0

  for (let offset = 0; offset < products.length; offset += batchSize) {
    const batch = products.slice(offset, offset + batchSize)
    const documents = batch.map((product) => buildProductDocument(product))
    const vectors = await embedManyTexts(documents)

    const storeables = batch.flatMap((product, index) => {
      const vector = vectors[index]
      return vector ? [{ id: product.id, vector }] : []
    })

    await prisma.$transaction(
      storeables.map((row) =>
        prisma.$executeRaw`
          UPDATE "products"
          SET "embedding" = ${toVectorLiteral(row.vector)}::vector,
              "embeddingUpdatedAt" = NOW()
          WHERE "id" = ${row.id}::uuid
        `,
      ),
    )
    productsStored += storeables.length
  }

  for (let offset = 0; offset < recipes.length; offset += batchSize) {
    const batch = recipes.slice(offset, offset + batchSize)
    const documents = batch.map((recipe) => buildRecipeDocument(recipe))
    const vectors = await embedManyTexts(documents)

    const storeables = batch.flatMap((recipe, index) => {
      const vector = vectors[index]
      return vector ? [{ id: recipe.id, vector }] : []
    })

    await prisma.$transaction(
      storeables.map((row) =>
        prisma.$executeRaw`
          UPDATE "recipes"
          SET "embedding" = ${toVectorLiteral(row.vector)}::vector,
              "embeddingUpdatedAt" = NOW()
          WHERE "id" = ${row.id}::uuid
        `,
      ),
    )
    recipesStored += storeables.length
  }

  return {
    productsProcessed: products.length,
    productsStored,
    recipesProcessed: recipes.length,
    recipesStored,
  }
}