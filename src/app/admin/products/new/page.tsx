import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { ProductForm } from "@/features/admin/products/components/product-form"

export const metadata = { title: "New product" }

export default async function NewProductPage() {
  await requireAdmin()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminBreadcrumbs segments={["products", "new"]} />
        <h1 className="text-2xl font-bold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">
          Add a product to the catalog. Required fields are validated on save.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  )
}
