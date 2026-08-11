"use client"

import type { SearchResponse } from "@/lib/search/domain"

import { SearchFilters } from "@/features/search/components/search-filters"
import { SearchForm } from "@/features/search/components/search-form"
import { SearchResults } from "@/features/search/components/search-results"

export type SearchCategory = { id: string; name: string; slug: string }

interface SearchPageProps {
  data: SearchResponse
  categories: SearchCategory[]
}

export function SearchPage({ data, categories }: SearchPageProps) {
  const { query } = data

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-balance text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Search products naturally
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          Type a craving or a meal idea. SmartCart matches products by meaning,
          not just exact words.
        </p>
        <div className="mt-6">
          <SearchForm initialQuery={query.q} />
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchFilters
            categories={categories}
            activeCategory={query.filters.categorySlug}
            initialMinPrice={query.filters.minPrice}
            initialMaxPrice={query.filters.maxPrice}
            initialAvailableOnly={query.filters.availableOnly}
          />
        </aside>

        <div className="min-w-0">
          <SearchResults data={data} />
        </div>
      </div>
    </div>
  )
}
