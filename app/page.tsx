import { CtaSection } from "@/components/cta-section";
import { CorporateBanner } from "@/components/corporate-banner";
import { FaqSection } from "@/components/faq-section";
import { HomeAboutIntro } from "@/components/home-about-intro";
import { Hero } from "@/components/hero";
import { IndustriesSection } from "@/components/industries-section";
import { PageFrame } from "@/components/page-frame";
import { ProcessSection } from "@/components/process-section";
import { ServiceGrid } from "@/components/service-grid";
import { ServiceMarquee } from "@/components/service-marquee";
import { TestimonialsSection } from "@/components/testimonials-section";
import { TrustStrip } from "@/components/trust-strip";
import { WhyChooseSection } from "@/components/why-choose-section";
import { VisaCta } from "@/components/visa-cta";
import { generalFaqs } from "@/data/site-data";

export default function HomePage() {
  return (
    <PageFrame>
      <Hero
        home
        label="UAE Government & Business Services"
        title={<>Your Trusted Partner<br />for UAE Government<br /><span className="gold hero-title-accent">&amp; Business Services</span></>}
        description="Professional Visa, PRO, Typing, Document Clearing, Attestation, Translation and Business Setup Services across the UAE."
      />
      <ServiceMarquee />
      <TrustStrip />
      <HomeAboutIntro />
      <ServiceGrid />
      <CorporateBanner />
      <IndustriesSection />
      <WhyChooseSection />
      <ProcessSection />
      <VisaCta />
      <TestimonialsSection />
      <FaqSection items={generalFaqs} />
      <CtaSection />
    </PageFrame>
  );
}
