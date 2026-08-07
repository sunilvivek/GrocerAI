import type { Metadata } from "next"

import { CheckoutPage } from "@/features/checkout/components/checkout-page"

export const metadata: Metadata = {
  title: "Checkout",
}

export default function CheckoutRoute() {
  return (
    <section aria-label="Checkout">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">Checkout</h1>
      <CheckoutPage />
    </section>
  )
}