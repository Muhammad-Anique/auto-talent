import Header from "@/components/header";
import { HeroSection } from "@/components/landing/hero-section";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { SuccessRateSection } from "@/components/landing/success-rate-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <DashboardSection />
      <BenefitsSection />
      <SuccessRateSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
