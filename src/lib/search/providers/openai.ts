import { embed, embedMany } from "ai"

import { getEmbeddingModel } from "@/lib/ai/client"
import type { EmbeddingProvider } from "@/lib/search/providers/types"

const EMBED_BATCH_SIZE = 32

/**
 * OpenAI embedding provider. Requires `OPENAI_API_KEY` and billing credits on
 * the account. Kept as an optional alternative to the default local provider.
 */
export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = "openai"
  readonly dimensions = 1536

  async embed(text: string): Promise<number[] | null> {
    const value = text.trim()
    if (!value) return null

    const { embedding } = await embed({
      model: getEmbeddingModel(),
      value,
    })
    return embedding
  }

  async embedMany(texts: string[]): Promise<Array<number[] | null>> {
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
}