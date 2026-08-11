"use client"

import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import type { SearchResponse } from "@/lib/search/domain"
import { SEARCH_SORT_OPTIONS } from "@/lib/search/validation"

import { ProductCard } from "@/features/search/components/product-card"

interface SearchResultsProps {
  data: SearchResponse
}

export function SearchResults({ data }: SearchResultsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { results, total, page, pageSize, totalPages, query } = data

  function update(params: Record<string, string | null>) {
    const url = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(params)) {
      if (value === null) url.delete(key)
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

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <PackageSearch className="size-8 text-muted-foreground" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {query.q
              ? `Nothing matched "${query.q}". Try a different phrase or remove some filters.`
              : "No products match the current filters. Try widening your search."}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push(pathname)}>
          Clear search
        </Button>
      </div>
    )
  }

  const rangeStart = (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {query.q ? (
            <>
              <span className="font-medium text-foreground">{total}</span> results
              for <span className="font-medium text-foreground">&quot;{query.q}&quot;</span>
            </>
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{rangeStart}–{rangeEnd}</span> of{" "}
              <span className="font-medium text-foreground">{total}</span> products
            </>
          )}
        </p>
        <Select
          value={query.sort}
          onChange={(event) => update({ sort: event.target.value })}
          aria-label="Sort products"
          className="w-48"
        >
          {SEARCH_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
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
    </div>
  )
}
