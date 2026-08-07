import type { Metadata } from "next"

import { CartPage } from "@/features/cart/components/cart-page"

export const metadata: Metadata = {
  title: "Your cart",
}

export default function CartRoute() {
  return (
    <section aria-label="Shopping cart">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">Your cart</h1>
      <CartPage />
    </section>
  )
}