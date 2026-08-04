import {
  Apple,
  Beef,
  Bike,
  Carrot,
  ChefHat,
  ClipboardList,
  Croissant,
  CupSoda,
  Leaf,
  ListChecks,
  MessageSquareText,
  Popcorn,
  ShoppingBasket,
  ShoppingCart,
  Sparkles,
  Wine,
  type LucideIcon,
} from "lucide-react"

import type {
  Category,
  FaqItem,
  Feature,
  HowItWorksStep,
  Testimonial,
} from "@/types"

export const HERO_STATS: { label: string; value: string }[] = [
  { label: "Active shoppers", value: "120K+" },
  { label: "Meals generated", value: "2.4M" },
  { label: "Avg. cart savings", value: "18%" },
]

export const FEATURES: Feature[] = [
  {
    title: "AI Shopping",
    description:
      "Describe a meal in plain language and watch SmartCart turn it into a perfectly organized grocery list in seconds.",
    icon: Sparkles,
  },
  {
    title: "Recipe Generation",
    description:
      "Get personalized recipes built around what you already have at home — no more wasted ingredients.",
    icon: ChefHat,
  },
  {
    title: "Pantry Management",
    description:
      "Track what's in your pantry and fridge. SmartCart only adds the missing items to your cart.",
    icon: ListChecks,
  },
  {
    title: "Smart Recommendations",
    description:
      "Learn healthier, budget-friendly alternatives and seasonal swaps tailored to your taste and goals.",
    icon: MessageSquareText,
  },
]

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Describe your meal",
    description:
      "Type what you're craving — a comforting pasta night or a quick weeknight stir-fry. Keep it simple.",
    icon: MessageSquareText,
  },
  {
    step: 2,
    title: "AI creates a recipe",
    description:
      "Our engine generates a balanced recipe and cross-checks it against your pantry to build the shopping list.",
    icon: Sparkles,
  },
  {
    step: 3,
    title: "Review your cart",
    description:
      "Browse every ingredient, swap brands or sizes, and let SmartCart find the best local prices.",
    icon: ShoppingCart,
  },
  {
    step: 4,
    title: "Checkout",
    description:
      "Order for delivery or curbside pickup from your favorite stores — and enjoy a zero-waste shop.",
    icon: Bike,
  },
]

export const CATEGORIES: Category[] = [
  {
    name: "Fruits",
    description: "Fresh, seasonal and always crisp",
    icon: Apple,
    gradient: "from-rose-500/15 to-orange-400/15",
  },
  {
    name: "Vegetables",
    description: "Farm-fresh greens for every plate",
    icon: Carrot,
    gradient: "from-emerald-500/15 to-lime-400/15",
  },
  {
    name: "Dairy",
    description: "Milk, cheese, yogurt and more",
    icon: CupSoda,
    gradient: "from-sky-500/15 to-cyan-400/15",
  },
  {
    name: "Bakery",
    description: "Freshly baked bread and treats",
    icon: Croissant,
    gradient: "from-amber-500/15 to-yellow-400/15",
  },
  {
    name: "Meat",
    description: "Premium cuts, butcher-selected",
    icon: Beef,
    gradient: "from-red-500/15 to-rose-400/15",
  },
  {
    name: "Snacks",
    description: "Crunchy, sweet and satisfying",
    icon: Popcorn,
    gradient: "from-purple-500/15 to-fuchsia-400/15",
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I described 'spicy tofu tacos' and within seconds SmartCart had a recipe, a cart, and the cheapest store nearby. I'll never meal-plan manually again.",
    author: "Amara Okafor",
    role: "Home cook, Austin",
    initials: "AO",
  },
  {
    quote:
      "The pantry sync is magic. It stopped me from buying my fifth jar of cumin and saved our family almost $40 on the first order.",
    author: "Daniel Reyes",
    role: "Dad of three, Chicago",
    initials: "DR",
  },
  {
    quote:
      "As someone with dietary restrictions, the smart recommendations make grocery shopping feel effortless and safe. Beautiful product.",
    author: "Priya Sharma",
    role: "Nutrition coach, Seattle",
    initials: "PS",
  },
]

export const FAQS: FaqItem[] = [
  {
    question: "How does the AI build my grocery cart?",
    answer:
      "You describe a meal in plain language. SmartCart generates a recipe, matches every ingredient against your pantry, and compiles only what's missing into an organized shopping cart — complete with quantities and price estimates.",
  },
  {
    question: "Does SmartCart work with my local grocery store?",
    answer:
      "Yes. We connect to major grocery chains and local markets in most metro areas. You can compare prices across stores and choose delivery or curbside pickup at checkout.",
  },
  {
    question: "What does it cost to use SmartCart?",
    answer:
      "SmartCart is free to start. A premium plan adds unlimited recipe generations, advanced pantry tracking, and exclusive member discounts. You'll never pay for the basic AI cart builder.",
  },
  {
    question: "Can I use it if I have dietary restrictions?",
    answer:
      "Absolutely. Set preferences for allergies, vegetarian, vegan, keto, or any other dietary needs, and every recipe and recommendation will respect those rules automatically.",
  },
  {
    question: "Is my shopping data safe?",
    answer:
      "Yes. Your pantry, preferences, and purchase history are encrypted and never sold to third parties. You can export or delete your data at any time from your account settings.",
  },
]

export const LANDING_NAV_ANCHORS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Shopping", href: "#features", icon: ShoppingBasket },
  { label: "How it works", href: "#how-it-works", icon: ClipboardList },
  { label: "Categories", href: "#categories", icon: Leaf },
  { label: "Reviews", href: "#testimonials", icon: Wine },
]
