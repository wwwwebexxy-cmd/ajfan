import { CtaSection } from "@/components/cta-section";
import { Hero } from "@/components/hero";
import { PageFrame } from "@/components/page-frame";
import { ProcessSection } from "@/components/process-section";
import { WhyChooseSection } from "@/components/why-choose-section";
import { contentImages } from "@/data/site-data";
import { pageMetadata } from "@/lib/site-meta";

export const metadata = pageMetadata({
  title: "About DSN Groups UAE",
  description: "Learn about DSN Groups, a Sharjah-based team providing professional UAE visa, PRO, typing and business services.",
  path: "/about",
  keywords: ["about DSN Groups", "DSN Dream Starts Now", "Sharjah government services", "UAE business support"],
});

export default function AboutPage() {
  return (
    <PageFrame>
      <Hero image="/images/generated-services-hero.webp" label="About Us" title="Making UAE Services Simple & Hassle-Free" description="DSN Groups is a professional services team based in Sharjah, supporting individuals, families, entrepreneurs and companies across the UAE." />
      <section className="section">
        <div className="container split">
          <div>
            <div className="eyebrow">— Who We Are</div>
            <h2 className="title">About DSN Groups</h2>
            <p className="subtitle">At DSN Groups, we are committed to empowering entrepreneurs, investors, individuals, and businesses with reliable, efficient, and tailored business solutions.</p>
            <p className="subtitle">With a strategic focus on the United Arab Emirates (UAE) and Europe, we provide a wide range of business setup, corporate support, and consultancy services designed to help our clients establish, manage, and grow with confidence.</p>
            <p className="subtitle">Our services include company formation and licensing, corporate administration, PRO services, visa assistance, HR consultancy, and connections to personal and business financing opportunities through our trusted service partners.</p>
            <p className="subtitle">We understand that every client has unique goals and challenges. That is why we take a personalised approach, offering practical guidance, transparent communication, and professional support at every stage of the journey.</p>
            <p className="subtitle">At DSN Groups, our mission is to simplify business processes, create valuable opportunities, and build lasting relationships based on trust, integrity, and excellence.</p>
            <p className="about-tagline">DSN Groups — Your Vision. Our Commitment. Shared Success.</p>
            <ul className="about-pillars">{["Professional guidance on every procedure", "Accurate documentation and typing", "Clear communication at every step", "Support through phone and WhatsApp"].map((item) => <li key={item}><span className="pillar-check">✓</span> {item}</li>)}</ul>
            <a className="btn dark" href="https://wa.me/971543145156">Talk to Our Team</a>
          </div>
          <div className="photo" style={{ backgroundImage: `url(${contentImages.corporate})` }} />
        </div>
      </section>
      <WhyChooseSection />
      <ProcessSection />
      <CtaSection />
    </PageFrame>
  );
}
