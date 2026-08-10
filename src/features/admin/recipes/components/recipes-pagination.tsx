"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"

interface RecipesPaginationProps {
  page: number
  totalPages: number
  total: number
}

export function RecipesPagination({ page, totalPages, total }: RecipesPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function goTo(targetPage: number) {
    const url = new URLSearchParams(searchParams)
    url.set("page", String(targetPage))
    router.push(`${pathname}?${url.toString()}`)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
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
  )
}
