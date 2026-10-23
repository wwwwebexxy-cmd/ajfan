import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

export function CtaSection() {
  return (
    <section className="cta" id="contact-cta">
      <div className="cta-backdrop" aria-hidden="true" />
      <div className="container-site cta-content">
        <div className="eyebrow">We Are Ready When You Are</div>
        <h2>Need Assistance With a UAE Service?</h2>
        <p>Tell us what you need. Our team will review your requirement and guide you on the next steps.</p>
        <div className="actions">
          <a className="btn green cta-whatsapp" href="https://wa.me/971543145156" target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp Us Now</a>
          <a className="btn cta-call" href="tel:+971543145156"><Phone size={18} /> Call Us</a>
        </div>
      </div>
    </section>
  );
}
