/**
 * A provider that turns text into numeric embedding vectors. Implementations
 * may use remote APIs or a local model — the rest of the search pipeline only
 * depends on this shape.
 *
 * Methods return `null` for individual empty inputs so callers can skip
 * records that have nothing worth indexing.
 */
export interface EmbeddingProvider {
  readonly name: string
  /** Dimensionality of vectors this provider emits (matches the DB column). */
  readonly dimensions: number
  embed(text: string): Promise<number[] | null>
  embedMany(texts: string[]): Promise<Array<number[] | null>>
}