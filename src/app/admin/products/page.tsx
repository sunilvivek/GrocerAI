import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/features/auth/server"
import { AdminBreadcrumbs } from "@/features/admin/components/breadcrumbs"
import { listProducts, PRODUCT_PAGE_SIZE } from "@/features/admin/products/data"

import { ProductsTable } from "@/features/admin/products/components/products-table"
import { ProductsToolbar } from "@/features/admin/products/components/products-toolbar"
import { ProductsPagination } from "@/features/admin/products/components/products-pagination"

export const metadata = { title: "Products" }

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    status?: string
    sort?: string
    order?: string
    page?: string
  }>
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  await requireAdmin()
  const params = await searchParams

  const result = await listProducts({
    search: params.search?.trim() || undefined,
    categoryId: params.categoryId || undefined,
    status: params.status === "active" || params.status === "inactive" ? params.status : undefined,
    sort: (params.sort as "name" | "price" | "stock" | "createdAt") || "createdAt",
    order: params.order === "asc" ? "asc" : "desc",
    page: Math.max(1, Number(params.page) || 1),
    pageSize: PRODUCT_PAGE_SIZE,
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <AdminBreadcrumbs segments={["products"]} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.total} product{result.total === 1 ? "" : "s"} in the catalog
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus aria-hidden /> New product
          </Link>
        </Button>
      </div>

      <ProductsToolbar
        initialCategoryId={params.categoryId}
        initialSearch={params.search ?? ""}
      />

      <ProductsTable
        products={result.products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          image: product.image,
          category: product.category.name,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          stock: product.stock,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }))}
      />

      <ProductsPagination
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
      />
    </div>
  )
}
