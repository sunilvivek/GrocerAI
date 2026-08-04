import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/motion/fade-in"
import { HOW_IT_WORKS_STEPS } from "@/constants/landing"

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-border/60 bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From craving to cart in four steps"
          description="No lists to type, no aisles to wander. Just describe what sounds good."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS_STEPS.map(({ step, title, description, icon: Icon }) => (
            <FadeIn key={step} delay={(step - 1) * 0.1}>
              <li className="group relative h-full rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span
                    className="text-4xl font-semibold text-foreground/10"
                    aria-hidden
                  >
                    {String(step).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  )
}
