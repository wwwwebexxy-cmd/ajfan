import Link from "next/link";
import { ArrowRight, Check, FileCheck, MessageCircle } from "lucide-react";
import { seoServiceDetails, serviceDetails } from "@/data/site-data";
import { Hero } from "./hero";
import { FaqSection } from "./faq-section";
import { CtaSection } from "./cta-section";
import { businessEmail, businessPhone, siteName, siteUrl } from "@/lib/site-meta";

const helpLinks: Record<string, string> = {
  "Employment Visa": "/employment-visa-uae",
  "Family Visa": "/family-visa-uae",
  "Residence Visa": "/residence-visa-uae",
  "Visit Visa": "/visit-visa-uae",
  "Visa Renewal": "/visa-renewal-uae",
  "Visa Cancellation": "/visa-cancellation-uae",
  "Change of Status": "/change-status-uae",
  "Medical Typing": "/medical-typing-uae",
  "Emirates ID": "/emirates-id-services",
  "Emirates ID Coordination": "/emirates-id-services",
  "Employee Visa Processing": "/employment-visa-uae",
  "Trade License Renewals": "/trade-license-services-uae",
  "Mainland Company Formation": "/mainland-business-setup-uae",
  "Free Zone Business Setup": "/free-zone-business-setup-uae",
  "Trade License Services": "/trade-license-services-uae",
  "Ongoing PRO Support": "/corporate-pro-services-uae",
};

const defaultFaqs = [
  { q: "Can you assist with this service?", a: "Yes. Our team reviews your requirement and guides you through the applicable process and documentation." },
  { q: "How long does the process take?", a: "Processing time depends on the service, authority and individual case. Contact our team for a case-specific estimate." },
  { q: "Can I start through WhatsApp?", a: "Yes. You can contact our team through WhatsApp to share your initial requirement and available documents." },
];

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = serviceDetails[slug] ?? seoServiceDetails[slug];
  if (!service) return null;

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/${slug}#service`,
        name: service.title,
        serviceType: service.title,
        description: service.detail,
        url: `${siteUrl}/${slug}`,
        image: new URL(service.image ?? "/images/hero-uae-services.webp", siteUrl).toString(),
        provider: {
          "@id": `${siteUrl}/#business`,
          "@type": "LocalBusiness",
          name: siteName,
          url: siteUrl,
          telephone: businessPhone,
          email: businessEmail,
        },
        areaServed: [
          { "@type": "City", name: "Sharjah" },
          { "@type": "City", name: "Dubai" },
          { "@type": "Country", name: "United Arab Emirates" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: service.title,
          itemListElement: service.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: service.title, item: `${siteUrl}/${slug}` },
        ],
      },
    ],
  };
  const faqs = service.faqs ?? defaultFaqs;
  const whatsappHref = `https://wa.me/971543145156?text=${encodeURIComponent(`Hello DSN Groups, I am interested in ${service.title}. Please share the requirements and procedure.`)}`;
  const ctaLabel = service.slug === "business-setup"
    ? "Start Your Business"
    : service.slug === "visa-services"
      ? "Check Visa Requirement"
      : service.slug === "pro-services" || service.slug === "corporate-services"
        ? "Request Corporate Support"
        : "Send Your Requirement";

  return (
    <div className="service-detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }} />
      <Hero image={service.image} label={service.label} title={service.title} description={service.detail} />

      <section className="service-overview-section">
        <div className="container-site service-overview-grid">
          <div>
            <div className="service-section-heading">
              <div className="eyebrow">Overview</div>
              <h2>What We Can Help With</h2>
            </div>
            <div className="service-help-grid">
              {service.items.map((item) => {
                const href = helpLinks[item];
                const card = (
                  <>
                    <span className="service-help-icon"><Check size={14} /></span>
                    <span className="service-help-label">{item}</span>
                    {href && <ArrowRight className="service-help-arrow" size={16} />}
                  </>
                );
                return href ? <Link className="service-help-card service-help-card-link" href={href} key={item}>{card}</Link> : <div className="service-help-card" key={item}>{card}</div>;
              })}
            </div>

            <h2 className="service-process-title">Our Process</h2>
            <div className="service-process-list">
              {[
                ["01", "Contact Us", "Tell us what service you need."],
                ["02", "Requirement Check", "Our team reviews your requirement."],
                ["03", "Prepare Documents", "We help prepare the required documents and applications."],
                ["04", "Complete the Process", "We assist with the relevant processing and keep you informed."],
              ].map(([number, title, description]) => (
                <div className="service-process-step" key={number}>
                  <span className="service-process-dot" />
                  <div>
                    <h3>{number} <span>—</span> {title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="service-sidebar">
            <div className="service-photo-wrap">
              <img src={service.image ?? "/images/hero-uae-services.webp"} alt={service.title} className="service-photo-image" />
            </div>
            <div className="service-documents">
              <div className="service-documents-heading">
                <span className="service-documents-icon"><FileCheck size={20} /></span>
                <h3>Documents Required</h3>
              </div>
              <ul>
                {service.documents.map((document) => <li key={document}><Check size={16} /> <span>{document}</span></li>)}
              </ul>
              <p className="service-documents-note">Exact requirements depend on your case — send your documents on WhatsApp for a quick review.</p>
            </div>
            <a className="service-page-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} /> {ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} showCta={false} />
      <CtaSection />
    </div>
  );
}
