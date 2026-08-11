import { NextRequest, NextResponse } from "next/server"

import { searchProducts } from "@/lib/search/service"
import { searchQuerySchema } from "@/lib/search/validation"

export async function GET(request: NextRequest) {
  const input = Object.fromEntries(request.nextUrl.searchParams.entries())

  const parsed = searchQuerySchema.safeParse(input)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          message: parsed.error.issues[0]?.message ?? "Invalid search parameters.",
        },
      },
      { status: 400 },
    )
  }

  try {
    const response = await searchProducts({
      q: parsed.data.q,
      mode: parsed.data.mode,
      sort: parsed.data.sort,
      filters: {
        categorySlug: parsed.data.category || undefined,
        minPrice: parsed.data.minPrice,
        maxPrice: parsed.data.maxPrice,
        availableOnly: parsed.data.availableOnly,
      },
      page: parsed.data.page,
      pageSize: parsed.data.pageSize,
    })
    return NextResponse.json(response)
  } catch (error) {
    console.error("search failed", error)
    return NextResponse.json(
      { error: { message: "Could not complete the search. Please try again." } },
      { status: 500 },
    )
  }
}