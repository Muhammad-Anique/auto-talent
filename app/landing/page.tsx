import Header from "@/components/header";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { ResumeExamplesSection } from "@/components/landing/resume-examples-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SuccessRateSection } from "@/components/landing/success-rate-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50 pt-16 sm:pt-20">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <ResumeExamplesSection />
      <PricingSection />
      <SuccessRateSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
