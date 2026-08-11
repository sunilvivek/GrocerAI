import { cartConfig, roundMoney } from "@/lib/cart/cart-config"
import { paiseToRupees, rupeesToPaise } from "@/utils/format"

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

/**
 * Verifies the rupees→paise conversion that payment providers require:
 *   1. Examples convert exactly (₹100 → 10000 paise).
 *   2. Rounding produces integer paise for any cart total.
 *   3. Converting rupees→paise→rupees is lossless.
 *   4. The cart total chain never double-converts.
 */
function main() {
  console.log("Rupees → paise:")
  const cases: Array<[number, number]> = [
    [100, 10000],
    [249, 24900],
    [0, 0],
    [143.5, 14350],
    [1354.5, 135450],
    [498.99, 49899],
  ]
  for (const [rupees, expected] of cases) {
    const actual = rupeesToPaise(rupees)
    assert(actual === expected, `rupeesToPaise(${rupees}) === ${expected} (got ${actual})`)
  }

  console.log("Round-trip:")
  for (const rupees of [0.01, 1, 45, 249.99, 499, 1290, 1354.5]) {
    const paise = rupeesToPaise(rupees)
    const back = paiseToRupees(paise)
    assert(
      Math.abs(back - rupees) < 1e-9,
      `rupeesToPaise → paiseToRupees round-trips ${rupees} (got ${back})`,
    )
  }

  console.log("Cart total chain (single conversion):")
  // Simulate a cart below the free-delivery threshold, then convert once.
  const subtotal = roundMoney(90)
  const tax = roundMoney(subtotal * cartConfig.taxRate)
  const deliveryFee =
    subtotal === 0 || subtotal >= cartConfig.freeDeliveryThreshold ? 0 : cartConfig.deliveryFee
  const total = roundMoney(subtotal + tax + deliveryFee)
  const paymentAmountPaise = rupeesToPaise(total)
  assert(
    paymentAmountPaise === 14350,
    `cart total ₹${total} converts once to ${paymentAmountPaise} paise`,
  )
  assert(
    Number.isInteger(paymentAmountPaise),
    "payment amount is an integer (never floating-point paise)",
  )

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
