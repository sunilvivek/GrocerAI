import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { listRecipes } from "@/features/admin/recipes/data"

import { RecipesTable } from "@/features/admin/recipes/components/recipes-table"
import { RecipesToolbar } from "@/features/admin/recipes/components/recipes-toolbar"
import { RecipesPagination } from "@/features/admin/recipes/components/recipes-pagination"

export const metadata = { title: "Recipes" }

interface AdminRecipesPageProps {
  searchParams: Promise<{
    search?: string
    difficulty?: string
    published?: string
    page?: string
  }>
}

export default async function AdminRecipesPage({ searchParams }: AdminRecipesPageProps) {
  await requireAdmin()
  const params = await searchParams

  const result = await listRecipes({
    search: params.search?.trim() || undefined,
    difficulty: params.difficulty || undefined,
    published:
      params.published === "true" ? true : params.published === "false" ? false : undefined,
    page: Math.max(1, Number(params.page) || 1),
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <AdminBreadcrumbs segments={["recipes"]} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recipes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.total} recipe{result.total === 1 ? "" : "s"} in the catalog
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/recipes/new">
            <Plus aria-hidden /> New recipe
          </Link>
        </Button>
      </div>

      <RecipesToolbar initialSearch={params.search ?? ""} />

      <RecipesTable
        recipes={result.recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          slug: recipe.slug,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine,
          servings: recipe.servings,
          isPublished: recipe.isPublished,
          ingredientCount: recipe._count.ingredients,
        }))}
      />

      <RecipesPagination
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
      />
    </div>
  )
}
