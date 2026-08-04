import type { LucideIcon } from "lucide-react"

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
  icon: LucideIcon
}

export interface Category {
  name: string
  description: string
  icon: LucideIcon
  gradient: string
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  initials: string
}

export interface FaqItem {
  question: string
  answer: string
}
