import { currencyConfig } from "@/constants/currency"
import { formatCurrency } from "@/utils/format"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

/**
 * Verifies the centralized currency configuration:
 *   1. Code, symbol and locale are INR-flavoured.
 *   2. The formatter reads from the config (single source of truth).
 */
async function main() {
  assert(currencyConfig.code === "INR", "currency code is INR")
  assert(currencyConfig.symbol === "₹", "currency symbol is ₹")
  assert(currencyConfig.locale === "en-IN", "locale is en-IN")

  const formatted = formatCurrency(1000)
  assert(formatted.includes("₹"), `formatter output includes the ₹ symbol ("${formatted}")`)

  console.log("Formatter examples:")
  const cases: Array<[number, string]> = [
    [249, "₹249"],
    [1000, "₹1,000"],
    [10000, "₹10,000"],
    [100000, "₹1,00,000"],
    [4.99, "₹4.99"],
    [40, "₹40"],
  ]
  for (const [value, expected] of cases) {
    const actual = formatCurrency(value)
    assert(actual === expected, `formatCurrency(${value}) === "${expected}" (got "${actual}")`)
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
