"use client"

import { ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/features/cart/cart-context"
import type { SearchResult } from "@/lib/search/domain"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/format"

interface ProductCardProps {
  product: SearchResult
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)

  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price

  async function handleAdd() {
    setAdding(true)
    await addItem(product.id)
    setAdding(false)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg hover:shadow-black/5">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden border-b border-border"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted" />
        )}
        {onSale ? (
          <Badge className="absolute left-3 top-3 bg-destructive text-white hover:bg-destructive">
            Sale
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {product.category.name}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:underline"
        >
          {product.name}
        </Link>
        {product.brand ? (
          <p className="text-xs text-muted-foreground">{product.brand}</p>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
          <span className="font-medium tabular-nums">
            {product.rating.toFixed(1)}
          </span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {onSale ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </span>
            ) : null}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            className={cn(product.stock === 0 && "opacity-60")}
          >
            <ShoppingCart className="size-4" aria-hidden />
            {product.stock === 0 ? "Sold out" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  )
}
