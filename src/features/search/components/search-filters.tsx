"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Category = { id: string; name: string; slug: string }

interface SearchFiltersProps {
  categories: Category[]
  activeCategory?: string
  initialMinPrice?: number
  initialMaxPrice?: number
  initialAvailableOnly?: boolean
}

export function SearchFilters({
  categories,
  activeCategory,
  initialMinPrice,
  initialMaxPrice,
  initialAvailableOnly,
}: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [minPrice, setMinPrice] = useState(initialMinPrice?.toString() ?? "")
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice?.toString() ?? "")

  function apply(updates: Record<string, string | boolean | null>) {
    const url = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === false) url.delete(key)
      else url.set(key, String(value))
    }
    url.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${url.toString()}`)
    })
  }

  function applyPrice() {
    apply({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => apply({ category: null })}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground/80 hover:border-ring",
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => apply({ category: category.slug })}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                activeCategory === category.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/80 hover:border-ring",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price range
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className="h-9"
          />
          <Button variant="outline" size="sm" onClick={applyPrice} disabled={isPending}>
            Apply
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-sm font-medium"
          onClick={() => apply({ availableOnly: !(initialAvailableOnly === true) })}
        >
          In stock only
        </button>
        <Switch
          checked={initialAvailableOnly === true}
          onCheckedChange={(checked) => apply({ availableOnly: checked })}
          aria-label="In stock only"
        />
      </div>
    </div>
  )
}
