import type { Metadata } from "next"

import {
  listPublishedRecipes,
  type RecipeListParams,
} from "@/features/recipes/data"
import { RecipesPage } from "@/features/recipes/components/recipes-page"

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Browse recipe ideas built from the same ingredients SmartCart AI stocks, with full instructions and grocery lists.",
}

type RecipesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export default async function RecipesIndex({ searchParams }: RecipesPageProps) {
  const params = await searchParams

  const difficulty = first(params.difficulty)
  const validDifficulty: RecipeListParams["difficulty"] =
    difficulty === "EASY" || difficulty === "MEDIUM" || difficulty === "HARD"
      ? difficulty
      : null

  const page = Math.max(1, Number(first(params.page)) || 1)
  const sort = first(params.sort)
  const validSort: RecipeListParams["sort"] =
    sort === "title" ? "title" : "createdAt"

  const data = await listPublishedRecipes({
    difficulty: validDifficulty,
    sort: validSort,
    page,
  })

  return <RecipesPage data={data} params={{ difficulty: validDifficulty, sort: validSort }} />
}