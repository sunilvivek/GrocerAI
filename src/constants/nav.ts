import type { FooterLink, NavItem } from "@/types"

export const APP_NAME = "SmartCart AI"

export const APP_TAGLINE = "Describe your meal. We'll build your grocery cart."

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Recipes", href: "/recipes" },
  { label: "AI Assistant", href: "/assistant" },
  { label: "About", href: "/about" },
]

export const FOOTER_LINKS: FooterLink[] = [
  {
    title: "Product",
    links: [
      { label: "Products", href: "/products" },
      { label: "Recipes", href: "/recipes" },
      { label: "AI Assistant", href: "/assistant" },
      { label: "Categories", href: "/categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
]
