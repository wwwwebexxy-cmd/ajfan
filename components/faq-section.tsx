"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const answers = [
  "Yes. Our team reviews your requirement and guides you through the applicable process and documentation.",
  "Processing time depends on the service, authority and individual case. Contact our team for a case-specific estimate.",
  "Yes. You can contact our team through WhatsApp to share your initial requirement and available documents.",
];

type FaqItem = { q: string; a: string };

export function FaqSection({ questions, items, showCta = true }: { questions?: string[]; items?: FaqItem[]; showCta?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const faqItems = items ?? (questions ?? []).map((question, index) => ({ q: question, a: answers[index % answers.length] }));
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="section soft faq-section">
      <div className="container-site center">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
        <div className="eyebrow">FAQ</div>
        <h2 className="title">Frequently Asked Questions</h2>
        <div className="faq">
          {faqItems.map((item, index) => {
            const isOpen = open === index;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
                <button className="faq-q" type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)}>
                  <span>{item.q}</span><ChevronDown size={19} />
                </button>
                <div className="faq-a"><span>{item.a}</span></div>
              </div>
            );
          })}
        </div>
        {showCta && <a className="faq-ask-button" href="https://wa.me/971543145156" target="_blank" rel="noopener noreferrer">Ask Us Your Question</a>}
      </div>
    </section>
  );
  
}
