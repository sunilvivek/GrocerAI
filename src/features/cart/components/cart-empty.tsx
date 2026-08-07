import { ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

interface CartEmptyProps {
  title?: string
  description?: string
}

const DEFAULT_TITLE = "Your cart is empty"
const DEFAULT_DESCRIPTION = "Browse the catalog and add items you'd like to buy."

export function CartEmpty({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: CartEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <ShoppingCart className="size-8 text-muted-foreground" aria-hidden />
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild className="mt-2">
        <Link href="/products">Browse products</Link>
      </Button>
    </div>
  )
}