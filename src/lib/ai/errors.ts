export type AIErrorCode =
  | "INVALID_REQUEST"
  | "INVALID_API_KEY"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "MODEL_UNAVAILABLE"
  | "STREAM_INTERRUPTED"
  | "UNKNOWN"

const statusForCode: Record<AIErrorCode, number> = {
  INVALID_REQUEST: 400,
  INVALID_API_KEY: 401,
  RATE_LIMITED: 429,
  TIMEOUT: 504,
  MODEL_UNAVAILABLE: 503,
  STREAM_INTERRUPTED: 500,
  UNKNOWN: 500,
}

export class AIError extends Error {
  readonly code: AIErrorCode
  readonly status: number

  constructor(code: AIErrorCode, message: string) {
    super(message)
    this.name = "AIError"
    this.code = code
    this.status = statusForCode[code]
  }

  static invalidRequest(message: string): AIError {
    return new AIError("INVALID_REQUEST", message)
  }
}

function statusCodeOf(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined
  const candidate = (error as Record<string, unknown>).statusCode ?? (error as Record<string, unknown>).status
  return typeof candidate === "number" ? candidate : undefined
}

/**
 * Normalizes any thrown value (provider SDK errors, network failures, JSON
 * parsing) into an {@link AIError} so API routes can respond with a stable,
 * typed error body.
 */
export function toAIError(error: unknown): AIError {
  if (error instanceof AIError) return error

  const status = statusCodeOf(error)

  if (status === 401) {
    return new AIError("INVALID_API_KEY", "The OpenAI API key is missing or invalid.")
  }

  if (status === 429) {
    return new AIError("RATE_LIMITED", "The AI provider is rate limiting requests. Please try again shortly.")
  }

  if (status === 408 || status === 504) {
    return new AIError("TIMEOUT", "The AI provider took too long to respond. Please try again.")
  }

  if (status !== undefined && status >= 500) {
    return new AIError("MODEL_UNAVAILABLE", "The AI model is temporarily unavailable. Please try again.")
  }

  if (error instanceof SyntaxError) {
    return AIError.invalidRequest("The request body must be valid JSON.")
  }

  return new AIError("UNKNOWN", "Something went wrong while processing the AI request.")
}
