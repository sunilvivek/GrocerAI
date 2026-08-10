import type {
  Category,
  Ingredient,
  Product,
  Recipe,
  RecipeIngredient,
} from "@prisma/client"

type ProductForEmbedding = Pick<
  Product,
  | "name"
  | "description"
  | "brand"
  | "unit"
  | "servingSize"
  | "calories"
  | "proteinGrams"
  | "carbsGrams"
  | "fatGrams"
  | "fiberGrams"
  | "sugarGrams"
  | "tags"
> & {
  category?: Pick<Category, "name"> | null
}

type RecipeIngredientForEmbedding = Pick<RecipeIngredient, "quantity" | "unit" | "note"> & {
  ingredient: Pick<Ingredient, "name">
}

type RecipeForEmbedding = Pick<
  Recipe,
  "title" | "description" | "cuisine" | "tags"
> & {
  ingredients?: RecipeIngredientForEmbedding[]
}

/**
 * Builds the text document used to embed a product. Combines the fields that
 * matter for retrieval: name, category, brand, attributes, and nutrition.
 */
export function buildProductDocument(product: ProductForEmbedding): string {
  const parts: string[] = [product.name.trim()]

  if (product.category?.name) parts.push(`category: ${product.category.name.trim()}`)
  if (product.brand) parts.push(`brand: ${product.brand.trim()}`)
  if (product.description) parts.push(product.description.trim())
  if (product.tags.length > 0) parts.push(`tags: ${product.tags.join(", ")}`)
  if (product.unit && product.unit !== "each") parts.push(`sold by ${product.unit}`)

  const nutrition: string[] = []
  if (product.calories) nutrition.push(`${product.calories} calories`)
  if (product.proteinGrams) nutrition.push(`${product.proteinGrams}g protein`)
  if (product.carbsGrams) nutrition.push(`${product.carbsGrams}g carbs`)
  if (product.fatGrams) nutrition.push(`${product.fatGrams}g fat`)
  if (product.fiberGrams) nutrition.push(`${product.fiberGrams}g fiber`)
  if (product.sugarGrams) nutrition.push(`${product.sugarGrams}g sugar`)
  if (nutrition.length > 0) parts.push(`per ${product.servingSize ?? "serving"}: ${nutrition.join(", ")}`)

  return parts.filter(Boolean).join(". ")
}

/**
 * Builds the text document used to embed a recipe. Includes the title,
 * cuisine, description, tags, and the names of the ingredients used.
 */
export function buildRecipeDocument(recipe: RecipeForEmbedding): string {
  const parts: string[] = [recipe.title.trim()]

  if (recipe.cuisine) parts.push(`cuisine: ${recipe.cuisine.trim()}`)
  if (recipe.description) parts.push(recipe.description.trim())
  if (recipe.tags.length > 0) parts.push(`tags: ${recipe.tags.join(", ")}`)

  const ingredientNames =
    recipe.ingredients?.map((item) => item.ingredient.name.trim()) ?? []
  if (ingredientNames.length > 0) parts.push(`ingredients: ${ingredientNames.join(", ")}`)

  return parts.filter(Boolean).join(". ")
}