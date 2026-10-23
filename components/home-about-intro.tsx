import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeAboutIntro() {
  return (
    <section className="section home-about">
      <div className="container home-about-grid">
        <div className="home-about-image-wrap">
          <div className="home-about-frame" />
          <div className="home-about-image" />
          <div className="home-about-badge"><strong>Sharjah</strong><span>Serving all of the UAE</span></div>
        </div>
        <div>
          <div className="eyebrow">— About DSN Groups</div>
          <h2 className="title">Making UAE Services Simple &amp; Hassle-Free</h2>
          <p className="subtitle">DSN Groups provides professional typing, document clearing, visa, PRO, attestation, translation and business support services for individuals, families, entrepreneurs and companies across the UAE.</p>
          <p className="subtitle">Our goal is to simplify complicated procedures through professional guidance, accurate documentation and efficient service.</p>
          <Link className="btn dark" href="/about">Learn More About Us <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}
