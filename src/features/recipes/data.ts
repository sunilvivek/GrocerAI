import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const RECIPE_PAGE_SIZE = 9

export const RECIPE_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const

export type RecipeDifficulty = (typeof RECIPE_DIFFICULTIES)[number] | null

export interface RecipeListParams {
  difficulty?: RecipeDifficulty
  sort?: "title" | "createdAt"
  order?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export async function listPublishedRecipes({
  difficulty,
  sort = "createdAt",
  order = "desc",
  page = 1,
  pageSize = RECIPE_PAGE_SIZE,
}: RecipeListParams = {}) {
  const where: Prisma.RecipeWhereInput = {
    isPublished: true,
    ...(difficulty ? { difficulty } : {}),
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

export type RecipeListResult = Awaited<ReturnType<typeof listPublishedRecipes>>

export async function getPublishedRecipe(slug: string) {
  return prisma.recipe.findFirst({
    where: { slug, isPublished: true },
    include: {
      ingredients: {
        include: { ingredient: { select: { id: true, name: true, unit: true } } },
        orderBy: { ingredient: { name: "asc" } },
      },
      _count: { select: { favorites: true } },
    },
  })
}