"use client"

import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/shared/product-image"
import { useCart } from "@/features/cart/cart-context"
import type { SearchResult } from "@/lib/search/domain"
import { cn } from "@/lib/utils"
import { formatCurrencyCompact } from "@/utils/format"

interface ProductCardProps {
  product: SearchResult
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [adding, setAdding] = useState(false)

  const onSale =
    product.compareAtPrice !== null && product.compareAtPrice > product.price

  async function handleAdd() {
    setAdding(true)
    await addItem(product.id)
    setAdding(false)
  }

  return (
    <article className="group border-border bg-card/60 hover:border-border flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <Link
        href={`/products/${product.slug}`}
        className="border-border relative block aspect-square overflow-hidden border-b"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 768px) 25vw, 50vw"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {onSale ? (
          <Badge className="bg-destructive hover:bg-destructive absolute top-3 left-3 text-white">
            Sale
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {product.category.name}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm leading-snug font-semibold hover:underline"
        >
          {product.name}
        </Link>
        {product.brand ? (
          <p className="text-muted-foreground text-xs">{product.brand}</p>
        ) : null}

        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Star
            className="size-3.5 fill-amber-400 text-amber-400"
            aria-hidden
          />
          <span className="font-medium tabular-nums">
            {product.rating.toFixed(1)}
          </span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-semibold tabular-nums">
              {formatCurrencyCompact(product.price)}
            </span>
            {onSale ? (
              <span className="text-muted-foreground text-xs line-through">
                {formatCurrencyCompact(product.compareAtPrice!)}
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
