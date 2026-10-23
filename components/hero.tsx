import Link from "next/link";
import { MessageCircle } from "lucide-react";

type HeroProps = {
  label: string;
  title: React.ReactNode;
  description: string;
  home?: boolean;
  image?: string;
};

export function Hero({ label, title, description, home = false, image }: HeroProps) {
  const backgroundImage = image ?? "/images/hero-uae-services.webp";
  return (
    <section className={`hero ${home ? "hero-home" : ""}`}>
      <div className="hero-backdrop" style={{ backgroundImage: `url("${backgroundImage}")` }} aria-hidden="true" />
      <div className="container-site">
        <div className="inner">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" />{label}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          {home ? (
            <div className="actions" style={{ justifyContent: "flex-start" }}>
              <Link className="btn gold hero-consult-cta" href="/contact"><span>Get a Free Consultation</span></Link>
              <a className="btn green" href="https://wa.me/971543145156"><MessageCircle size={18} /> WhatsApp Us</a>
            </div>
          ) : (
            <div className="crumb"><Link href="/">Home</Link><span className="crumb-separator">/</span><span>{label}</span></div>
          )}
          {home && <div className="hero-trust"><span>Professional Service</span><i /> <span>Transparent Process</span><i /> <span>Dedicated Support</span></div>}
        </div>
      </div>
    </section>
  );
}
