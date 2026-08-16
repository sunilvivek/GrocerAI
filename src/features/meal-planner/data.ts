import type { Prisma } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const RECIPE_PAGE_SIZE = 20

export async function listPublishedRecipes(
  params?: {
    difficulty?: "EASY" | "MEDIUM" | "HARD"
    sort?: "title" | "createdAt"
    order?: "asc" | "desc"
    page?: number
    pageSize?: number
  },
) {
  const where: Prisma.RecipeWhereInput = { isPublished: true }

  if (params?.difficulty) {
    where.difficulty = params.difficulty
  }

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      orderBy: { [params?.sort ?? "createdAt"]: params?.order ?? "desc" },
      skip: (params?.page ?? 1 - 1) * (params?.pageSize ?? RECIPE_PAGE_SIZE),
      take: params?.pageSize ?? RECIPE_PAGE_SIZE,
      include: { _count: { select: { ingredients: true } } },
    }),
    prisma.recipe.count({ where }),
  ])

  return { recipes, total }
}