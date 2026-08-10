import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/features/admin/categories/data"
import { categorySchema } from "@/features/admin/categories/validators"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params
  const category = await getCategory(id)
  if (!category) {
    return NextResponse.json({ error: { message: "Category not found." } }, { status: 404 })
  }

  return NextResponse.json({ category })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid category data." } },
        { status: 400 },
      )
    }

    const category = await updateCategory(id, parsed.data)
    return NextResponse.json({ category })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A category with this slug already exists."
              : "Could not update the category.",
        },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params

  try {
    await deleteCategory(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: { message: "This category still has products. Reassign them first." } },
      { status: 409 },
    )
  }
}