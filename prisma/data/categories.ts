import type { CategorySeed } from "./types"

export const categories: CategorySeed[] = [
  {
    name: "Fresh Fruits & Vegetables",
    slug: "produce",
    description:
      "Seasonal fruits and vegetables picked at peak freshness for every meal.",
    sortOrder: 1,
  },
  {
    name: "Dairy & Eggs",
    slug: "dairy",
    description:
      "Milk, cheese, yogurt and eggs from trusted local farms.",
    sortOrder: 2,
  },
  {
    name: "Bakery",
    slug: "bakery",
    description:
      "Fresh-baked breads, rolls and pastries delivered daily.",
    sortOrder: 3,
  },
  {
    name: "Meat & Seafood",
    slug: "meat-seafood",
    description:
      "High-quality cuts of meat and sustainably sourced seafood.",
    sortOrder: 4,
  },
  {
    name: "Pantry & Grains",
    slug: "pantry",
    description:
      "Rice, pasta, oils and canned essentials for your kitchen.",
    sortOrder: 5,
  },
  {
    name: "Beverages",
    slug: "beverages",
    description:
      "Juices, coffee, tea and sparkling drinks to keep you refreshed.",
    sortOrder: 6,
  },
  {
    name: "Snacks",
    slug: "snacks",
    description:
      "Healthy bites and indulgent treats for any time of day.",
    sortOrder: 7,
  },
  {
    name: "Frozen",
    slug: "frozen",
    description:
      "Frozen fruits, vegetables and ready-made favorites.",
    sortOrder: 8,
  },
]
