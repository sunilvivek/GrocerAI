/// <reference types="next" />
/// <reference types="react" />

/**
 * Core domain types for the ingredient-aware meal planner.
 *
 * These types separate the following concepts:
 * - PANTRY INGREDIENT: what the user already has (by name)
 * - RECIPE INGREDIENT: what a recipe requires
 * - CART PRODUCT: a purchasable grocery product
 * - GROCERY PRODUCT: a product in the catalog
 * - MEAL: a planned dish for a specific day
 *
 * Do NOT treat these as the same entity. The planner translates between
 * them at the appropriate layer.
 */

/**
 * Number of days for the meal plan.
 */
export type MealPlanDays = number

/**
 * Number of people the plan should feed.
 */
export type MealPlanPersons = number

/**
 * Meals per day for the plan.
 */
export type MealsPerDay = number

/**
 * dietary preference filter.
 */
export type DietaryPreference = "none" | "vegetarian" | "vegan" | "halal" | "kosher" | "other"

/**
 * Maximum cooking time in minutes for a recipe to be considered.
 */
export type MaxCookingTime = number

/**
 * Budget for additional grocery purchases, in rupees.
 */
export type Budget = number

/**
 * Ingredient as it exists in the user's pantry.
 * Distinct from a Recipe Ingredient — the planner translates between them.
 */
export type AvailableIngredient = {
  name: string
  /** Normalized name (lowercase, trimmed). */
  normalized: string
  /** Optional quantity the user has, if known. */
  quantity?: number
  /** Optional unit the user has (e.g. "cup", "kg", "pcs"). */
  unit?: string
}

/**
 * Ingredient required by a recipe.
 * Distinct from a Pantry Ingredient — the planner translates between them.
 */
export type RecipeIngredient = {
  name: string
  /** Normalized name. */
  normalized: string
  /** Required quantity. */
  quantity: number
  /** Required unit (e.g. "cup", "kg", "pcs"). */
  unit: string
}

/**
 * Ingredient missing from the user's pantry to complete a recipe.
 */
export type MissingIngredient = {
  name: string
  /** Normalized name. */
  normalized: string
  /** Required quantity from the recipe. */
  required: number
  /** Available quantity from the user's pantry, if known. */
  available?: number
  /** Missing quantity = required - available. */
  missing: number
}

/**
 * A published recipe from the catalog.
 * Matches the Prisma Recipe model shape for ingredient coverage scoring.
 */
export type Recipe = {
  id: string
  title: string
  slug?: string
  description?: string
  cuisine?: string
  difficulty?: "EASY" | "MEDIUM" | "HARD"
  prepTimeMinutes?: number
  cookTimeMinutes?: number
  servings?: number
  caloriesPerServing?: number
  tags?: string[]
  image?: string
  ingredients: RecipeIngredient[]
}

/**
 * Preferences that influence meal selection.
 */
export type MealPlanPreferences = {
  /** Dietary preference filter. */
  dietary: DietaryPreference
  /** True if the planner should favor recipes that reuse ingredients
   * across multiple meals in the plan. */
  reuseIngredients: boolean
  /** True if the planner should favor recipes with shorter cooking times. */
  quickMeals: boolean
}

/**
 * Constraints that limit meal selection.
 */
export type MealPlanConstraint = {
  /** Maximum number of days. */
  maxDays?: MealPlanDays
  /** Maximum number of people. */
  maxPersons?: MealPlanPersons
  /** Meals per day. */
  mealsPerDay?: MealsPerDay
  /** Maximum total cooking time per recipe in minutes. */
  maxCookingTime?: MaxCookingTime
  /** Budget for additional grocery purchases. */
  budget?: Budget
}

/**
 * Cost breakdown for the meal plan.
 */
export type MealPlanCost = {
  /** Additional grocery cost estimate, in rupees. */
  additionalCost: number
  /** Total recipe cost if all ingredients were purchased. */
  totalCost: number
  /** Cost covered by existing pantry ingredients. */
  coveredByPantry: number
}

/**
 * A full meal plan response.
 */
export type MealPlanResponse = {
  /** Unique identifier for the plan. */
  id: string
  /** Number of days. */
  planDays: MealPlanDays
  /** Number of people fed. */
  persons: MealPlanPersons
  /** Meals per day. */
  mealsPerDay: MealsPerDay
  /** Meal plan days. */
  days: MealPlanDay[]
  /** Preferences that influenced selection. */
  preferences: MealPlanPreferences
  /** Constraints that were applied. */
  constraints: MealPlanConstraint
  /** Cost breakdown. */
  cost: MealPlanCost
  /** Human-readable summary. */
  summary: string
}

/**
 * A single day within a meal plan.
 */
export type MealPlanDay = {
  /** Day number (1-indexed). */
  day: number
  /** Meals for this day. */
  meals: Meal[]
}

/**
 * A single meal within a plan day.
 */
export type Meal = {
  /** Unique dish identifier. */
  id: string
  /** Recipe title. */
  title: string
  /** Recipe description, if available. */
  description?: string
  /** Cuisine type, if available. */
  cuisine?: string
  /** Difficulty level. */
  difficulty?: "EASY" | "MEDIUM" | "HARD"
  /** Prep time in minutes. */
  prepTimeMinutes: number
  /** Cook time in minutes. */
  cookTimeMinutes: number
  /** Total time in minutes. */
  totalTimeMinutes: number
  /** Number of servings. */
  servings: number
  /** List of recipe ingredients the planner selected. */
  selectedRecipeIngredients: RecipeIngredient[]
  /** List of ingredients the user already has for this meal. */
  availableIngredients: AvailableIngredient[]
  /** List of ingredients still missing for this meal. */
  missingIngredients: MissingIngredient[]
  /** Human-readable instructions. */
  instructions: string[]
  /** Estimated cost for missing ingredients. */
  missingCost: number
}

/**
 * Parsed natural-language meal request constraints.
 *
 * Converted from user prompts like:
 * "I have rice, eggs and tomatoes. Plan 5 dinners."
 */
export type MealPlanConstraints = {
  /** Number of days to plan. */
  days: MealPlanDays
  /** Number of people to feed. */
  persons: MealPlanPersons
  /** Meals per day. */
  mealsPerDay: MealsPerDay
  /** Available ingredients from the user's pantry. */
  availableIngredients: AvailableIngredient[]
  /** Dietary preference filter. */
  dietary: DietaryPreference
  /** Maximum cooking time per recipe in minutes. */
  maxCookingTime: MaxCookingTime
  /** Budget for additional grocery purchases. */
  budget?: Budget
  /** True if the user wants to reuse ingredients across meals. */
  reuseIngredients: boolean
}

/**
 * A meal suggestion with coverage analysis.
 *
 * Shows how many available ingredients are used vs. required.
 */
export type MealSuggestion = {
  /** The recipe title. */
  title: string
  /** Selected recipe ingredients. */
  selectedRecipeIngredients: RecipeIngredient[]
  /** Available ingredients from the user's pantry. */
  availableIngredients: AvailableIngredient[]
  /** Missing ingredients needed. */
  missingIngredients: MissingIngredient[]
  /** Coverage score: available / required (0-1). */
  coverage: number
  /** Estimated cost for missing ingredients. */
  cost: number
  /** Why this recipe was selected (which available ingredients it uses). */
  rationale: string
}