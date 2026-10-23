import { CtaSection } from "@/components/cta-section";
import { Hero } from "@/components/hero";
import { PageFrame } from "@/components/page-frame";
import { ContactCard } from "@/components/contact-card";
import { Clock } from "lucide-react";
import { pageMetadata } from "@/lib/site-meta";

export const metadata = pageMetadata({
  title: "Contact DSN Groups UAE",
  description: "Contact DSN Groups in Sharjah for UAE visa, PRO, typing, documentation and business setup support.",
  path: "/contact",
  image: "/images/hero-corporate-services.webp",
  keywords: ["contact UAE government services", "DSN Groups Sharjah", "UAE visa WhatsApp"],
});

export default function ContactPage() {
  return (
    <PageFrame>
      <Hero image="/images/generated-corporate-hero.webp" label="Contact" title="Talk to Our Team" description="Tell us what you need — our team will review your requirement and guide you on the next steps." />
      <section className="section">
        <div className="container center">
          <div className="eyebrow">— Get In Touch</div>
          <h2 className="title">Reach Us the Easy Way</h2>
          <p className="subtitle">No forms, no waiting. Message us on WhatsApp or call directly.</p>
          <div className="contact-cards">
            <ContactCard type="whatsapp" title="WhatsApp" description="Fastest way to reach our team. Send your requirement and documents anytime." label="WhatsApp Us" href="https://wa.me/971543145156" />
            <ContactCard type="phone" title="Phone" description="Call us directly on +971 54 314 5156 during working hours." label="Call Now" href="tel:+971543145156" />
            <ContactCard type="office" title="Office" description="Shams Business Centre, Media City Free Zone, Al Messaned, Sharjah." label="Get Directions" href="https://maps.google.com/?q=Shams+Business+Centre+Media+City+Free+Zone+Al+Messaned+Sharjah" />
          </div>
          <div className="contact-note"><Clock size={16} className="gold" /> WhatsApp messages are welcome anytime — we respond as soon as possible.</div>
        </div>
      </section>
      <CtaSection />
    </PageFrame>
  );
}
