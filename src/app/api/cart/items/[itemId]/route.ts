import { NextRequest, NextResponse } from "next/server"

import { removeFromCart, updateCartItem } from "@/lib/cart"
import { toCartResponse } from "@/lib/cart/route-utils"
import { updateItemSchema } from "@/lib/cart/validation"

type Params = { params: Promise<{ itemId: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params
    const body = await request.json()
    const parsed = updateItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Provide a valid quantity and/or saved-for-later flag." } },
        { status: 400 },
      )
    }

    const cart = await updateCartItem(itemId, parsed.data)
    return NextResponse.json(cart)
  } catch (error) {
    return toCartResponse(error)
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { itemId } = await params
    const cart = await removeFromCart(itemId)
    return NextResponse.json(cart)
  } catch (error) {
    return toCartResponse(error)
  }
}