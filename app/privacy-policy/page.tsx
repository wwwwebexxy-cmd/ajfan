import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { businessEmail, businessLocations, businessPhone, pageMetadata, siteAlternateName, siteName } from "@/lib/site-meta";

type PolicyBlock = {
  heading?: string;
  paragraphs?: string[];
  items?: string[];
};

const businessAddress = [
  businessLocations[0].address.streetAddress,
  businessLocations[0].address.addressLocality,
  "United Arab Emirates",
].join(", ");
const displayPhone = businessPhone.replace(/^\+971(\d{2})(\d{3})(\d{4})$/, "+971 $1 $2 $3");

const policySections: { heading: string; blocks: PolicyBlock[] }[] = [
  {
    heading: "1. About AJFAN and this policy",
    blocks: [{ paragraphs: [`${siteName}, also presented as ${siteAlternateName}, provides UAE visa, PRO, typing and document clearing, attestation, translation, and business setup support. This policy explains how AJFAN handles personal information when you use this website, contact our team, or ask us to help with a service.`, `For privacy questions or requests, contact AJFAN at ${businessEmail} or ${displayPhone}.`] }],
  },
  {
    heading: "2. Where this policy applies",
    blocks: [{ paragraphs: ["This policy covers information you give AJFAN through email, phone, WhatsApp, or in person, along with basic technical information that may be recorded when you visit this website. The public website provides information and links to contact AJFAN; it does not currently provide a newsletter sign-up, public account registration, live chat, or enquiry form.", "Government portals and third-party services linked from this website have their own privacy policies and practices."] }],
  },
  {
    heading: "3. Information AJFAN may handle",
    blocks: [
      { heading: "Information you provide", items: ["Your name, phone or WhatsApp number, email address, company details, the service you ask about, and the details in your message.", "Documents and application details you choose to share with AJFAN for a requested service, such as passport or Emirates ID information, visa details, certificates, or business documents.", "Information about services requested, quotations, payments, and related communications where needed to provide or record a service."] },
      { heading: "Basic technical information", paragraphs: ["The website hosting and security services may record technical details such as an IP address, browser or device information, request time, and pages requested to deliver and protect the website."] },
    ],
  },
  {
    heading: "4. How AJFAN uses information",
    blocks: [{ items: [
      "To respond to enquiries and explain relevant UAE services.",
      "To provide the service you request, including preparing or supporting visa, PRO, typing, document clearing, attestation, translation, and business setup applications.",
      "To communicate about your request, quotation, service progress, or documents you provide.",
      "To keep service, accounting, and business records and meet applicable legal requirements.",
      "To operate, maintain, and protect this website and AJFAN's systems.",
    ] }],
  },
  {
    heading: "5. Legal basis and UAE data protection",
    blocks: [{ paragraphs: ["AJFAN handles personal information as permitted by applicable law. Depending on the request, this may be necessary to respond to you, provide a service you request, meet a legal obligation, protect legitimate business interests, or act on consent where consent is required.", "Where it applies, AJFAN handles personal data in line with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and other applicable requirements."] }],
  },
  {
    heading: "6. When information may be shared",
    blocks: [
      { paragraphs: ["AJFAN may share only the information needed for the relevant purpose with:"] },
      { items: [
        "Staff and service providers who help operate the website, communicate with customers, or provide AJFAN's services.",
        "Relevant UAE government departments, authorities, or application portals when you ask AJFAN to prepare or submit an application and the information is needed for that service.",
        "Professional advisers or authorities where required to meet legal obligations or handle a legal claim.",
      ] },
      { paragraphs: ["This website links to WhatsApp, maps, Instagram, and Facebook. If you use those services, the relevant provider handles information under its own privacy policy."] },
    ],
  },
  {
    heading: "7. Storage and international processing",
    blocks: [{ paragraphs: ["Website hosting, email, messaging, or other service providers may process information in locations outside the UAE. Where a transfer is subject to legal requirements, AJFAN will handle it in accordance with those requirements. Third-party providers' own privacy notices explain their processing in more detail."] }],
  },
  {
    heading: "8. How long information is kept",
    blocks: [{ paragraphs: ["AJFAN keeps information for as long as it is reasonably needed to respond to you, provide and document a service, meet applicable record-keeping requirements, resolve disputes, and protect business systems. When it is no longer needed for those purposes, it will be deleted or securely disposed of where appropriate and permitted by law."] }],
  },
  {
    heading: "9. Cookies and website links",
    blocks: [{ paragraphs: ["The public website does not currently include analytics or advertising scripts in its application code. The hosting provider may use essential technical storage or logs to deliver and protect the website. External websites or apps linked here may use their own cookies or similar technologies under their own policies.", "You can manage cookies and storage through your browser settings. Blocking essential technical storage may affect how a website works."] }],
  },
  {
    heading: "10. Your choices and data rights",
    blocks: [{ paragraphs: ["Subject to applicable law, you may ask AJFAN about personal information relating to you, request correction of inaccurate information, or request deletion or restriction of processing where those rights apply. You may also withdraw consent where processing is based on your consent.", `To make a privacy request, email ${businessEmail} with “Privacy request” in the subject line or call ${displayPhone}. AJFAN may need to verify your identity before responding. You may also contact the UAE Data Office where applicable.`] }],
  },
  {
    heading: "11. Protecting information",
    blocks: [{ paragraphs: ["AJFAN takes reasonable steps to protect information handled for its website and services. No online transmission or storage method can be guaranteed completely secure. Please use AJFAN's contact details if you have a concern about information you have shared."] }],
  },
  {
    heading: "12. Information about children",
    blocks: [{ paragraphs: ["Some family or visa services may involve information about a child. Where an application requires a child's information, a parent or legal guardian should provide it and be authorized to do so."] }],
  },
  {
    heading: "13. Changes to this policy",
    blocks: [{ paragraphs: ["AJFAN may update this policy when its services, website, or applicable requirements change. The date at the top of this page shows when it was last updated."] }],
  },
  {
    heading: "14. Contact AJFAN",
    blocks: [{ paragraphs: [siteName, businessAddress, `Email: ${businessEmail}`, `Phone: ${displayPhone}`, "WhatsApp: contact us using the same phone number."] }],
  },
];

export const metadata: Metadata = pageMetadata({
  title: "AJFAN Privacy Policy",
  description: "Learn how AJFAN Documents Clearing handles personal information for its UAE services and website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageFrame>
      <section className="section privacy-policy-section no-scroll-reveal">
        <div className="container">
          <article className="privacy-policy-content">
            <header className="privacy-policy-heading">
              <div className="eyebrow">AJFAN Documents Clearing</div>
              <h1 className="title">Privacy Policy</h1>
              <p className="privacy-policy-updated">Last updated: 8 November 2026</p>
            </header>
            <p className="privacy-policy-document-intro">This policy describes how {siteName} ({siteAlternateName}) handles information when you visit this website, contact our team, or request our UAE government and business services.</p>
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
