import type { EmbeddingProvider } from "@/lib/search/providers/types"

/**
 * Returns the active embedding provider based on `EMBEDDING_PROVIDER`.
 * Defaults to the free local model so development works without API keys.
 * Set `EMBEDDING_PROVIDER=openai` to opt into the OpenAI provider.
 */
export async function getEmbeddingProvider(): Promise<EmbeddingProvider> {
  const provider = process.env.EMBEDDING_PROVIDER?.trim().toLowerCase()

  if (provider === "openai") {
    const { OpenAIEmbeddingProvider } = await import("@/lib/search/providers/openai")
    return new OpenAIEmbeddingProvider()
  }

  const { LocalEmbeddingProvider } = await import("@/lib/search/providers/local")
  return new LocalEmbeddingProvider()
}