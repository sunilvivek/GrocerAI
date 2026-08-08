import { streamText } from "ai"

import { getChatModel } from "@/lib/ai/client"
import { aiConfig } from "@/lib/ai/config"
import { assistantSystemPrompt } from "@/lib/ai/prompts"

export type ChatMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export type StreamAssistantOptions = {
  messages: ChatMessage[]
}

/**
 * Streams an assistant reply for a conversation. Returns the raw `streamText`
 * result so callers can pipe it to a client (e.g. via `toUIMessageStreamResponse`).
 */
export function streamAssistantResponse({ messages }: StreamAssistantOptions) {
  return streamText({
    model: getChatModel(),
    system: assistantSystemPrompt(),
    messages,
    temperature: aiConfig.temperature,
    maxOutputTokens: 1024,
  })
}
