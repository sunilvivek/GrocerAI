"use client"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { useCart } from "@/features/cart/cart-context"

export function CartBadge() {
  const { itemCount, loading } = useCart()

  return (
    <Button asChild variant="ghost" size="icon" className="relative" aria-label={`Cart, ${itemCount} items`}>
      <Link href="/cart">
        <ShoppingCart className="size-4.5" />
        {!loading && itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}