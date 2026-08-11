"use client"

import { Search, Sparkles, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTransition } from "react"

import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "whole chicken",
  "butter",
  "greek yogurt",
  "avocado",
  "baking bread flour",
]

interface SearchFormProps {
  initialQuery: string
}

export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setValue(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (!initialQuery) inputRef.current?.focus()
  }, [initialQuery])

  function navigate(query: string) {
    const url = new URLSearchParams(searchParams)
    if (query.trim()) url.set("q", query.trim())
    else url.delete("q")
    url.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${url.toString()}`)
    })
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(value)
  }

  function onChange(next: string) {
    setValue(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate(next), 400)
  }

  function clear() {
    setValue("")
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate("")
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} className="relative" role="search">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Describe what you're craving — try &quot;butter for baking&quot;"
          className="h-12 w-full rounded-xl border border-border bg-card/60 pl-12 pr-10 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          aria-label="Search products"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground",
              isPending ? "right-9" : "right-3",
            )}
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : null}
        {isPending ? (
          <span className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-border border-t-primary" />
        ) : null}
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5" aria-hidden />
          Try:
        </span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setValue(suggestion)
              navigate(suggestion)
            }}
            className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-foreground/80 transition-colors hover:border-ring hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
