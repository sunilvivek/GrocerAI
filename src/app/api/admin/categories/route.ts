import { NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import { listCategories } from "@/features/admin/products/data"

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const categories = await listCategories()
  return NextResponse.json({ categories })
}
