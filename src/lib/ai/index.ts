export { aiConfig } from "@/lib/ai/config"
export { getChatModel } from "@/lib/ai/client"
export { AIError, toAIError, type AIErrorCode } from "@/lib/ai/errors"
export { assistantSystemPrompt } from "@/lib/ai/prompts"
export {
  streamAssistantResponse,
  type ChatMessage,
  type StreamAssistantOptions,
} from "@/lib/ai/service"
export {
  assistantMessageSchema,
  chatRequestBodySchema,
} from "@/lib/ai/validation"
