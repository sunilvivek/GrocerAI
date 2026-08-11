import { products } from "../data/products"

function slugify(v: string): string {
  return v.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

const OVERRIDES: Record<string, string> = {
  "Bananas": "banana",
  "Strawberries (1 lb)": "strawberry",
  "Hass Avocados": "avocado",
  "Broccoli Crowns": "broccoli",
  "Large Brown Eggs (dozen)": "brown-eggs",
  "Half & Half (1 pt)": "cream-milk",
  "Unsweetened Almond Milk (1/2 gal)": "almond-milk",
  "Ciabatta Loaf": "ciabatta",
  "93% Lean Ground Turkey": "turkey-meat",
  "Atlantic Salmon Fillets": "salmon-fish",
  "80/20 Ground Beef": "ground-beef",
  "Boneless Pork Chops": "pork-chop",
  "Atlantic Cod Fillets": "cod-fish",
  "Oven-Roasted Turkey Deli Slices": "roasted-turkey",
  "Quinoa (16 oz)": "quinoa-seeds",
  "Diced Fire-Roasted Tomatoes": "fire-roasted-tomatoes",
  "Raw Honey (12 oz)": "honey",
  "Roasted Salsa Roja (16 oz)": "salsa-verde",
  "Orange Juice (52 oz)": "fresh-orange-juice",
  "Sparkling Water Lime (12-pack)": "mineral-water",
  "Organic Apple Juice (64 oz)": "apple-juice",
  "Ginger Kombucha (16 oz)": "ginger-tea",
  "Whole Milk Kefir (32 oz)": "fermented-milk",
  "Ceremonial Matcha (1 oz)": "matcha-powder",
  "Salted Almonds (16 oz)": "roasted-almonds",
  "Dark Chocolate 70% (3.5 oz)": "chocolate",
  "Sea Salt Potato Chips (8 oz)": "potato-crisps",
  "Granola Bars Variety (12-pack)": "granola-bar",
  "Classic Hummus (10 oz)": "chickpea-hummus",
  "Sourdough Pretzel Sticks (12 oz)": "pretzel-sticks",
  "Greek Yogurt Covered Pretzels (6 oz)": "yogurt-pretzels",
  "Cinnamon Rice Cakes (10-pack)": "rice-cake",
  "Frozen Mixed Berries (2 lb)": "mixed-berries",
  "Frozen Peas (1 lb)": "frozen-peas",
  "Frozen Shelled Edamame (16 oz)": "edamame",
  "Frozen Chopped Spinach (10 oz)": "frozen-spinach",
  "Frozen Sweet Corn (1 lb)": "sweet-corn",
  "Crispy Chicken Nuggets (32 oz)": "chicken-nugget",
  "Frozen Broccoli Florets (12 oz)": "green-vegetables",
}

const lines: string[] = []
const used = new Map<string, string>()
const matched: string[] = []
for (const p of products) {
  const base = p.name.split(" (")[0].toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  const kw = OVERRIDES[p.name] ?? base
  const existing = used.get(kw)
  if (existing) console.error(`DUPLICATE keyword "${kw}" for "${p.name}" (also used by ${existing})`)
  used.set(kw, p.name)
  if (OVERRIDES[p.name]) matched.push(p.name)
  lines.push(`  "${slugify(p.name)}": "https://loremflickr.com/600/600/${kw}",`)
}
console.error("overrides applied:", matched.length, "of", Object.keys(OVERRIDES).length)
for (const n of Object.keys(OVERRIDES)) {
  if (!matched.includes(n)) console.error(`UNMATCHED override: "${n}"`)
}
console.log(lines.join("\n"))
