import { NextRequest, NextResponse } from "next/server"

import { isAdmin } from "@/features/auth/server"
import {
  deleteProduct,
  getProduct,
  setProductActive,
  updateProduct,
} from "@/features/admin/products/data"
import { productSchema } from "@/features/admin/products/validators"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params
  const product = await getProduct(id)
  if (!product) {
    return NextResponse.json({ error: { message: "Product not found." } }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: { message: "Forbidden" } }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()

    // Lightweight toggle for activation/deactivation.
    if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
      await setProductActive(id, body.isActive)
      return NextResponse.json({ ok: true })
    }

    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message ?? "Invalid product data." } },
        { status: 400 },
      )
    }

    const product = await updateProduct(id, parsed.data)
    return NextResponse.json({ product })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message:
            error instanceof Error && error.message.includes("Unique")
              ? "A product with this slug or SKU already exists."
              : "Could not update the product.",
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
    await deleteProduct(id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      {
        error: {
          message:
            "Could not delete this product. It may be referenced by orders or carts.",
        },
      },
      { status: 409 },
    )
  }
}
