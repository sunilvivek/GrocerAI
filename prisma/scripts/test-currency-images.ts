import { PrismaClient } from "@prisma/client"

import { cartConfig, roundMoney } from "@/lib/cart/cart-config"
import { currencyConfig } from "@/constants/currency"
import { productImages } from "../data/images"
import { products } from "../data/products"
import { formatCurrency, paiseToRupees, rupeesToPaise } from "@/utils/format"

const prisma = new PrismaClient()

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  ✗ ${message}`)
    process.exitCode = 1
  } else {
    console.log(`  ✓ ${message}`)
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * End-to-end verification of the currency + image milestone:
 *
 * Currency
 *   1. All product prices in the DB are sensible INR values.
 *   2. Product seed prices match the DB (INR applied to the data source).
 *   3. The cart config uses GST %, delivery fee and free-delivery in INR.
 *   4. formatCurrency outputs ₹; rupees→paise conversion is correct and lossless.
 *
 * Images
 *   5. Every product has a curated, deterministic (locked) image URL.
 *   6. The DB stores the same curated URLs the data file declares.
 */
async function main() {
  const [dbProducts, imageCount] = await Promise.all([
    prisma.product.findMany({
      select: { name: true, price: true, image: true },
    }),
    prisma.product.count({ where: { image: { contains: "lock=" } } }),
  ])

  // 1. DB prices are realistic INR.
  const badPrices = dbProducts.filter(
    (p) => p.price.toNumber() <= 0 || p.price.toNumber() > 10000
  )
  assert(
    badPrices.length === 0,
    `all ${dbProducts.length} DB prices are sensible INR values`
  )

  // 2. Seed prices match DB prices (by slug).
  const mismatch = products.filter((p) => {
    const db = dbProducts.find((d) => d.name === p.name)
    return db && db.price.toNumber() !== p.price
  })
  assert(
    mismatch.length === 0,
    `seed prices match DB prices (mismatched: ${mismatch.map((m) => m.name).join(", ") || "none"})`
  )

  // 3. Cart config is INR-flavoured.
  assert(cartConfig.taxRate === 0.05, "GST rate is 5%")
  assert(cartConfig.deliveryFee === 49, "delivery fee is ₹49")
  assert(
    cartConfig.freeDeliveryThreshold === 499,
    "free-delivery threshold is ₹499"
  )
  assert(currencyConfig.code === "INR", "currency code is INR")

  // 4. Formatting + paise conversion are correct and lossless.
  const sample = roundMoney(dbProducts[0].price.toNumber())
  assert(
    formatCurrency(sample).includes("₹"),
    `formatCurrency(${sample}) renders ₹`
  )
  assert(rupeesToPaise(100) === 10000, "₹100 → 10000 paise")
  assert(paiseToRupees(10000) === 100, "10000 paise → ₹100")
  assert(
    rupeesToPaise(paiseToRupees(24999)) === 24999,
    "rupee↔paise round-trip is lossless"
  )

  // 5. Every product has a curated, deterministic image.
  const missing = products.filter((p) => !productImages[slugify(p.name)])
  assert(
    missing.length === 0,
    `every seed product has a curated image (missing: ${missing.length})`
  )

  // 6. DB images match the curated data file (single source of truth).
  const dbMissingLock = dbProducts.filter((p) => !p.image?.includes("lock="))
  assert(
    dbMissingLock.length === 0,
    `all ${imageCount} DB images are deterministic (locked)`
  )
  const imageMismatch = products.filter((p) => {
    const db = dbProducts.find((d) => d.name === p.name)
    return db && db.image !== productImages[slugify(p.name)]
  })
  assert(
    imageMismatch.length === 0,
    `DB images match curated data (mismatched: ${imageMismatch.map((m) => m.name).join(", ") || "none"})`
  )

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
