import { notFound } from "next/navigation"

import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { getRecipe } from "@/features/admin/recipes/data"
import { RecipeForm } from "@/features/admin/recipes/components/recipe-form"

export const metadata = { title: "Edit recipe" }

interface EditRecipePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  await requireAdmin()
  const { id } = await params

  const recipe = await getRecipe(id)
  if (!recipe) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminBreadcrumbs segments={["recipes", "edit"]} overrides={{ edit: recipe.title }} />
        <h1 className="text-2xl font-bold tracking-tight">Edit recipe</h1>
        <p className="text-sm text-muted-foreground">Update the recipe details below.</p>
      </div>
      <RecipeForm
        mode="edit"
        recipeId={recipe.id}
        initial={{
          title: recipe.title,
          slug: recipe.slug,
          description: recipe.description ?? "",
          image: recipe.image ?? "",
          cuisine: recipe.cuisine ?? "",
          servings: recipe.servings,
          prepTimeMinutes: recipe.prepTimeMinutes,
          cookTimeMinutes: recipe.cookTimeMinutes,
          difficulty: recipe.difficulty,
          caloriesPerServing: recipe.caloriesPerServing,
          tags: recipe.tags,
          instructions: recipe.instructions,
          isPublished: recipe.isPublished,
          ingredients: recipe.ingredients.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: Number(item.quantity),
            unit: item.unit,
            note: item.note ?? "",
          })),
        }}
      />
    </div>
  )
}
