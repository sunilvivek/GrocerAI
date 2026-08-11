import { currencyConfig } from "@/constants/currency"

const currencyFormatter = new Intl.NumberFormat(currencyConfig.locale, {
  style: "currency",
  currency: currencyConfig.code,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatPercentage(value: number): string {
  return `${value}%`
}
