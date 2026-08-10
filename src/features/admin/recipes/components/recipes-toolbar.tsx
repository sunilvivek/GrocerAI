"use client"

import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface RecipesToolbarProps {
  initialSearch?: string
}

export function RecipesToolbar({ initialSearch }: RecipesToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialSearch ?? "")
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch ?? "")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  function apply(params: { search?: string; difficulty?: string; published?: string }) {
    const url = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(params)) {
      if (value) url.set(key, value)
      else url.delete(key)
    }
    url.delete("page")
    router.push(`${pathname}?${url.toString()}`)
  }

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      apply({ search: debouncedSearch })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search recipes…"
          className="pl-8 pr-8"
        />
        {search ? (
          <button
            type="button"
            onClick={() => {
              setSearch("")
              apply({ search: "" })
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          defaultValue={searchParams.get("difficulty") ?? ""}
          onChange={(event) => apply({ difficulty: event.target.value })}
          aria-label="Filter by difficulty"
          className="w-36"
        >
          <option value="">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </Select>

        <Select
          defaultValue={searchParams.get("published") ?? ""}
          onChange={(event) => apply({ published: event.target.value })}
          aria-label="Filter by publication status"
          className="w-36"
        >
          <option value="">All statuses</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/recipes")}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
