import Link from "next/link";
import { Check } from "lucide-react";
import { corporateChecklist } from "@/data/site-data";

export function CorporateBanner() {
  return (
    <section className="corporate-banner">
      <div className="corporate-orbit corporate-orbit-one" />
      <div className="corporate-orbit corporate-orbit-two" />
      <div className="container corporate-content center">
        <div className="eyebrow">For UAE Businesses</div>
        <h2>Your Outsourced PRO &amp; Government Services Partner</h2>
        <p>We support manpower companies, facilities management companies, construction companies, trading companies and other UAE businesses with ongoing employee and government documentation requirements.</p>
        <div className="corporate-checklist">
          {corporateChecklist.map((item) => <span key={item}><i><Check size={12} /></i>{item}</span>)}
        </div>
        <Link className="btn gold" href="/corporate-services">Request Corporate Support</Link>
      </div>
    </section>
  );
}
