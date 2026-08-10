"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"

import { CategoryFormDialog } from "@/features/admin/categories/components/category-form-dialog"

export interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  isActive: boolean
  productCount: number
}

interface CategoriesTableProps {
  categories: CategoryRow[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editTarget, setEditTarget] = useState<CategoryRow | null>(null)

  async function handleToggle(category: CategoryRow) {
    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: category.name,
        slug: category.slug,
        description: category.description ?? "",
        sortOrder: category.sortOrder,
        isActive: !category.isActive,
      }),
    })
    if (response.ok) router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        alert(data?.error?.message ?? "Could not delete the category.")
      } else {
        router.refresh()
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      /{category.slug}
                      {category.description ? ` · ${category.description}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={() => handleToggle(category)}
                        aria-label={`${category.isActive ? "Deactivate" : "Activate"} ${category.name}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => setEditTarget(category)}
                      >
                        <Pencil aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${category.name}`}
                        onClick={() => setDeleteTarget(category)}
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

      {editTarget ? (
        <CategoryFormDialog
          mode="edit"
          category={{
            id: editTarget.id,
            name: editTarget.name,
            slug: editTarget.slug,
            description: editTarget.description ?? "",
            sortOrder: editTarget.sortOrder,
            isActive: editTarget.isActive,
          }}
        />
      ) : null}

      <ConfirmationDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title={`Delete ${deleteTarget?.name ?? "category"}?`}
        description="This permanently removes the category."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
