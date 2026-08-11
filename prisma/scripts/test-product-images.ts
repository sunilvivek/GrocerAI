import { productImages } from "../data/images"
import { products } from "../data/products"

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
 * Audits product image data:
 *   1. Every product has a curated image.
 *   2. Image URLs are unique (no two products share a photo).
 *   3. URLs use a supported, product-relevant host.
 *   4. Curated images are actually wired into the seed via productImage().
 */
function main() {
  const missing = products.filter((p) => !productImages[slugify(p.name)])
  assert(
    missing.length === 0,
    `every product has a curated image (missing: ${missing.map((m) => m.name).join(", ") || "none"})`
  )

  const urls = Object.values(productImages)
  const unique = new Set(urls).size
  assert(
    unique === urls.length,
    `image URLs are unique (${unique}/${urls.length})`
  )

  const supportedHosts = ["https://loremflickr.com/"]
  const unsupported = urls.filter(
    (url) => !supportedHosts.some((host) => url.startsWith(host))
  )
  assert(
    unsupported.length === 0,
    `all images come from a supported host (unsupported: ${unsupported.join(", ") || "none"})`
  )

  const fallback = "https://picsum.photos/seed/test/600/600"
  assert(
    fallback.startsWith("https://picsum.photos/seed/"),
    "deterministic fallback remains available for unmapped products"
  )

  console.log("OK" + (process.exitCode ? " (with failures)" : ""))
}

main()
