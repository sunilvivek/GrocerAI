"use client"

import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"

export interface RecipeRow {
  id: string
  title: string
  slug: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  cuisine: string | null
  servings: number
  isPublished: boolean
  ingredientCount: number
}

interface RecipesTableProps {
  recipes: RecipeRow[]
}

const DIFFICULTY_LABEL: Record<RecipeRow["difficulty"], string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
}

export function RecipesTable({ recipes }: RecipesTableProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<RecipeRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleToggle(recipe: RecipeRow) {
    const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !recipe.isPublished }),
    })
    if (response.ok) router.refresh()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/recipes/${deleteTarget.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        alert(data?.error?.message ?? "Could not delete the recipe.")
      } else {
        router.refresh()
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No recipes match your filters.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/recipes/new">Create a recipe</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Recipe</th>
                <th className="px-4 py-3 font-medium">Difficulty</th>
                <th className="px-4 py-3 font-medium">Cuisine</th>
                <th className="px-4 py-3 font-medium">Ingredients</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/recipes/${recipe.id}/edit`}
                      className="block font-medium hover:underline"
                    >
                      {recipe.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {recipe.slug} · {recipe.servings} servings
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{DIFFICULTY_LABEL[recipe.difficulty]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{recipe.cuisine ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{recipe.ingredientCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={recipe.isPublished}
                        onCheckedChange={() => handleToggle(recipe)}
                        aria-label={`${recipe.isPublished ? "Unpublish" : "Publish"} ${recipe.title}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {recipe.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${recipe.title}`}>
                        <Link href={`/admin/recipes/${recipe.id}/edit`}>
                          <Pencil aria-hidden />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${recipe.title}`}
                        onClick={() => setDeleteTarget(recipe)}
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
        title={`Delete ${deleteTarget?.title ?? "recipe"}?`}
        description="This permanently removes the recipe and its ingredient links."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
