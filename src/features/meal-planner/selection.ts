"use client"

import type {
  MealPlanConstraints,
  MealSuggestion,
  AvailableIngredient,
  MissingIngredient,
} from "./domain"

import { listPublishedRecipes } from "./data"

function extractIngredientNames(recipe: any): string[] {
  if (!recipe?.ingredients || !Array.isArray(recipe.ingredients)) return []
  return recipe.ingredients
    .map((ing: any) => ing?.ingredientName?.trim())
    .filter((n: string) => n && n.length > 0)
}

function totalMinutesFromRecipe(recipe: any): number {
  const prep = (recipe as any)?.prepTimeMinutes ?? 0
  const cook = (recipe as any)?.cookTimeMinutes ?? 0
  return prep + cook
}

export async function selectRecipes(
  constraints: MealPlanConstraints,
): Promise<MealSuggestion[]> {
  const { recipes } = await listPublishedRecipes({
    sort: "createdAt",
    page: 1,
    pageSize: 30,
  })

  if (!recipes || recipes.length === 0) return []

  const availableSet = new Set(
    constraints.availableIngredients.map((ing) => ing.normalized),
  )

  // Score each recipe by ingredient coverage
  type ScoredRecipe = {
    title: string
    coverage: number
    totalMinutes: number
    missingNames: string[]
  }

  const scored: ScoredRecipe[] = []

  for (const recipe of recipes) {
    const reqNames = extractIngredientNames(recipe)
    if (reqNames.length === 0) continue

    const required = new Set(reqNames.map((n) => n.toLowerCase()))
    const cov = required.size > 0 ? 1 : 0
    const totalM = totalMinutesFromRecipe(recipe)

    // Filter: skip if zero coverage and reuse not requested
    if (cov === 0 && !constraints.reuseIngredients) continue

    const missing: string[] = []
    for (const n of reqNames) {
      if (!availableSet.has(n.toLowerCase())) {
        missing.push(n)
      }
    }

    scored.push({
      title: recipe.title,
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
    (s, idx) => {
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