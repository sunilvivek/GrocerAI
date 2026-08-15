"use client"

/**
 * Natural-language meal request parser.
 *
 * Converts user prompts like:
 * "I have rice, eggs and tomatoes. Plan 5 dinners."
 * "I have chicken and potatoes. Plan 3 quick dinners under ₹800."
 *
 * Into structured MealPlanConstraints without using OpenAI.
 *
 * Limitations:
 * - Does not handle arbitrary language perfectly.
 * - Ambiguous or unsupported requests return a graceful fallback.
 */
import type { MealPlanConstraints, AvailableIngredient } from "./domain"

// --- regex tokens -------------------------------------------------------

/** Match ingredient name tokens (letters, basic unicode, hyphens, apostrophes). */
const INGREDIENT_RE = /[a-zA-Z\u00C0-\u00FFa-zA-Z'-]+/g

/** Match "quick" / "easy" indicators. */
const QUICK_INDICATORS = ["quick", "fast", "easy", "under", "in a hurry"]

// --- parsing result ------------------------------------------------------

/**
 * Result of parsing a meal request.
 * Empty `availableIngredients` means the parser couldn't detect any.
 */
export type ParseResult = {
  /** True if the request was successfully parsed. */
  success: boolean
  /** Human-readable error message, if unsuccessful. */
  error?: string
  /** Parsed planning constraints. */
  constraints?: MealPlanConstraints
}

// --- parsing function ----------------------------------------------------

/**
 * Parse a natural-language meal request.
 *
 * Supported patterns (best-effort; others fall back):
 *   "I have rice, eggs and tomatoes. Plan 5 dinners."
 *   "I have chicken and potatoes. Plan 3 quick dinners under ₹800."
 *   "Plan meals using the ingredients I already have."
 *   "Create a meal plan that reuses the same ingredients."
 *
 * @param prompt The user's natural-language request.
 * @returns Structured constraints, or a failure result.
 */
export function parseMealRequest(prompt: string): ParseResult {
  const lower = prompt.toLowerCase().trim()

  // --- 1. Extract "plan N dinners" / "Plan N days" --------------------

  const planMatch = lower.match(/plan\s+(\d+)\s*(dinner|dinners?|day|days?)/i)
  const days = planMatch ? parseInt(planMatch[1], 10) : undefined

  // --- 2. Extract available ingredients ------------------------------

  // Common lead-ins: "i have", "i've got", "i already have", "with"
  const haveMatch = lower.match(
    /(?:i have|i've got|i already have|with)[:\s]*(.+)$/,
  )

  // Start with an empty list — we'll fill it from the "have" match or a
  // fallback scan of the whole prompt.
  let rawCandidateTokens: string[] = []

  if (haveMatch) {
    const after = haveMatch[1]
    // split on commas or "and", discard "also"/"too"
    const parts = after
      .split(/[,&]/)
      .map((s) => s.replace(/\\b(also|too)\b/gi, "").trim())
      .filter((s) => s.length > 0 && s !== "and")
    rawCandidateTokens = parts
  }

  // Fallback: if no "I have" structure, scan the whole prompt for
  // ingredient-like tokens, filtering out common non-ingredient stop words.
  if (rawCandidateTokens.length === 0) {
    const stopWords = [
      "plan",
      "meals",
      "dinners",
      "dinner",
      "using",
      "for",
      "the",
      "to",
      "my",
      "ingredients",
      "quick",
      "budget",
    ]
    const allTokens = lower.match(INGREDIENT_RE) || []
    rawCandidateTokens = allTokens
      .map((t) => t.trim())
      .filter((t) => t && !stopWords.includes(t.toLowerCase()))
  }

  // Deduplicate while preserving order
  const seen = new Set<string>()
  const availableIngredientNames: string[] = []
  for (const t of rawCandidateTokens) {
    const trimmed = t.trim()
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed)
      availableIngredientNames.push(trimmed)
    }
  }

  // Map raw names to AvailableIngredient domain objects.
  const availableIngredients: AvailableIngredient[] = availableIngredientNames.map(
    (name) => ({
      name,
      normalized: name.toLowerCase().trim(),
    }),
  )

  // --- 3. Extract budget -------------------------------------------

  let budget: number | undefined
  const budgetMatch = lower.match(/₹\s*(\d+(?:\.\d+)?)/i)
  if (budgetMatch) {
    budget = parseFloat(budgetMatch[1])
  } else {
    const underMatch = lower.match(/under\s+₹?\s*(\d+(?:\.\d+)?)/i)
    if (underMatch) {
      budget = parseFloat(underMatch[1])
    }
  }

  // --- 4. Detect "quick" / "easy" ----------------------------------

  const isQuick = QUICK_INDICATORS.some((kw) => lower.includes(kw))

  // --- 5. Detect dietary preference ---------------------------------

  let dietary: "none" | "vegetarian" | "vegan" | "halal" | "kosher" | "other" =
    "none"
  if (/vegetarian/.test(lower)) dietary = "vegetarian"
  else if (/vegan/.test(lower)) dietary = "vegan"
  else if (/halal/.test(lower)) dietary = "halal"
  else if (/kosher/.test(lower)) dietary = "kosher"

  // --- 6. Assemble result ------------------------------------------

  // Build maxCookingTime carefully
  const maxCookingTime = isQuick ? 30 : undefined

  // Build constraints object
  const rawConstraints: Record<string, unknown> = {
    days: days ?? 1,
    persons: 1,
    mealsPerDay: 1,
    availableIngredients,
    dietary,
    maxCookingTime,
    reuseIngredients: lower.includes("reuse"),
  }

  // Conditionally add budget if defined
  if (budget !== undefined) {
    ;(rawConstraints as Record<string, unknown>).budget = budget
  }

  // Cast to the expected type
  const constraints: MealPlanConstraints = rawConstraints as MealPlanConstraints

  // Validate: at least days or ingredients recognizable
  const hasDays = constraints.days !== undefined && constraints.days > 0
  const hasIngredients = constraints.availableIngredients.length > 0

  if (!hasDays && !hasIngredients) {
    return {
      success: false,
      error:
        "I couldn't parse your meal request. Try: 'I have rice, eggs and tomatoes. Plan 5 dinners.'",
    }
  }

  return {
    success: true,
    constraints,
  }
}