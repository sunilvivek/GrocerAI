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

// Simple ingredient pricing map (₹ per unit)
// In a full implementation, this would come from a grocery pricing service/catalog
const INGREDIENT_PRICES: Record<string, number> = {
  wheat: 20,
  flour: 20,
  rice: 50,
  sugar: 30,
  salt: 10,
  oil: 100,
  spices: 15,
  vegetables: 25,
  fruits: 30,
  meat: 400,
  chicken: 300,
  fish: 350,
  eggs: 12,
  dairy: 25,
  lentils: 80,
  onions: 10,
  tomatoes: 15,
  potatoes: 12,
  garlic: 10,
  ginger: 15,
  yogurt: 20,
  butter: 50,
  cream: 60,
}

// Calculate cost for a single missing ingredient
function missingIngredientCost(
  name: string,
  required: number,
  available: number,
): number {
  const normalized = name.toLowerCase().trim()
  const pricePerUnit = INGREDIENT_PRICES[normalized] ?? 15 // default ₹15/unit
  const toPurchase = Math.max(0, required - available)
  return Math.round(pricePerUnit * toPurchase)
}

// Calculate total cost for all missing ingredients
function calculateMissingIngredientsCost(
  missingIngredients: MissingIngredient[],
): number {
  let total = 0
  for (const mi of missingIngredients) {
    total += missingIngredientCost(mi.name, mi.required, mi.available ?? 0)
  }
  return total
}

// Generate simple cooking instructions based on recipe title
function generateCookingInstructions(title: string): string[] {
  const lower = title.toLowerCase()
  const baseInstructions: string[] = [
    "Prep all ingredients: wash, chop, and measure everything before starting.",
    "Heat oil or butter in a pan or pot over medium heat.",
    "Add aromatics (onion, garlic, ginger) and sauté until fragrant.",
    "Add main ingredients and cook until softened or changed in color.",
    "Season with spices and salt to taste.",
    "Add liquid (water, stock, or coconut milk) if needed, then simmer.",
    "Cook until ingredients are tender and flavors are blended.",
    "Serve hot with rice, bread, or as desired.",
  ]

  // Simple keyword-based variation
  if (lower.includes("curry")) {
    return [
      "Heat oil in a deep pan or kadhai.",
      "Add cumin seeds and let them splutter.",
      "Add chopped onion and sauté until golden brown.",
      "Add ginger-garlic paste and cook for 1 minute.",
      "Add tomato puree and spices; cook until oil separates.",
      "Add main ingredient (vegetable, chicken, or fish) and cook.",
      "Add water and salt; cover and simmer for 20-25 minutes.",
      "Garnish with fresh coriander and serve with rice or bread.",
    ]
  }
  if (lower.includes("rice")) {
    return [
      "Rinse the rice thoroughly until water runs clear.",
      "Add rice and water to a pot in a 1:2 ratio (1 cup rice : 2 cups water).",
      "Bring to a boil, then reduce heat to low and cover.",
      "Simmer for 15-20 minutes until water is absorbed and rice is tender.",
      "Fluff with a fork and let rest for 5 minutes before serving.",
    ]
  }
  if (lower.includes("soup")) {
    return [
      "Sauté onion, carrot, and celery in a pot with oil until soft.",
      "Add stock (vegetable, chicken, or fish) and bring to a simmer.",
      "Add main ingredients (vegetables, meat, or legumes) and cook.",
      "Season with salt, pepper, and herbs to taste.",
      "Simmer for 20-30 minutes until ingredients are tender.",
      "Adjust seasoning and serve hot.",
    ]
  }
  if (lower.includes("salad")) {
    return [
      "Wash and chop all vegetables and fruits.",
      "Toss ingredients in a large bowl with dressing (oil, vinegar, herbs).",
      "Season with salt and pepper to taste.",
      "Add nuts or seeds for crunch, if desired.",
      "Serve immediately or chill until ready to eat.",
    ]
  }
  if (lower.includes("dessert")) {
    return [
      "Prepare all ingredients and measure them before starting.",
      "Mix dry ingredients (flour, sugar, cocoa, baking powder) in a bowl.",
      "Mix wet ingredients (eggs, milk, oil, vanilla) in a separate bowl.",
      "Combine wet and dry ingredients, stirring until just combined.",
      "Pour batter into a greased pan and bake at the specified temperature.",
      "Test doneness with a toothpick; it should come out clean.",
      "Cool slightly before serving.",
    ]
  }

  return baseInstructions
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

  // Step 2.5: Track ingredient coverage per day and accumulate costs
  const dayCoverage: number[] = new Array(daysCount).fill(0)
  let totalMissingCost = 0

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

    // Calculate missing ingredients cost for this recipe
    const recipeMissingCost = calculateMissingIngredientsCost(
      recipe.missingIngredients,
    )
    totalMissingCost += recipeMissingCost

    // Generate cooking instructions for this recipe
    const instructions = generateCookingInstructions(recipe.title)

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
      missingIngredients: recipe.missingIngredients,
      instructions,
      missingCost: recipeMissingCost,
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

  const additionalCost = totalMissingCost
  const totalCost = additionalCost // in this plan, additional = total since pantry is separate
  const coveredByPantry = 0 // placeholder - Phase 9

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
      totalCost,
      coveredByPantry,
    },
    summary: lines.join("\n"),
  }
}