import Link from "next/link"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/motion/stagger"
import { CATEGORIES } from "@/constants/landing"
import { cn } from "@/lib/utils"

export function Categories() {
  return (
    <section id="categories" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Shop by category"
          title="Popular categories"
          description="Every aisle you love, curated by hand and refreshed with what's in season."
        />

        <Stagger className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ name, description, icon: Icon, gradient }) => (
            <StaggerItem key={name}>
              <Link
                href={`/products?category=${encodeURIComponent(name.toLowerCase())}`}
                className={cn(
                  "group flex h-full flex-col gap-4 rounded-2xl border border-border/70 bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5",
                  gradient,
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-card/80 text-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
