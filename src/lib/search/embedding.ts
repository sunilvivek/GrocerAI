import { getEmbeddingProvider } from "@/lib/search/providers"

/**
 * Generates a single embedding using the active provider (local model by
 * default). Returns `null` for empty text so callers can skip records that
 * have nothing worth indexing.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const provider = await getEmbeddingProvider()
  return provider.embed(text)
}

/**
 * Generates embeddings for many texts in one provider call. The result is
 * aligned with `texts`; an entry is `null` when the corresponding text was
 * empty (skipped), otherwise it holds the embedding vector.
 */
export async function embedManyTexts(texts: string[]): Promise<Array<number[] | null>> {
  const provider = await getEmbeddingProvider()
  return provider.embedMany(texts)
}