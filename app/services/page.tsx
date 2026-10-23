import { CtaSection } from "@/components/cta-section";
import { FaqSection } from "@/components/faq-section";
import { Hero } from "@/components/hero";
import { PageFrame } from "@/components/page-frame";
import { ProcessSection } from "@/components/process-section";
import { ServiceGrid } from "@/components/service-grid";
import { generalFaqs } from "@/data/site-data";
import { pageMetadata } from "@/lib/site-meta";

export const metadata = pageMetadata({
  title: "UAE Government & Business Services",
  description: "Explore UAE visa, PRO, typing, document clearing, attestation, translation and business setup services from AJFAN Documents Clearing.",
  path: "/services",
  keywords: ["UAE government services", "typing services UAE", "document clearing UAE", "business services Sharjah"],
});

export default function ServicesPage() {
  return (
    <PageFrame>
      <Hero image="/images/ajfan-document-clearing.webp" label="Our Services" title="Complete UAE Government & Business Solutions" description="Visa, PRO, typing, document clearing, attestation, translation and business setup services â€” all under one roof." />
      <ServiceGrid />
      <ProcessSection />
      <FaqSection items={generalFaqs} />
      <CtaSection />
    </PageFrame>
  );
}
