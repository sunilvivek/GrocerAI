const DEFAULT_MODEL = "gpt-4o-mini"
const DEFAULT_TEMPERATURE = 0.7
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"

/**
 * Central place for AI-related configuration. Values come from environment
 * variables so the same code runs in dev, preview, and production.
 */
export const aiConfig = {
  model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
  apiKey: process.env.OPENAI_API_KEY?.trim() || "",
  temperature: Number(process.env.OPENAI_TEMPERATURE) || DEFAULT_TEMPERATURE,
  /** Embedding model used for vector search. Outputs 1536-dim vectors. */
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL?.trim() || DEFAULT_EMBEDDING_MODEL,
  /** Guard against absurdly long prompts reaching the provider. */
  maxMessageCharacters: 4000,
  maxMessages: 50,
}
