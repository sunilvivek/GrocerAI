import { embed, embedMany } from "ai"

import { getEmbeddingModel } from "@/lib/ai/client"

const EMBED_BATCH_SIZE = 32

/**
 * Generates a single embedding for the given text using the configured OpenAI
 * embedding model.
 *
 * Returns `null` when the text is empty so callers can skip records that have
 * nothing worth indexing.
 *
 * @throws If the provider call fails; index/serve callers decide how to react.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const value = text.trim()
  if (!value) return null

  const { embedding } = await embed({
    model: getEmbeddingModel(),
    value,
  })
  return embedding
}

/**
 * Generates embeddings for many texts in one provider call. The result is
 * aligned with `texts`; an entry is `null` when the corresponding text was
 * empty (skipped), otherwise it holds the embedding vector.
 *
 * @throws If the provider call fails.
 */
export async function embedManyTexts(texts: string[]): Promise<Array<number[] | null>> {
  const indexes = texts
    .map((text, index) => ({ index, text: text.trim() }))
    .filter((entry) => entry.text.length > 0)

  const results: Array<number[] | null> = texts.map(() => null)

  for (let offset = 0; offset < indexes.length; offset += EMBED_BATCH_SIZE) {
    const batch = indexes.slice(offset, offset + EMBED_BATCH_SIZE)
    const { embeddings } = await embedMany({
      model: getEmbeddingModel(),
      values: batch.map((entry) => entry.text),
    })
    batch.forEach((entry, i) => {
      results[entry.index] = embeddings[i]
    })
  }

  return results
}