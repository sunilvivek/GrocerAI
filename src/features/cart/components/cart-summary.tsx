import { Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartSummary as CartSummaryType } from "@/lib/cart/types"
import { formatCurrency } from "@/utils/format"

interface CartSummaryProps {
  summary: CartSummaryType
  onCheckout: () => void
  checkoutPending?: boolean
  showCheckoutButton?: boolean
}

export function CartSummary({
  summary,
  onCheckout,
  checkoutPending = false,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const qualifiesForFreeDelivery = summary.subtotal >= summary.freeDeliveryThreshold

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium tabular-nums">{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated tax</span>
          <span className="font-medium tabular-nums">{formatCurrency(summary.tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium tabular-nums">
            {summary.deliveryFee === 0 ? "Free" : formatCurrency(summary.deliveryFee)}
          </span>
        </div>
        {summary.deliveryFee === 0 && summary.subtotal > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Truck className="size-3.5" aria-hidden />
            {qualifiesForFreeDelivery
              ? "You've unlocked free delivery."
              : "Delivery is free on this order."}
          </p>
        )}
        <Separator />
        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="font-semibold tabular-nums">{formatCurrency(summary.total)}</span>
        </div>
        {summary.deliveryEstimate && (
          <p className="text-xs text-muted-foreground">Arrives {summary.deliveryEstimate}</p>
        )}
      </CardContent>
      <CardFooter>
        {showCheckoutButton && (
          <Button
            className="w-full"
            onClick={onCheckout}
            disabled={checkoutPending || summary.itemCount === 0}
          >
            {summary.itemCount === 0 ? "Cart is empty" : "Checkout"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}