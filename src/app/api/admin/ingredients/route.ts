import { NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import { listIngredients } from "@/features/admin/recipes/data"

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const ingredients = await listIngredients()
  return NextResponse.json({ ingredients })
}
