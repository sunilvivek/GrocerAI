"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { CartEmpty } from "@/features/cart/components/cart-empty"
import { useCart } from "@/features/cart/cart-context"
import { formatCurrency } from "@/utils/format"

export function CheckoutPage() {
  const { cart, loading, error } = useCart()
  const [pending] = useState(false)

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => location.reload()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CartEmpty title="Nothing to check out" description="Your cart is empty and there's nothing to order." />
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h2 className="mb-4 text-base font-semibold">Order items</h2>
        <ul className="divide-y divide-border rounded-2xl border border-border">
          {cart.items.map((line) => (
            <li key={line.id} className="flex items-center gap-4 p-4">
              <Link
                href={`/products/${line.product.slug}`}
                className="relative block size-14 shrink-0 overflow-hidden rounded-lg border border-border"
              >
                {line.product.image ? (
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    sizes="3.5rem"
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full bg-muted" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  Qty {line.quantity} × {formatCurrency(line.product.price)}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums">
                {formatCurrency(line.product.price * line.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary
          summary={cart.summary}
          onCheckout={() => undefined}
          checkoutPending={pending}
          showCheckoutButton={false}
        />
      </div>
    </div>
  )
}