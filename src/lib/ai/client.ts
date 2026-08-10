import { createOpenAI } from "@ai-sdk/openai"

import { aiConfig } from "@/lib/ai/config"

/**
 * A single shared provider instance. `createOpenAI` lazily reads the API key
 * from its options, so this module never touches the key directly.
 */
const provider = createOpenAI({
  apiKey: aiConfig.apiKey || undefined,
})

/** Returns a chat-capable model for the configured model id. */
export function getChatModel() {
  return provider(aiConfig.model)
}

/** Returns an embedding model for the configured embedding model id. */
export function getEmbeddingModel() {
  return provider.embedding(aiConfig.embeddingModel)
}
