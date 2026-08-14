"use client"

import { ChevronLeft, ChevronRight, Soup } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  RECIPE_DIFFICULTIES,
  type RecipeListParams,
  type RecipeListResult,
} from "@/features/recipes/data"

import { RecipeCard } from "@/features/recipes/components/recipe-card"

interface RecipesPageProps {
  data: RecipeListResult
  params: RecipeListParams
}

export function RecipesPage({ data, params }: RecipesPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function update(updates: Record<string, string | null>) {
    const url = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") url.delete(key)
      else url.set(key, value)
    }
    url.delete("page")
    router.push(`${pathname}?${url.toString()}`)
  }

  function goTo(targetPage: number) {
    const url = new URLSearchParams(searchParams)
    url.set("page", String(targetPage))
    router.push(`${pathname}?${url.toString()}`)
  }

  const { recipes, total, page, totalPages } = data

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Recipe ideas from your store
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Browse recipes built from the same ingredients we stock. Every dish
          comes with full instructions and a grocery list.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Difficulty
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => update({ difficulty: null })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                    !params.difficulty
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/80 hover:border-ring",
                  )}
                >
                  All
                </button>
                {RECIPE_DIFFICULTIES.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => update({ difficulty })}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                      params.difficulty === difficulty
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground/80 hover:border-ring",
                    )}
                  >
                    {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex flex-col gap-6">
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Soup className="size-8 text-muted-foreground" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold">No recipes found</h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                  No recipes match the current filters. Try clearing the
                  difficulty.
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push(pathname)}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {total}
                  </span>{" "}
                  recipes
                </p>
                <Select
                  value={params.sort ?? "createdAt"}
                  onChange={(event) => update({ sort: event.target.value })}
                  aria-label="Sort recipes"
                  className="w-44"
                >
                  <option value="createdAt">Newest</option>
                  <option value="title">Title A–Z</option>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => goTo(page - 1)}
                    >
                      <ChevronLeft aria-hidden /> Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => goTo(page + 1)}
                    >
                      Next <ChevronRight aria-hidden />
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}