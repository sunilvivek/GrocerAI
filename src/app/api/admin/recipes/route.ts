import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import {
  createRecipe,
  listRecipes,
} from "@/features/admin/recipes/data"
import { recipeSchema } from "@/features/admin/recipes/validators"

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams

  const result = await listRecipes({
    search: searchParams.get("search")?.trim() || undefined,
    difficulty: searchParams.get("difficulty") || undefined,
    published:
      searchParams.get("published") === "true"
        ? true
        : searchParams.get("published") === "false"
          ? false
          : undefined,
    sort: (searchParams.get("sort") as "title" | "difficulty" | "createdAt") || "createdAt",
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
    const parsed = recipeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid recipe data." } },
        { status: 400 },
      )
    }

    const recipe = await createRecipe(parsed.data)
    return NextResponse.json({ recipe }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A recipe with this slug already exists."
              : "Could not create the recipe.",
        },
      },
      { status: 500 },
    )
  }
}
