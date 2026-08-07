/** Pricing rules used to estimate cart totals. Kept here so checkout and
 * order confirmation render the exact same numbers. */
export const cartConfig = {
  /** Estimated sales tax applied to the subtotal. */
  taxRate: 0.085,
  /** Flat delivery charge applied to orders below the free-delivery threshold. */
  deliveryFee: 5.99,
  /** Orders at or above this subtotal qualify for free delivery. */
  freeDeliveryThreshold: 50,
  /** Minimum and maximum quantities allowed per cart line. */
  minQuantity: 1,
  maxQuantity: 99,
}

export const CART_COOKIE_NAME = "grocerai_cart"
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
