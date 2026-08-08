import { NextRequest, NextResponse } from "next/server"

import {
  AIError,
  aiConfig,
  chatRequestBodySchema,
  streamAssistantResponse,
  toAIError,
} from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    if (!aiConfig.apiKey) {
      throw new AIError(
        "INVALID_API_KEY",
        "OpenAI is not configured. Set OPENAI_API_KEY in your environment.",
      )
    }

    const raw = await request.text()

    let body: unknown
    try {
      body = raw ? JSON.parse(raw) : {}
    } catch {
      throw AIError.invalidRequest("The request body must be valid JSON.")
    }

    const parsed = chatRequestBodySchema.safeParse(body)
    if (!parsed.success) {
      throw AIError.invalidRequest(
        "Provide a messages array with at least one message containing non-empty content.",
      )
    }

    const result = streamAssistantResponse({ messages: parsed.data.messages })
    return result.toUIMessageStreamResponse()
  } catch (error) {
    const aiError = toAIError(error)
    return NextResponse.json(
      { error: { code: aiError.code, message: aiError.message } },
      { status: aiError.status },
    )
  }
}
