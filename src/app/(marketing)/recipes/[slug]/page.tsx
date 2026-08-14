import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getPublishedRecipe } from "@/features/recipes/data"
import { RecipeDetail } from "@/features/recipes/components/recipe-detail"

type RecipeSlugPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: RecipeSlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getPublishedRecipe(slug)

  if (!recipe) return { title: "Recipe not found" }

  return {
    title: recipe.title,
    description: recipe.description ?? undefined,
  }
}

export default async function RecipeSlugPage({ params }: RecipeSlugPageProps) {
  const { slug } = await params
  const recipe = await getPublishedRecipe(slug)

  if (!recipe) notFound()

  return <RecipeDetail recipe={recipe} />
}