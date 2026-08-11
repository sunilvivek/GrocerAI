import { currencyConfig } from "@/constants/currency"

/**
 * Formats a number as Indian Rupees using the `en-IN` locale, so grouping
 * follows Indian conventions (e.g. 1,00,000).
 *
 * Whole rupees render without a decimal part (249 → "₹249"); fractional
 * amounts keep up to two decimal places (4.99 → "₹4.99").
 */
const currencyFormatter = new Intl.NumberFormat(currencyConfig.locale, {
  style: "currency",
  currency: currencyConfig.code,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatPercentage(value: number): string {
  return `${value}%`
}
