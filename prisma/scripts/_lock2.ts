import { productImages } from "../data/images"
import { products } from "../data/products"
function slugify(v: string): string { return v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") }
const idx = new Map(products.map((p, i) => [slugify(p.name), i + 1]))
const lines = Object.entries(productImages)
  .map(([slug, url]) => `  "${slug}": "${url}?lock=${idx.get(slug) ?? 1}",`)
console.error(`entries: ${lines.length}`)
console.log(lines.join("\n"))
