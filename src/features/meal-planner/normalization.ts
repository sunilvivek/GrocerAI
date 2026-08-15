"use client"

/**
 * Ingredient normalization service.
 *
 * Maps natural-language ingredient references to canonical forms.
 * Handles case, plurals, and common aliases — without a massive NLP system.
 *
 * Does NOT treat unrelated products as equivalent (e.g. "chicken breast"
 * does NOT map to "chicken" in a way that breaks product matching).
 *
 * Reuses the project's existing product search infrastructure where possible.
 */
import type { AvailableIngredient } from "./domain"

export function normalizeIngredientName(name: string): string {
  if (!name || name.trim().length === 0) return ""

  const lower = name.trim().toLowerCase()

  // Map known irregular plurals to singular forms.
  const singularMap: Record<string, string> = {
    tomatoes: "tomato",
    potatoes: "potato",
    onions: "onion",
    garlics: "garlic",
    gingers: "ginger",
    carrots: "carrot",
    peppers: "pepper",
    mushrooms: "mushroom",
    apples: "apple",
    bananas: "banana",
    chickens: "chicken",
    beefs: "beef",
    porks: "pork",
    rices: "rice",
    daals: "dal",
    lentils: "lentil",
    peas: "pea",
    beans: "bean",
    eggplants: "eggplant",
    zucchinis: "zucchini",
    cucumbers: "cucumber",
    lettuces: "lettuce",
    spinachs: "spinach",
    broccolis: "broccoli",
    corns: "corn",
    masalas: "masala",
    curries: "curry",
    chutneys: "chutney",
    pickles: "pickle",
    sauces: "sauce",
    spices: "spice",
    herbs: "herb",
    greens: "green",
    fruits: "fruit",
    vegetables: "vegetable",
  }

  if (lower in singularMap) {
    return singularMap[lower]
  }

  // Strip a trailing "s" as a last resort (regular plurals).
  const singular = lower.replace(/s$/, "").trim()
  if (singular !== lower && singular.length > 0) {
    // Only accept the singular if it's a reasonably known ingredient.
    const known = [
      "tomato", "potato", "onion", "garlic", "ginger",
      "carrot", "rice", "dal", "chicken", "beef",
    ]
    if (known.includes(singular)) {
      return singular
    }
  }

  return lower
}

export function normalizeIngredientNames(names: string[]): AvailableIngredient[] {
  const result: AvailableIngredient[] = []

  for (const raw of names) {
    const norm = normalizeIngredientName(raw)
    if (!norm || norm.length === 0) continue
    const already = result.some((r) => r.normalized === norm)
    if (!already) {
      result.push({ name: norm, normalized: norm })
    }
  }

  return result
}