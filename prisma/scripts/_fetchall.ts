import { productImages } from "../data/images"
import { products } from "../data/products"
function slugify(v: string): string { return v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") }
const missing = products.filter(p => !productImages[slugify(p.name)])
console.error("unmapped:", missing.map(m=>m.name).join(",") || "none")
console.error("total urls:", Object.values(productImages).length)
