import { Categories } from "@/features/landing/categories/categories";
import { Faq } from "@/features/landing/faq/faq";
import { Features } from "@/features/landing/features/features";
import { Hero } from "@/features/landing/hero/hero";
import { HowItWorks } from "@/features/landing/how-it-works/how-it-works";
import { Testimonials } from "@/features/landing/testimonials/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <Faq />
    </>
  );
}
