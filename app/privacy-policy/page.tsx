import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { pageMetadata } from "@/lib/site-meta";

type PolicyBlock = {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
};

const policySections: { heading: string; blocks: PolicyBlock[] }[] = [
  {
    heading: "1. Who is responsible for your data",
    blocks: [{ paragraphs: ["The data controller is Al Tawakkal, Al Tawakkal Building, Near Second Signal Musaffah M10, Sanayya, Abu Dhabi, United Arab Emirates. For any privacy question or request, write to enquiry@altawakkal.ae or call +971 58 582 3883 and ask for the data protection contact."] }],
  },
  {
    heading: "2. Scope of this policy",
    blocks: [{ paragraphs: ["This policy covers personal data we collect through altawakkal.ae — our contact, quotation and registration forms, newsletter sign-ups, live-chat and WhatsApp links — and the email, phone and counter enquiries that follow from a website enquiry. It does not cover third-party websites we link to, or the government portals we submit applications through; those are governed by their own privacy notices."] }],
  },
  {
    heading: "3. Personal data we collect",
    blocks: [
      { heading: "Data you give us", items: ["Your name, email address, phone or WhatsApp number, company name, the service you are interested in, and your message.", "Documents or images you upload or send so we can handle an application: passport and Emirates ID copies, trade licence details, tenancy contracts, certificates and similar supporting papers.", "Billing and payment references when you engage us for a service."] },
      { heading: "Data collected automatically", paragraphs: ["IP address and approximate location, device and browser type, operating system, pages viewed, time on page, referring URL and outbound clicks — from server logs and analytics tools."] },
      { heading: "Data from your communications with us", paragraphs: ["Records of emails, chat transcripts, WhatsApp messages and call notes connected to your enquiry."] },
      { heading: "Newsletter", paragraphs: ["If you subscribe, we store your email address and your subscription status. Every marketing email we send contains an unsubscribe link, and unsubscribing removes you from future sends."] },
      { paragraphs: ["We do not ask for sensitive data (health, religious belief, biometric identifiers, political opinions) through website forms, and we ask you not to send it. Where an application legally requires such information, it is collected through the appropriate secure channel instead."] },
    ],
  },
  {
    heading: "4. Why we use your data",
    blocks: [{ items: [
      "To respond to your enquiry, prepare a quotation and confirm which service you need.",
      "To deliver the service you engage us for — PRO services, typing and document clearing, licence and visa applications, attestation and translation.",
      "To submit and track applications on government and typing portals where the law or the application requires it.",
      "To keep accounting, invoicing and statutory records.",
      "To send service updates and, only with your consent or where the law permits, marketing about related services.",
      "To protect the website and our records: spam and fraud prevention, rate limiting, security monitoring.",
      "To understand how the site is used so we can improve content and navigation.",
    ] }],
  },
  {
    heading: "5. Legal bases where the GDPR or UK GDPR applies",
    blocks: [{ paragraphs: ["If you are in the EU or UK, we rely on: your consent (marketing emails and non-essential cookies); performance of a contract (delivering a service you ordered); legal obligation (statutory records, government filings); and our legitimate interests (answering enquiries, securing the site, improving our services), balanced against your rights. Under UAE Federal Decree-Law No. 45 of 2021 (PDPL) we process personal data on comparable grounds."] }],
  },
  {
    heading: "6. Who we share it with",
    blocks: [
      { items: [
        "Service providers that run parts of our operation — web hosting and email delivery, form processing, newsletter delivery (Mailchimp), analytics (Google Analytics through Google Site Kit, Microsoft Clarity), advertising measurement (Meta Pixel), and live-chat / WhatsApp widgets. They act on our instructions and are bound by their own data-processing terms.",
        "Government bodies and typing, immigration and judicial portals (for example ICP, the Department of Economic Development, ADJD, the municipality, attestation authorities) where an application you asked us to handle requires it.",
        "Professional advisers — auditors, accountants and lawyers — where necessary and under confidentiality.",
        "Authorities where we are legally required to disclose, or to establish or defend a legal claim.",
      ] },
      { paragraphs: ["We do not sell personal data, and we do not share it so that third parties can build their own advertising lists."] },
    ],
  },
  {
    heading: "7. International transfers",
    blocks: [{ paragraphs: ["Some providers (hosting, email delivery, analytics, chat) process data outside the UAE, typically in the European Union or the United States. Where that happens we rely on the provider’s contractual safeguards and standard contractual clauses, and we limit what is shared to what the service needs."] }],
  },
  {
    heading: "8. How long we keep it",
    blocks: [{ items: [
      "Website enquiries that do not become client engagements: up to 24 months after the last contact.",
      "Client files and application documents: for the engagement, then for the retention period UAE record-keeping rules require (up to 5 years) and any applicable limitation period.",
      "Invoices and accounting records: as required by UAE tax and commercial law.",
      "Newsletter subscriptions: until you unsubscribe.",
      "Server and security logs: up to 12 months.",
    ] }],
  },
  {
    heading: "9. Cookies and similar technologies",
    blocks: [
      { paragraphs: ["altawakkal.ae uses cookies and similar browser storage for:"] },
      { items: [
        "Essential operation — keeping your session, remembering your preferences and protecting forms from abuse. These cannot be switched off without breaking the site.",
        "Analytics — aggregate statistics about which pages and services are used (Google Analytics, Microsoft Clarity).",
        "Advertising measurement — telling us whether an advert led to an enquiry (Meta Pixel).",
        "Embedded features — chat and WhatsApp widgets, video and map embeds, which may set their own cookies.",
      ] },
      { paragraphs: ["Where the law requires it, we ask for your consent before setting non-essential cookies, and you can withdraw that consent at any time. You can also block or delete cookies in your browser settings — blocking essential cookies may stop forms and sign-in from working. Deleting cookies does not delete data already collected; use the rights in section 10 for that."] },
    ],
  },
  {
    heading: "10. Your rights",
    blocks: [{ paragraphs: [
      "Subject to applicable law, you can ask us to: confirm what data we hold and give you a copy; correct inaccurate data; delete data we no longer need; restrict or object to certain processing, including direct marketing; provide your data in a portable format; and withdraw a consent you gave earlier.",
      "Email enquiry@altawakkal.ae with “Privacy request” in the subject line. We may ask you to confirm your identity, and we respond within 30 days unless the law allows longer, in which case we tell you why. If you are in the EU or UK you may also complain to your local supervisory authority; in the UAE you may contact the UAE Data Office.",
    ] }],
  },
  {
    heading: "11. Security",
    blocks: [{ paragraphs: ["The site is served over HTTPS. Access to enquiry and client records is limited to the staff who need it, we use access-controlled systems and backups, and we keep the number of third-party scripts able to see page data to a minimum. No method of transmission or storage is completely secure: if a breach affects your rights, we notify you and the relevant authority as required by law."] }],
  },
  {
    heading: "12. Children",
    blocks: [{ paragraphs: ["Our services are for businesses and adults. The website is not directed at children under 18 and we do not knowingly collect their data through it. If you believe a child has sent us personal data, contact us and we will delete it."] }],
  },
  {
    heading: "13. Links to other sites",
    blocks: [{ paragraphs: ["Pages on this site link to government portals, maps and social networks. Once you leave altawakkal.ae, the destination website’s privacy policy applies."] }],
  },
  {
    heading: "14. Changes to this policy",
    blocks: [{ paragraphs: ["We update this policy when our tools or the law change. The version published here is the current one, and the “last updated” date at the top always reflects the latest change. Where a change materially affects existing clients, we notify them by email when we hold an address."] }],
  },
  {
    heading: "15. Contact us",
    blocks: [{ paragraphs: ["Al Tawakkal", "Al Tawakkal Building, Near Second Signal Musaffah M10, Sanayya, Abu Dhabi, UAE", "Email: enquiry@altawakkal.ae", "Phone: +971 58 582 3883", "Or use our contact page."] }],
  },
];

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Read the privacy policy and how personal data is handled.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageFrame>
      <section className="section privacy-policy-section">
        <div className="container">
          <article className="privacy-policy-content">
            <header className="privacy-policy-heading">
              <div className="eyebrow">Legal</div>
              <h1 className="title">Privacy Policy</h1>
              <p className="privacy-policy-updated">Last updated: 21 October 2026</p>
            </header>
            <p className="privacy-policy-document-intro">Al Tawakkal (“we”, “us”, “our”) operates altawakkal.ae, the website for our business setup, typing, document clearing and government services in Abu Dhabi, United Arab Emirates. This policy explains what personal data we collect through the website and our enquiry channels, why we collect it, who we share it with, how long we keep it, and the choices and rights you have.</p>
            <div className="privacy-policy-document">
              {policySections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.blocks.map((block, blockIndex) => (
                    <div key={`${section.heading}-${blockIndex}`}>
                      {block.heading && <h3>{block.heading}</h3>}
                      {block.paragraphs?.map((paragraph, paragraphIndex) => (
                        <p key={`${section.heading}-${blockIndex}-${paragraphIndex}`}>{paragraph}</p>
                      ))}
                      {block.items && <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                    </div>
                  ))}
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </PageFrame>
  );
}
