import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { listCategoriesAdmin } from "@/features/admin/categories/data"

import { CategoriesTable } from "@/features/admin/categories/components/categories-table"
import { CategoryFormDialog } from "@/features/admin/categories/components/category-form-dialog"

export const metadata = { title: "Categories" }

export default async function AdminCategoriesPage() {
  await requireAdmin()
  const categories = await listCategoriesAdmin()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <AdminBreadcrumbs segments={["categories"]} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {categories.length} categor{categories.length === 1 ? "y" : "ies"} in the catalog
            </p>
          </div>
        </div>
        <CategoryFormDialog mode="create">
          <Button>
            <Plus aria-hidden /> New category
          </Button>
        </CategoryFormDialog>
      </div>

      <CategoriesTable
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
          productCount: category._count.products,
        }))}
      />
    </div>
  )
}
