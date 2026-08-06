import type { RecipeDifficulty } from "@prisma/client"

export interface CategorySeed {
  name: string
  slug: string
  description: string
  sortOrder: number
}

export interface ProductNutritionSeed {
  servingSize: string
  calories: number
  proteinGrams: number
  carbsGrams: number
  fatGrams: number
  fiberGrams: number
  sugarGrams: number
}

export interface ProductSeed {
  name: string
  categorySlug: string
  description: string
  brand?: string
  price: number
  compareAtPrice?: number
  unit: string
  unitAmount: number
  stock: number
  isFeatured?: boolean
  rating: number
  reviewCount: number
  tags: string[]
  nutrition: ProductNutritionSeed
}

export interface IngredientSeed {
  name: string
  category?: string
  unit: string
}

export interface RecipeIngredientSeed {
  ingredientName: string
  quantity: number
  unit?: string
  note?: string
}

export interface RecipeSeed {
  title: string
  description: string
  servings: number
  prepTimeMinutes: number
  cookTimeMinutes: number
  difficulty: RecipeDifficulty
  caloriesPerServing: number
  tags: string[]
  ingredients: RecipeIngredientSeed[]
}
