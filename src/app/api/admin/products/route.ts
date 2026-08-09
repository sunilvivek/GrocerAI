import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import {
  createProduct,
  listProducts,
} from "@/features/admin/products/data"
import { productSchema } from "@/features/admin/products/validators"

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams

  const result = await listProducts({
    search: searchParams.get("search")?.trim() || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    status: (searchParams.get("status") as "active" | "inactive") || undefined,
    sort: (searchParams.get("sort") as "name" | "price" | "stock" | "createdAt") || "createdAt",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
    page: Math.max(1, Number(searchParams.get("page") || 1)),
    pageSize: Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20))),
  })

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid product data." } },
        { status: 400 },
      )
    }

    const product = await createProduct(parsed.data)
    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A product with this slug or SKU already exists."
              : "Could not create the product.",
        },
      },
      { status: 500 },
    )
  }
}
