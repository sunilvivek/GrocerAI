import { currencyConfig } from "@/constants/currency"
import { formatCurrency, formatCurrencyCompact } from "@/utils/format"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

/**
 * Verifies the centralized currency configuration and formatters:
 *   1. Code, symbol and locale are INR-flavoured.
 *   2. Formatters read from the config (single source of truth).
 *   3. Detailed prices always show two decimals.
 *   4. Compact grocery prices omit trailing zeroes.
 *   5. Indian (en-IN) grouping is used, e.g. 1,00,000.
 */
async function main() {
  assert(currencyConfig.code === "INR", "currency code is INR")
  assert(currencyConfig.symbol === "₹", "currency symbol is ₹")
  assert(currencyConfig.locale === "en-IN", "locale is en-IN")

  const formatted = formatCurrency(1000)
  assert(
    formatted.includes("₹"),
    `formatter output includes the ₹ symbol ("${formatted}")`
  )

  console.log("Detailed formatter examples:")
  const cases: Array<[number, string]> = [
    [100, "₹100.00"],
    [1000, "₹1,000.00"],
    [10000, "₹10,000.00"],
    [100000, "₹1,00,000.00"],
    [1250.5, "₹1,250.50"],
    [0, "₹0.00"],
    [4.99, "₹4.99"],
  ]
  for (const [value, expected] of cases) {
    const actual = formatCurrency(value)
    assert(
      actual === expected,
      `formatCurrency(${value}) === "${expected}" (got "${actual}")`
    )
  }

  console.log("Compact formatter examples:")
  const compactCases: Array<[number, string]> = [
    [249, "₹249"],
    [40, "₹40"],
    [4.99, "₹4.99"],
    [0, "₹0"],
  ]
  for (const [value, expected] of compactCases) {
    const actual = formatCurrencyCompact(value)
    assert(
      actual === expected,
      `formatCurrencyCompact(${value}) === "${expected}" (got "${actual}")`
    )
  }

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    const { prisma } = await import("@/lib/prisma")
    await prisma.$disconnect()
  })
