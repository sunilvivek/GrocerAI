"use client"

import type {
  MealPlanConstraints,
  MealSuggestion,
  AvailableIngredient,
  MissingIngredient,
  RecipeIngredient,
} from "./domain"

import { listPublishedRecipes } from "./data"

function extractIngredientNames(
  recipeIngredients: RecipeIngredient[],
): string[] {
  if (!Array.isArray(recipeIngredients)) return []
  return recipeIngredients
    .map((ing: RecipeIngredient) => ing.name?.trim())
    .filter((n: string) => n && n.length > 0)
}

function totalMinutesFromRecipe(r: {
  prepTimeMinutes?: number
  cookTimeMinutes?: number
}): number {
  const prep = r.prepTimeMinutes ?? 0
  const cook = r.cookTimeMinutes ?? 0
  return prep + cook
}

// Normalize a Prisma Recipe ingredient array into our internal shape
function normalizeIngredients(
  ingredients: {
    /** Prisma adds _count metadata; this is the actual ingredients array */
    ingredients?: RecipeIngredient[]
  },
): RecipeIngredient[] {
  if (!Array.isArray(ingredients?.ingredients)) return []
  return ingredients.ingredients.map((ing: RecipeIngredient) => ({
    name: ing.name,
    normalized: ing.name?.toLowerCase() ?? "",
    quantity: ing.quantity ?? 1,
    unit: ing.unit ?? "unit",
  }))
}

export async function selectRecipes(
  constraints: MealPlanConstraints,
): Promise<MealSuggestion[]> {
  const raw = await listPublishedRecipes({
    sort: "createdAt",
    page: 1,
    pageSize: 30,
  })

  if (!raw?.recipes || raw.recipes.length === 0) return []

  // Score each recipe by ingredient coverage
  type ScoredRecipe = {
    title: string
    coverage: number
    totalMinutes: number
    missingNames: string[]
  }

  const availableSet = new Set(
    constraints.availableIngredients.map((ing) => ing.normalized),
  )

  const scored: ScoredRecipe[] = []

  for (const r of raw.recipes) {
    // Access ingredients directly; Prisma recipe shape includes _count metadata
    const ingredients = ((r as unknown) as { ingredients: RecipeIngredient[] })
      .ingredients
    const ingredientNames = extractIngredientNames(ingredients)
    if (ingredientNames.length === 0) continue

    const required = new Set(ingredientNames.map((n: string) => n.toLowerCase()))
    const cov = required.size > 0 ? 1 : 0
    const totalM = totalMinutesFromRecipe(r as { prepTimeMinutes?: number; cookTimeMinutes?: number })

    // Filter: skip if zero coverage and reuse not requested
    if (cov === 0 && !constraints.reuseIngredients) continue

    const missing: string[] = []
    for (const n of ingredientNames) {
      if (!availableSet.has(n.toLowerCase())) {
        missing.push(n)
      }
    }

    scored.push({
      title: r.title,
      coverage: cov,
      totalMinutes: totalM,
      missingNames: missing,
    })
  }

  // Sort: highest coverage, then shortest time
  scored.sort((a, b) => b.coverage - a.coverage || b.totalMinutes - a.totalMinutes)

  // Build missing ingredient arrays
  const missingArrays: string[][] = scored.map((s) => s.missingNames)

  // Build MealSuggestion objects
  const suggestions: MealSuggestion[] = scored.slice(0, 5).map(
    (s) => {
      const missingIngredients: MissingIngredient[] = s.missingNames.map(
        (name) => ({
          name,
          normalized: name.toLowerCase(),
          required: 1,
          available: 0,
          missing: 1,
        }),
      )

      return {
        title: s.title,
        coverage: s.coverage,
        totalMinutes: s.totalMinutes,
        difficulty: "EASY",
        selectedRecipeIngredients: [],
        availableIngredients: constraints.availableIngredients,
        missingIngredients,
        cost: 0,
        rationale: `${s.title} — coverage ${Math.round(s.coverage * 100)}%, ${s.totalMinutes} min`,
      }
    },
  )

  return suggestions
}