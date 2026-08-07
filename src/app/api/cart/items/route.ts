import { NextRequest, NextResponse } from "next/server"

import { addToCart } from "@/lib/cart"
import { toCartResponse } from "@/lib/cart/route-utils"
import { addItemSchema } from "@/lib/cart/validation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = addItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: "Provide a valid product id and quantity." } },
        { status: 400 },
      )
    }

    const cart = await addToCart(parsed.data.productId, parsed.data.quantity)
    return NextResponse.json(cart)
  } catch (error) {
    return toCartResponse(error)
  }
}