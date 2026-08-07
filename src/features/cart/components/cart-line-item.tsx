"use client"

import { ShoppingBasket, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { CartLineItem } from "@/lib/cart/types"
import { formatCurrency } from "@/utils/format"

import { QuantitySelector } from "@/features/cart/components/quantity-selector"

interface CartLineItemProps {
  line: CartLineItem
  onQuantityChange: (itemId: string, quantity: number) => void
  onSaveForLater: (itemId: string) => void
  onRemove: (itemId: string) => void
}

export function CartLineItem({
  line,
  onQuantityChange,
  onSaveForLater,
  onRemove,
}: CartLineItemProps) {
  const { product } = line
  const lineTotal = product.price * line.quantity

  return (
    <li className="flex gap-4 border-b border-border py-4 last:border-b-0 sm:gap-6">
      <Link
        href={`/products/${product.slug}`}
        className="relative block size-20 shrink-0 overflow-hidden rounded-xl border border-border sm:size-24"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 6rem, 5rem"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.brand ? `${product.brand} · ` : ""}
              {product.unit}
            </p>
          </div>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(lineTotal)}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={line.quantity}
            max={Math.min(product.stock, 99)}
            onChange={(next) => onQuantityChange(line.id, next)}
          />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveForLater(line.id)}
              className="text-muted-foreground"
            >
              <ShoppingBasket className="size-4" aria-hidden />
              <span className="hidden sm:inline">Save for later</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(line.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}