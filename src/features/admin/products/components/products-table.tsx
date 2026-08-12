"use client"

import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { ProductImage } from "@/components/shared/product-image"
import { formatCurrencyCompact } from "@/utils/format"

export interface ProductRow {
  id: string
  name: string
  slug: string
  sku: string | null
  image: string | null
  category: string
  price: number
  compareAtPrice: number | null
  stock: number
  isActive: boolean
  isFeatured: boolean
}

interface ProductsTableProps {
  products: ProductRow[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toggleId, setToggleId] = useState<string | null>(null)

  async function handleToggle(product: ProductRow) {
    setToggleId(product.id)
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      })
      router.refresh()
    } finally {
      setToggleId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        alert(data?.error?.message ?? "Could not delete the product.")
      } else {
        router.refresh()
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">
          No products match your filters.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products/new">Create a product</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="block truncate font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="text-muted-foreground truncate text-xs">
                          {product.sku ?? product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{product.category}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <div>
                      {formatCurrencyCompact(product.price)}
                      {product.compareAtPrice ? (
                        <span className="text-muted-foreground ml-1.5 text-xs line-through">
                          {formatCurrencyCompact(product.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <span
                      className={
                        product.stock === 0
                          ? "text-destructive"
                          : product.stock < 10
                            ? "text-amber-600 dark:text-amber-400"
                            : undefined
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isActive}
                        disabled={toggleId === product.id}
                        onCheckedChange={() => handleToggle(product)}
                        aria-label={`${product.isActive ? "Deactivate" : "Activate"} ${product.name}`}
                      />
                      <span className="text-muted-foreground text-xs">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil aria-hidden />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setDeleteTarget(product)}
                      >
                        <Trash2 aria-hidden className="text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete ${deleteTarget?.name ?? "product"}?`}
        description="This permanently removes the product from the catalog. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
