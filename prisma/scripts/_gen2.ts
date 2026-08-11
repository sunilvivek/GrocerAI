import { products } from "../data/products"

function slugify(v: string): string {
  return v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

// Final keyword override per product, keyed by product name. Values were
// verified to return HTTP 200 AND a distinct image (not LoremFlickr's generic fallback).
const OVERRIDES: Record<string, string> = {
  Bananas: "banana",
  Strawberries: "strawberry",
  Quinoa: "quinoa-seeds",
  "Orange Juice": "fresh-orange-juice",
  "80/20 Ground Beef": "ground-beef",
  "93% Lean Ground Turkey": "turkey-meat",
  "Atlantic Cod Fillets": "cod-fish",
  "Atlantic Salmon Fillets": "salmon-fish",
  "Boneless Pork Chops": "pork-chop",
  "Broccoli Crowns": "broccoli",
  "Ceremonial Matcha": "matcha-powder",
  "Ciabatta Loaf": "ciabatta",
  "Cinnamon Rice Cakes": "rice-cake",
  "Classic Hummus": "chickpea-hummus",
  "Crispy Chicken Nuggets": "chicken-nugget",
  "Dark Chocolate 70%": "chocolate",
  "Diced Fire-Roasted Tomatoes": "fire-roasted-tomatoes",
  "Frozen Broccoli Florets": "green-vegetables",
  "Frozen Chopped Spinach": "frozen-spinach",
  "Frozen Mixed Berries": "mixed-berries",
  "Frozen Peas": "frozen-peas",
  "Frozen Shelled Edamame": "edamame",
  "Frozen Sweet Corn": "sweet-corn",
  "Ginger Kombucha": "ginger-tea",
  "Granola Bars": "granola-bar",
  "Greek Yogurt Covered Pretzels": "yogurt-pretzels",
  "Half & Half": "cream-milk",
  "Hass Avocados": "avocado",
  "Large Brown Eggs": "brown-eggs",
  "Organic Apple Juice": "apple-juice",
  "Oven-Roasted Turkey Deli Slices": "roasted-turkey",
  "Plain Greek Yogurt": "greek-yogurt",
  "Raw Honey": "honey",
  "Roasted Salsa Roja": "salsa-verde",
  "Salted Almonds": "roasted-almonds",
  "Sea Salt Potato Chips": "potato-crisps",
  "Sourdough Pretzel Sticks": "pretzel-sticks",
  "Sparkling Water (Lime)": "mineral-water",
  "Unsweetened Almond Milk": "almond-milk",
  "Whole Milk Kefir": "fermented-milk",
}

const lines: string[] = []
const used = new Set<string>()
for (const p of products) {
  const base = p.name.split(" (")[0].toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  const kw = OVERRIDES[p.name] ?? base
  if (used.has(kw)) console.error(`DUPLICATE keyword "${kw}" for "${p.name}"`)
  used.add(kw)
  lines.push(`  "${slugify(p.name)}": "https://loremflickr.com/600/600/${kw}",`)
}
console.log(lines.join("\n"))
