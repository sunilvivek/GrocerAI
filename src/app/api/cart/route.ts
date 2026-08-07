import { NextResponse } from "next/server"

import { getOrCreateCart } from "@/lib/cart"

export async function GET() {
  const cart = await getOrCreateCart()
  return NextResponse.json(cart)
}

export const POST = GET
