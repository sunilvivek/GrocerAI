import { z } from "zod"

import { aiConfig } from "@/lib/ai/config"

export const assistantMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().trim().min(1).max(aiConfig.maxMessageCharacters),
})

export const chatRequestBodySchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(aiConfig.maxMessages),
})
