/** Pricing rules used to estimate cart totals. Kept here so checkout and
 * order confirmation render the exact same numbers. Values are in INR. */
export const cartConfig = {
  /** GST rate applied to the subtotal. */
  taxRate: 0.05,
  /** Flat delivery charge applied to orders below the free-delivery threshold. */
  deliveryFee: 49,
  /** Orders at or above this subtotal qualify for free delivery. */
  freeDeliveryThreshold: 499,
  /** Minimum and maximum quantities allowed per cart line. */
  minQuantity: 1,
  maxQuantity: 99,
}

export const CART_COOKIE_NAME = "grocerai_cart"
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
