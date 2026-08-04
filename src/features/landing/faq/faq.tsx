import { SectionHeading } from "@/components/shared/section-heading"
import { FadeIn } from "@/components/shared/motion/fade-in"
import { FaqAccordion } from "@/features/landing/faq/faq-accordion"
import { FAQS } from "@/constants/landing"

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know before your first SmartCart run."
        />

        <FadeIn className="mt-12">
          <FaqAccordion items={FAQS} />
        </FadeIn>
      </div>
    </section>
  )
}
