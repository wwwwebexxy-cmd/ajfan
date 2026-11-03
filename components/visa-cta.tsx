import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function VisaCta() {
  return (
    <section className="visa-cta">
      <div className="container visa-cta-content">
        <div>
          <div className="eyebrow">Family visa service</div>
          <h2>Need Help With a Family Visa?</h2>
          <p>For spouse, children and parent visas, our team can guide you through the requirements.</p>
        </div>
        <div className="actions">
          <Link className="btn gold" href="/visa-services">Explore Family visa service <ArrowRight size={16} /></Link>
          <a className="btn outline-light" href="https://wa.me/971529812786"><MessageCircle size={17} /> Ask on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
