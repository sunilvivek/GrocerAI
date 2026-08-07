import { NextResponse } from "next/server"

import { CartError } from "@/lib/cart/cart"

/**
 * Converts any error thrown by the cart domain into a stable JSON error body.
 * `CartError` carries its own status code; anything unexpected becomes a 500.
 */
export function toCartResponse(error: unknown): NextResponse {
  if (error instanceof CartError) {
    return NextResponse.json({ error: { message: error.message } }, { status: error.status })
  }

  return NextResponse.json(
    { error: { message: "Something went wrong while updating your cart." } },
    { status: 500 },
  )
}