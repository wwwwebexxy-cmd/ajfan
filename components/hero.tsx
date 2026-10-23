import Link from "next/link";
import { ArrowUpRight, CheckCircle2, FileCheck2, MessageCircle } from "lucide-react";

type HeroProps = {
  label: string;
  title: React.ReactNode;
  description: string;
  home?: boolean;
  image?: string;
};

export function Hero({ label, title, description, home = false, image }: HeroProps) {
  const backgroundImage = image ?? "/images/ajfan-hero-services.webp";

  if (home) {
    return (
      <section className="hero hero-home hero-home-redesign">
        <div className="container-site hero-home-layout">
          <div className="hero-home-copy">
            <div className="hero-eyebrow hero-home-eyebrow">
              <span className="hero-eyebrow-mark" />
              <span>{label}</span>
            </div>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="actions hero-home-actions">
              <Link className="btn gold hero-consult-cta" href="/contact"><span>Start Your Application</span><ArrowUpRight size={18} /></Link>
              <a className="btn hero-home-secondary" href="https://wa.me/971529812786"><MessageCircle size={18} /> WhatsApp Us</a>
            </div>
            <div className="hero-home-proof">
              <span className="hero-home-proof-label">Supporting individuals &amp; businesses across the UAE</span>
              <div className="hero-home-proof-items">
                <span>Visa</span><i /><span>PRO</span><i /><span>Typing</span><i /><span>Attestation</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="AJFAN Documents Clearing services">
            <div className="hero-visual-blob hero-visual-blob-teal" />
            <div className="hero-visual-blob hero-visual-blob-navy" />
            <div className="hero-visual-image" style={{ backgroundImage: `url("${backgroundImage}")` }} role="img" aria-label="AJFAN Documents Clearing team supporting UAE applications" />
            <div className="hero-float-card hero-float-card-checklist">
              <div className="hero-float-card-icon"><FileCheck2 size={19} /></div>
              <div><strong>Document clearing</strong><span>Clear next steps</span></div>
              <CheckCircle2 className="hero-float-card-check" size={18} />
            </div>
            <div className="hero-float-card hero-float-card-service">
              <span className="hero-float-card-kicker">AJFAN SERVICES</span>
              <strong>Visa &amp; PRO support</strong>
              <span>Professional guidance</span>
            </div>
            <div className="hero-visual-badge"><span>AE</span><strong>Sharjah</strong><small>Serving the UAE</small></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-backdrop" style={{ backgroundImage: `url("${backgroundImage}")` }} aria-hidden="true" />
      <div className="container-site">
        <div className="inner">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" />{label}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="crumb"><Link href="/">Home</Link><span className="crumb-separator">/</span><span>{label}</span></div>
        </div>
      </div>
    </section>
  );
}
