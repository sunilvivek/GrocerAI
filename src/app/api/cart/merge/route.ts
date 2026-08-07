import { NextResponse } from "next/server"

import { mergeGuestCart } from "@/lib/cart"
import { toCartResponse } from "@/lib/cart/route-utils"

export async function POST() {
  try {
    const cart = await mergeGuestCart()
    return NextResponse.json(cart)
  } catch (error) {
    return toCartResponse(error)
  }
}