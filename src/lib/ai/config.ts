const DEFAULT_MODEL = "gpt-4o-mini"
const DEFAULT_TEMPERATURE = 0.7

/**
 * Central place for AI-related configuration. Values come from environment
 * variables so the same code runs in dev, preview, and production.
 */
export const aiConfig = {
  model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
  apiKey: process.env.OPENAI_API_KEY?.trim() || "",
  temperature: Number(process.env.OPENAI_TEMPERATURE) || DEFAULT_TEMPERATURE,
  /** Guard against absurdly long prompts reaching the provider. */
  maxMessageCharacters: 4000,
  maxMessages: 50,
}
