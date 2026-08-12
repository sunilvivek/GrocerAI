import { currencyConfig } from "@/constants/currency"

/**
 * Formats a number as Indian Rupees using the `en-IN` locale, so grouping
 * follows Indian conventions (e.g. 1,00,000). Whole amounts always render
 * with two decimal places (100 → "₹100.00").
 */
const detailedFormatter = new Intl.NumberFormat(currencyConfig.locale, {
  style: "currency",
  currency: currencyConfig.code,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Compact variant for grocery-style prices: whole rupees render without a
 * decimal part (249 → "₹249"); fractional amounts keep up to two decimals
 * (4.99 → "₹4.99").
 */
const compactFormatter = new Intl.NumberFormat(currencyConfig.locale, {
  style: "currency",
  currency: currencyConfig.code,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** Detailed price, e.g. 100 → "₹100.00". */
export function formatCurrency(value: number): string {
  return detailedFormatter.format(value)
}

/** Compact grocery price, e.g. 249 → "₹249". */
export function formatCurrencyCompact(value: number): string {
  return compactFormatter.format(value)
}

/**
 * Converts a rupee amount to the smallest currency unit (paise) as an integer.
 *
 * Payment providers such as Razorpay require the amount in the smallest unit,
 * e.g. ₹100 → 10000 paise. This is the single conversion point — call it once
 * per payment amount and never feed floating-point rupees directly to a
 * provider. Rounding keeps float arithmetic from producing stray paise.
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

/** Converts an integer paise amount back to rupees (e.g. for storage). */
export function paiseToRupees(paise: number): number {
  return paise / 100
}

export function formatPercentage(value: number): string {
  return `${value}%`
}
