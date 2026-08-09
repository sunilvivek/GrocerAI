"use client"

import { Search, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTransition } from "react"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ProductsToolbarProps {
  initialCategoryId?: string
  initialSearch?: string
}

export function ProductsToolbar({ initialCategoryId, initialSearch }: ProductsToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(initialSearch ?? "")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch ?? "")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]))
  }, [])

  function apply(params: { search?: string; categoryId?: string; status?: string; sort?: string; order?: string }) {
    const url = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(params)) {
      if (value) url.set(key, value)
      else url.delete(key)
    }
    url.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${url.toString()}`)
    })
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
          placeholder="Search by name, slug or SKU…"
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
          value={initialCategoryId ?? ""}
          onChange={(event) => apply({ categoryId: event.target.value })}
          aria-label="Filter by category"
          className="w-44"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(event) => apply({ status: event.target.value })}
          aria-label="Filter by status"
          className="w-36"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <Select
          defaultValue={searchParams.get("sort") ?? "createdAt"}
          onChange={(event) => apply({ sort: event.target.value })}
          aria-label="Sort by"
          className="w-36"
        >
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="stock">Stock</option>
        </Select>

        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            router.push("/admin/products")
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
