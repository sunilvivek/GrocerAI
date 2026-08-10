import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { RecipeForm } from "@/features/admin/recipes/components/recipe-form"

export const metadata = { title: "New recipe" }

export default async function NewRecipePage() {
  await requireAdmin()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminBreadcrumbs segments={["recipes", "new"]} />
        <h1 className="text-2xl font-bold tracking-tight">New recipe</h1>
        <p className="text-sm text-muted-foreground">
          Add a recipe. Ingredients are linked to the existing catalog.
        </p>
      </div>
      <RecipeForm mode="create" />
    </div>
  )
}
