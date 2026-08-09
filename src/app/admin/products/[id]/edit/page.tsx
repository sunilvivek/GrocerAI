import { notFound } from "next/navigation"

import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { getProduct } from "@/features/admin/products/data"
import { ProductForm } from "@/features/admin/products/components/product-form"

export const metadata = { title: "Edit product" }

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin()
  const { id } = await params

  const product = await getProduct(id)
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <AdminBreadcrumbs segments={["products", "edit"]} overrides={{ edit: product.name }} />
        <h1 className="text-2xl font-bold tracking-tight">Edit product</h1>
        <p className="text-sm text-muted-foreground">Update the product details below.</p>
      </div>
      <ProductForm
        mode="edit"
        productId={product.id}
        initial={{
          name: product.name,
          slug: product.slug,
          sku: product.sku ?? "",
          description: product.description ?? "",
          brand: product.brand ?? "",
          categoryId: product.categoryId,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          stock: product.stock,
          unit: product.unit,
          unitAmount: Number(product.unitAmount),
          image: product.image ?? "",
          servingSize: product.servingSize ?? "",
          calories: product.calories,
          proteinGrams: product.proteinGrams,
          carbsGrams: product.carbsGrams,
          fatGrams: product.fatGrams,
          fiberGrams: product.fiberGrams,
          sugarGrams: product.sugarGrams,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: product.tags,
        }}
      />
    </div>
  )
}
