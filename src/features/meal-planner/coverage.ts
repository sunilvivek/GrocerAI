"use client"

import type {
  MealPlanConstraints,
  MealPlanResponse,
  MealPlanDay,
  MealSuggestion,
  AvailableIngredient,
  MissingIngredient,
  Meal,
  RecipeIngredient,
} from "./domain"

import { listPublishedRecipes } from "./data"
import { selectRecipes } from "./selection"

function extractIngredientNames(recipe: { ingredients: { ingredientName: string }[] }): string[] {
  if (recipe == null || !Array.isArray(recipe.ingredients)) return []
  return recipe.ingredients
    .map((ing: { ingredientName: string }) => ing.ingredientName?.trim())
    .filter((n: string) => n && n.length > 0)
}

function totalMinutesFromRecipe(recipe: { prepTimeMinutes?: number; cookTimeMinutes?: number }): number {
  const prep = recipe.prepTimeMinutes ?? 0
  const cook = recipe.cookTimeMinutes ?? 0
  return prep + cook
}

export async function createMealPlan(
  constraints: MealPlanConstraints,
  availableIngredients: AvailableIngredient[],
): Promise<MealPlanResponse> {
  // Step 1: Select recipes
  const suggestions = await selectRecipes(constraints)

  if (suggestions.length === 0) {
    return {
      id: crypto.randomUUID(),
      planDays: constraints.days ?? 5,
      persons: constraints.persons ?? 1,
      mealsPerDay: constraints.mealsPerDay ?? 1,
      days: [] as MealPlanDay[],
      preferences: {
        dietary: constraints.dietary,
        reuseIngredients: constraints.reuseIngredients ?? false,
        quickMeals: false,
      },
      constraints,
      cost: {
        additionalCost: 0,
        totalCost: 0,
        coveredByPantry: 0,
      },
      summary: "No recipes found matching your criteria. Try adjusting your available ingredients or constraints.",
    }
  }

  // Step 1.5: Sort recipes by coverage and time
  const sorted = [...suggestions].sort((a, b) => {
    if (b.coverage !== a.coverage) return b.coverage - a.coverage
    const aTime: number = (b as { totalMinutes?: number })?.totalMinutes ?? 30
    const bTime: number = (a as { totalMinutes?: number })?.totalMinutes ?? 30
    return bTime - aTime
  })

  // Step 2: Distribute recipes across days
  const daysCount: number = constraints.days ?? 5
  const mealsPerDay: number = constraints.mealsPerDay ?? 1
  const daysMeals: MealPlanDay[] = []

  for (let d = 0; d < daysCount; d++) {
    daysMeals.push({ day: d + 1, meals: [] } as MealPlanDay)
  }

  // Step 2.5: Track ingredient coverage per day
  const dayCoverage: number[] = new Array(daysCount).fill(0)

  // Step 3: Distribute recipes across days
  for (let i = 0; i < daysCount * mealsPerDay && i < sorted.length; i++) {
    const recipe = sorted[i]
    const dayIndex = i % daysCount
    const day = daysMeals[dayIndex]

    // Build selected recipe ingredients list
    const rIngs = recipe.selectedRecipeIngredients
    const rIngMap: RecipeIngredient[] = []
    if (rIngs) {
      for (const ing of rIngs) {
        rIngMap.push({
          name: ing.name,
          normalized: ing.normalized,
          quantity: ing.quantity ?? 1,
          unit: ing.unit ?? "unit",
        })
      }
    }

    day.meals.push({
      id: crypto.randomUUID(),
      title: recipe.title,
      description: "",
      cuisine: "",
      difficulty: "EASY",
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      totalTimeMinutes: (recipe as { totalMinutes?: number })?.totalMinutes ?? 30,
      servings: 4,
      selectedRecipeIngredients: rIngMap,
      availableIngredients: constraints.availableIngredients,
      missingIngredients: [],
      instructions: [],
      missingCost: 0,
    })

    // Update coverage tracking
    const recipeIngSet = new Set(
      (recipe.selectedRecipeIngredients as RecipeIngredient[]).map(
        (ing) => ing.normalized,
      ),
    )
    for (const ing of recipeIngSet) {
      if (availableIngredients.some((a) => a.normalized === ing)) {
        dayCoverage[dayIndex] = (dayCoverage[dayIndex] || 0) + 1
      }
    }
  }

  // Step 3: Generate summary
  const totalMeals = daysMeals.reduce(
    (sum, day) => sum + day.meals.length,
    0,
  )

  const additionalCost = 0 // placeholder - Phase 8
  const lines: string[] = []
  lines.push(`YOUR MEAL PLAN (${totalMeals} meals over ${daysCount} days)`)
  lines.push("")
  for (let d = 0; d < daysCount; d++) {
    lines.push(`DAY ${daysMeals[d].day}`)
    for (const meal of daysMeals[d].meals) {
      const m = meal as Meal
      lines.push(`  • ${m.title} — ${m.totalTimeMinutes} min`)
    }
  }
  lines.push(`Estimated additional grocery cost: ₹${additionalCost}`)
  lines.push("")
  if (constraints.budget !== undefined) {
    const remaining = constraints.budget - additionalCost
    lines.push(`Budget: ₹${constraints.budget} — Remaining: ₹${remaining >= 0 ? remaining : 0}`)
  }
  lines.push("")
  lines.push("Used from your pantry: ingredients already available")
  lines.push("You still need: ingredients to purchase")

  return {
    id: crypto.randomUUID(),
    planDays: constraints.days ?? 5,
    persons: constraints.persons ?? 1,
    mealsPerDay: constraints.mealsPerDay ?? 1,
    days: daysMeals,
    preferences: {
      dietary: constraints.dietary,
      reuseIngredients: constraints.reuseIngredients ?? false,
      quickMeals: false,
    },
    constraints,
    cost: {
      additionalCost,
      totalCost: 0,
      coveredByPantry: 0,
    },
    summary: lines.join("\n"),
  }
}