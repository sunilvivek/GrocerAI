"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { CartEmpty } from "@/features/cart/components/cart-empty"
import { CartLineItem } from "@/features/cart/components/cart-line-item"
import { CartSummary } from "@/features/cart/components/cart-summary"
import { useCart } from "@/features/cart/cart-context"

export function CartPage() {
  const {
    cart,
    loading,
    error,
    updateQuantity,
    setSavedForLater,
    removeItem,
    clearCart,
  } = useCart()
  const [clearing, setClearing] = useState(false)
  const router = useRouter()

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex gap-4 border-b border-border pb-4">
              <Skeleton className="size-20 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
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
        <Button onClick={() => location.reload()} variant="outline">
          Try again
        </Button>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return <CartEmpty />
  }

  const hasSavedItems = cart.savedItems.length > 0

  async function handleClear() {
    setClearing(true)
    try {
      await clearCart()
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {cart.summary.itemCount} {cart.summary.itemCount === 1 ? "item" : "items"}
          </p>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={clearing}>
            Clear cart
          </Button>
        </div>

        <ul>
          {cart.items.map((line) => (
            <CartLineItem
              key={line.id}
              line={line}
              onQuantityChange={updateQuantity}
              onSaveForLater={(itemId) => setSavedForLater(itemId, true)}
              onRemove={removeItem}
            />
          ))}
        </ul>

        {hasSavedItems && (
          <>
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Saved for later</h2>
              {cart.savedItems.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {cart.savedItems.length} {cart.savedItems.length === 1 ? "item" : "items"} saved
                </p>
              )}
            </div>
            <ul>
              {cart.savedItems.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onQuantityChange={updateQuantity}
                  onSaveForLater={(itemId) => setSavedForLater(itemId, false)}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          </>
        )}

        <p className="mt-6 text-xs text-muted-foreground">
          <Link href="/products" className="font-medium text-primary hover:underline">
            Continue shopping
          </Link>{" "}
          to keep adding items.
        </p>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary summary={cart.summary} onCheckout={() => router.push("/checkout")} />
      </div>
    </div>
  )
}