import { CtaSection } from "@/components/cta-section";
import { Hero } from "@/components/hero";
import { PageFrame } from "@/components/page-frame";
import { ContactCard } from "@/components/contact-card";
import { Clock } from "lucide-react";
import { pageMetadata } from "@/lib/site-meta";

export const metadata = pageMetadata({
  title: "Contact AJFAN Documents Clearing UAE",
  description: "Contact AJFAN Documents Clearing in Abu Dhabi for UAE visa, PRO, typing, documentation and business setup support.",
  path: "/contact",
  image: "/images/ajfan-business-setup.webp",
  keywords: ["contact UAE government services", "AJFAN Documents Clearing Abu Dhabi", "UAE visa WhatsApp"],
});

export default function ContactPage() {
  return (
    <PageFrame>
      <Hero image="/images/ajfan-business-setup.webp" label="Contact" title="Talk to Our Team" description="Tell us what you need â€” our team will review your requirement and guide you on the next steps." />
      <section className="section">
        <div className="container center">
          <div className="eyebrow">â€” Get In Touch</div>
          <h2 className="title">Reach Us the Easy Way</h2>
          <p className="subtitle">No forms, no waiting. Message us on WhatsApp or call directly.</p>
          <div className="contact-cards">
            <ContactCard type="whatsapp" title="WhatsApp" description="Fastest way to reach our team. Send your requirement and documents anytime." label="WhatsApp Us" href="https://wa.me/971529812786" />
            <ContactCard type="phone" title="Phone" description="Call us directly on 0529812786 during working hours." label="Call Now" href="tel:+971529812786" />
            <ContactCard type="office" title="Office" description="Al Ghalah St, Al Nahyan, Zone 1, Abu Dhabi." label="Get Directions" href="https://maps.google.com/?q=Ajfan+Typing+%26+Studio+Al+Ghalah+St+Al+Nahyan+Abu+Dhabi" />
          </div>
          <div className="contact-note"><Clock size={16} className="gold" /> WhatsApp messages are welcome anytime â€” we respond as soon as possible.</div>
        </div>
      </section>
      <CtaSection />
    </PageFrame>
  );
}
