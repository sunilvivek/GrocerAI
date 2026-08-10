import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import {
  deleteRecipe,
  getRecipe,
  setRecipePublished,
  updateRecipe,
} from "@/features/admin/recipes/data"
import { recipeSchema } from "@/features/admin/recipes/validators"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params
  const recipe = await getRecipe(id)
  if (!recipe) {
    return NextResponse.json({ error: { message: "Recipe not found." } }, { status: 404 })
  }

  return NextResponse.json({ recipe })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    // Publish/unpublish toggle.
    if (typeof body.isPublished === "boolean" && Object.keys(body).length === 1) {
      await setRecipePublished(id, body.isPublished)
      return NextResponse.json({ ok: true })
    }

    const parsed = recipeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid recipe data." } },
        { status: 400 },
      )
    }

    const recipe = await updateRecipe(id, parsed.data)
    return NextResponse.json({ recipe })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A recipe with this slug already exists."
              : "Could not update the recipe.",
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
    await deleteRecipe(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: { message: "Could not delete the recipe." } },
      { status: 500 },
    )
  }
}
