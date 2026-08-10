import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import { createCategory, listCategoriesAdmin } from "@/features/admin/categories/data"
import { categorySchema } from "@/features/admin/categories/validators"

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const categories = await listCategoriesAdmin()
  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid category data." } },
        { status: 400 },
      )
    }

    const category = await createCategory(parsed.data)
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A category with this slug already exists."
              : "Could not create the category.",
        },
      },
      { status: 500 },
    )
  }
}
