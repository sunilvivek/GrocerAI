import { PrismaClient } from "@prisma/client"

import { categories } from "./data/categories"
import { ingredients } from "./data/ingredients"
import { products } from "./data/products"
import { recipes } from "./data/recipes"

const prisma = new PrismaClient()

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function productImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/600/600`
}

function recipeImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/800/500`
}

async function main() {
  console.log("Seeding GrocerAI catalog…")

  // Categories ---------------------------------------------------------------
  const categoryBySlug = new Map<string, string>()
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: productImage(`category-${category.slug}`),
        sortOrder: category.sortOrder,
      },
    })
    categoryBySlug.set(category.slug, record.id)
  }
  console.log(`  categories: ${categoryBySlug.size}`)

  // Ingredients ----------------------------------------------------------------
  const ingredientBySlug = new Map<string, string>()
  for (const ingredient of ingredients) {
    const slug = slugify(ingredient.name)
    const record = await prisma.ingredient.upsert({
      where: { slug },
      update: { category: ingredient.category, unit: ingredient.unit },
      create: {
        name: ingredient.name,
        slug,
        category: ingredient.category,
        unit: ingredient.unit,
      },
    })
    ingredientBySlug.set(slug, record.id)
  }
  console.log(`  ingredients: ${ingredientBySlug.size}`)

  // Products -------------------------------------------------------------------
  let featured = 0
  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug)
    if (!categoryId) {
      console.warn(`  skip product "${product.name}": unknown category ${product.categorySlug}`)
      continue
    }
    const slug = slugify(product.name)
    const record = await prisma.product.upsert({
      where: { slug },
      update: {
        name: product.name,
        categoryId,
        description: product.description,
        brand: product.brand,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        unit: product.unit,
        unitAmount: product.unitAmount,
        stock: product.stock,
        isFeatured: product.isFeatured ?? false,
        isActive: true,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags,
        servingSize: product.nutrition.servingSize,
        calories: product.nutrition.calories,
        proteinGrams: product.nutrition.proteinGrams,
        carbsGrams: product.nutrition.carbsGrams,
        fatGrams: product.nutrition.fatGrams,
        fiberGrams: product.nutrition.fiberGrams,
        sugarGrams: product.nutrition.sugarGrams,
      },
      create: {
        name: product.name,
        slug,
        categoryId,
        description: product.description,
        brand: product.brand,
        image: productImage(slug),
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        unit: product.unit,
        unitAmount: product.unitAmount,
        stock: product.stock,
        isFeatured: product.isFeatured ?? false,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags,
        servingSize: product.nutrition.servingSize,
        calories: product.nutrition.calories,
        proteinGrams: product.nutrition.proteinGrams,
        carbsGrams: product.nutrition.carbsGrams,
        fatGrams: product.nutrition.fatGrams,
        fiberGrams: product.nutrition.fiberGrams,
        sugarGrams: product.nutrition.sugarGrams,
      },
    })
    if (record.isFeatured) featured += 1
  }
  console.log(`  products: ${products.length} (${featured} featured)`)

  // Recipes ----------------------------------------------------------------------
  let linked = 0
  for (const recipe of recipes) {
    const slug = slugify(recipe.title)
    const recipeRecord = await prisma.recipe.upsert({
      where: { slug },
      update: {
        title: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        difficulty: recipe.difficulty,
        caloriesPerServing: recipe.caloriesPerServing,
        tags: recipe.tags,
        isPublished: true,
      },
      create: {
        title: recipe.title,
        slug,
        description: recipe.description,
        image: recipeImage(slug),
        servings: recipe.servings,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        difficulty: recipe.difficulty,
        caloriesPerServing: recipe.caloriesPerServing,
        tags: recipe.tags,
      },
    })

    for (const item of recipe.ingredients) {
      const ingredientId = ingredientBySlug.get(slugify(item.ingredientName))
      if (!ingredientId) {
        console.warn(
          `  skip recipe ingredient "${item.ingredientName}" in "${recipe.title}": not found`,
        )
        continue
      }
      const unit = item.unit ?? "whole"
      await prisma.recipeIngredient.upsert({
        where: {
          recipeId_ingredientId: {
            recipeId: recipeRecord.id,
            ingredientId,
          },
        },
        update: {
          quantity: item.quantity,
          unit,
          note: item.note,
        },
        create: {
          recipeId: recipeRecord.id,
          ingredientId,
          quantity: item.quantity,
          unit,
          note: item.note,
        },
      })
      linked += 1
    }
  }
  console.log(`  recipes: ${recipes.length} (${linked} recipe ingredients)`)

  console.log("Seed complete.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
