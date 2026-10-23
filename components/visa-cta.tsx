import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function VisaCta() {
  return (
    <section className="visa-cta">
      <div className="container visa-cta-content">
        <div>
          <div className="eyebrow">Visa Assistance</div>
          <h2>Need Help With a UAE Visa?</h2>
          <p>From employment and family visas to renewals, cancellations and status changes, our team can guide you through the requirements.</p>
        </div>
        <div className="actions">
          <Link className="btn gold" href="/visa-services">Explore Visa Services <ArrowRight size={16} /></Link>
          <a className="btn outline-light" href="https://wa.me/971543145156"><MessageCircle size={17} /> Ask on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
