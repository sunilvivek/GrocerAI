/**
 * Single source of truth for application currency.
 *
 * Every money display should resolve through the formatters in
 * `@/utils/format`, which read these values. Do not scatter currency
 * configuration across components.
 */
export const currencyConfig = {
  /** ISO 4217 currency code used by `Intl.NumberFormat`. */
  code: "INR",
  /** Human-readable currency symbol. */
  symbol: "₹",
  /** Locale used for number/currency grouping. */
  locale: "en-IN",
} as const
