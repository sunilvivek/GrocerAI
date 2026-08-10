import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers"

import type { EmbeddingProvider } from "@/lib/search/providers/types"

const MODEL_ID = "Xenova/all-MiniLM-L6-v2"
const EMBED_BATCH_SIZE = 32

let sharedPipeline: Promise<FeatureExtractionPipeline> | null = null

/**
 * Loads the local sentence-transformers model once and reuses it for every
 * call in the process. The model is quantized (`q8`) to keep memory and
 * download size small while staying accurate enough for retrieval.
 */
async function getPipeline(): Promise<FeatureExtractionPipeline> {
  if (!sharedPipeline) {
    sharedPipeline = pipeline("feature-extraction", MODEL_ID, { dtype: "q8" })
  }
  return sharedPipeline
}

/**
 * Local embedding provider powered by `all-MiniLM-L6-v2` running through
 * transformers.js. No API calls, no billing, fully offline after first load.
 */
export class LocalEmbeddingProvider implements EmbeddingProvider {
  readonly name = "local"
  readonly dimensions = 384

  async embed(text: string): Promise<number[] | null> {
    const value = text.trim()
    if (!value) return null

    const extractor = await getPipeline()
    const output = await extractor(value, { pooling: "mean", normalize: true })
    return Array.from(output.data as ArrayLike<number>)
  }

  async embedMany(texts: string[]): Promise<Array<number[] | null>> {
    const indexes = texts
      .map((text, index) => ({ index, text: text.trim() }))
      .filter((entry) => entry.text.length > 0)

    const results: Array<number[] | null> = texts.map(() => null)
    const extractor = await getPipeline()

    for (let offset = 0; offset < indexes.length; offset += EMBED_BATCH_SIZE) {
      const batch = indexes.slice(offset, offset + EMBED_BATCH_SIZE)
      const output = await extractor(batch.map((entry) => entry.text), {
        pooling: "mean",
        normalize: true,
      })

      const data = output.data as ArrayLike<number>
      const dims = output.dims as unknown as number[]
      const perRow = dims[dims.length - 1]

      batch.forEach((entry, i) => {
        const row: number[] = []
        const start = i * perRow
        for (let j = 0; j < perRow; j++) {
          row.push(data[start + j] as number)
        }
        results[entry.index] = row
      })
    }

    return results
  }
}