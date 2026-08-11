import { productImages } from "../data/images"
import { products } from "../data/products"
function slugify(v: string): string { return v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") }
// deterministic lock per product = index in products array
const idx = new Map(products.map((p, i) => [slugify(p.name), i + 1]))
for (const [slug, url] of Object.entries(productImages)) {
  const lock = idx.get(slug) ?? 1
  console.log(`${slug}=${url}?lock=${lock}`)
}
