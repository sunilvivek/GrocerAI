import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import type { RecipeValues } from "@/features/admin/recipes/validators"

export interface RecipeListParams {
  search?: string
  difficulty?: string
  published?: boolean
  sort?: "title" | "difficulty" | "createdAt"
  order?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export const RECIPE_PAGE_SIZE = 20

export async function listRecipes({
  search,
  difficulty,
  published,
  sort = "createdAt",
  order = "desc",
  page = 1,
  pageSize = RECIPE_PAGE_SIZE,
}: RecipeListParams = {}) {
  const where: Prisma.RecipeWhereInput = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(difficulty ? { difficulty: difficulty as "EASY" | "MEDIUM" | "HARD" } : {}),
    ...(published !== undefined ? { isPublished: published } : {}),
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { _count: { select: { ingredients: true } } },
    }),
    prisma.recipe.count({ where }),
  ])

  return {
    recipes,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getRecipe(id: string) {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: { ingredient: { select: { id: true, name: true, unit: true } } },
        orderBy: { ingredient: { name: "asc" } },
      },
    },
  })
}

export async function createRecipe(values: RecipeValues) {
  const { ingredients, ...recipe } = values

  return prisma.recipe.create({
    data: {
      title: recipe.title,
      slug: recipe.slug,
      description: recipe.description || null,
      image: recipe.image || null,
      cuisine: recipe.cuisine || null,
      servings: recipe.servings,
      prepTimeMinutes: recipe.prepTimeMinutes,
      cookTimeMinutes: recipe.cookTimeMinutes,
      difficulty: recipe.difficulty,
      caloriesPerServing: recipe.caloriesPerServing,
      tags: recipe.tags,
      instructions: recipe.instructions,
      isPublished: recipe.isPublished,
      ingredients: {
        create: ingredients.map((item) => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          note: item.note || null,
        })),
      },
    },
  })
}

export async function updateRecipe(id: string, values: RecipeValues) {
  const { ingredients, ...recipe } = values

  return prisma.$transaction(async (tx) => {
    await tx.recipeIngredient.deleteMany({ where: { recipeId: id } })

    return tx.recipe.update({
      where: { id },
      data: {
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description || null,
        image: recipe.image || null,
        cuisine: recipe.cuisine || null,
        servings: recipe.servings,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        difficulty: recipe.difficulty,
        caloriesPerServing: recipe.caloriesPerServing,
        tags: recipe.tags,
        instructions: recipe.instructions,
        isPublished: recipe.isPublished,
        ingredients: {
          create: ingredients.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unit: item.unit,
            note: item.note || null,
          })),
        },
      },
    })
  })
}

export async function deleteRecipe(id: string) {
  return prisma.recipe.delete({ where: { id } })
}

export async function setRecipePublished(id: string, isPublished: boolean) {
  return prisma.recipe.update({ where: { id }, data: { isPublished } })
}

export async function listIngredients() {
  return prisma.ingredient.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, unit: true },
  })
}

export async function recipeSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.recipe.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  })
  return Boolean(existing)
}
