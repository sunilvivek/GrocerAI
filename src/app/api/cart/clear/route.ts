import { NextResponse } from "next/server"

import { clearCart } from "@/lib/cart"
import { toCartResponse } from "@/lib/cart/route-utils"

export async function POST() {
  try {
    const cart = await clearCart()
    return NextResponse.json(cart)
  } catch (error) {
    return toCartResponse(error)
  }
}