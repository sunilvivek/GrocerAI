import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/shared/motion/fade-in"
import { HeroVisual } from "@/features/landing/hero/hero-visual"
import { HERO_STATS } from "@/constants/landing"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-28">
        <FadeIn className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
            Now in beta — free to use
          </span>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Describe your meal.
            <br />
            We&apos;ll build your{" "}
            <span className="text-gradient">grocery cart</span>.
          </h1>

          <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            SmartCart AI turns a simple craving into a complete recipe and a
            ready-to-checkout grocery list — synced to your pantry, budget, and
            favorite local stores.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-11 px-6 text-base">
              <Link href="/assistant">
                Build my cart
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 text-base"
            >
              <Link href="/products">Browse products</Link>
            </Button>
          </div>

          <dl className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-semibold tabular-nums">
                  {stat.value}
                </dd>
                <dd className="text-sm text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        <FadeIn delay={0.2} className="lg:justify-self-end">
          <HeroVisual />
        </FadeIn>
      </div>
    </section>
  )
}
