import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building,
  Building2,
  FileText,
  HardHat,
  Headphones,
  Layers,
  Languages,
  Landmark,
  BriefcaseBusiness,
  Package,
  Rocket,
  ShieldCheck,
  Store,
  Stamp,
  Users,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ServiceDetail = Service & {
  label: string;
  detail: string;
  items: string[];
  documents: string[];
  image?: string;
  faqs?: { q: string; a: string }[];
};

export const navigation = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/business-setup", "Business Setup"],
  ["/corporate-services", "Corporate Services"],
  ["/about", "About Us"],
  ["/contact", "Contact"],
] as const;

export const contentImages = {
  general: "/images/hero-uae-services.webp",
  visa: "/images/hero-visa-services.webp",
  business: "/images/hero-business-setup.webp",
  corporate: "/images/hero-corporate-services.webp",
} as const;

export const services: Service[] = [
  {
    slug: "business-setup",
    title: "Business Setup",
    description: "Mainland, free zone, trade license, establishment and investor-related services.",
    icon: Building2,
  },
  {
    slug: "pro-services",
    title: "PRO Services",
    description: "Corporate government procedures, employee visa processing and company immigration support.",
    icon: BriefcaseBusiness,
  },
  {
    slug: "visa-services",
    title: "Visa Services",
    description: "Employment, family, residence, visit, investor, partner, Green and Golden Visa assistance.",
    icon: BadgeCheck,
  },
  {
    slug: "mofa-attestation",
    title: "MOFA Attestation",
    description: "Assistance with educational, personal, commercial and other document attestation requirements.",
    icon: Stamp,
  },
  {
    slug: "translation-services",
    title: "Translation Services",
    description: "Arabic, English and legal translation assistance for official documents.",
    icon: Languages,
  },
  {
    slug: "typing-documents",
    title: "Typing & Documents",
    description: "Professional typing, document clearing, government applications and documentation support.",
    icon: FileText,
  },
];

export const serviceDetails: Record<string, ServiceDetail> = {
  "visa-services": {
    ...services[2],
    title: "Visa Services in UAE",
    label: "VISA SERVICES",
    detail: "Employment, family, residence, visit, investor, partner, Green and Golden Visa assistance with accurate documentation and clear communication.",
    image: "/images/generated-visa-hero.webp",
    items: ["Employment Visa", "Family Visa", "Residence Visa", "Visit Visa", "Investor & Partner Visa", "Green & Golden Visa", "Visa Renewal", "Visa Cancellation", "Change of Status", "Entry Permit", "Medical Typing", "Emirates ID"],
    documents: ["Passport copy (valid)", "Passport-size photograph (white background)", "Current visa page (if applicable)", "Emirates ID copy (if applicable)", "Sponsor or company documents (where required)"],
    faqs: [
      { q: "Can you assist with family visas?", a: "Yes. We assist with family and residence visa applications, renewals and related documentation." },
      { q: "How long does a visa process take?", a: "Timelines depend on the visa type and the relevant authority. We explain the expected process after reviewing your requirement." },
      { q: "Can I start through WhatsApp?", a: "Yes. Send us your requirement on WhatsApp and our team will guide you on the next steps." },
    ],
  },
  "pro-services": {
    ...services[1],
    title: "PRO Services in UAE",
    label: "PRO SERVICES",
    detail: "Professional PRO support for companies and individuals - government procedures, employee visa processing, immigration coordination and routine documentation handled by an experienced team.",
    image: "/images/generated-corporate-hero.webp",
    items: ["Employee Visa Processing", "Immigration Procedures", "Labour & Establishment Card", "Emirates ID Coordination", "Medical Typing", "Document Clearing", "Trade License Renewals", "Government Applications"],
    documents: ["Trade license copy", "Establishment card copy", "Employee passport copy", "Passport-size photograph", "Existing visa or Emirates ID (if applicable)"],
    faqs: [
      { q: "Do you provide corporate PRO services?", a: "Yes. We support companies with ongoing employee visa processing, immigration procedures and documentation." },
      { q: "Can you handle multiple employees?", a: "Yes. We regularly manage bulk and ongoing employee documentation for companies." },
      { q: "How do we start?", a: "Send your requirement on WhatsApp and our team will review it and guide you on the next steps." },
    ],
  },
  "business-setup": {
    ...services[0],
    title: "Business Setup in UAE",
    label: "BUSINESS SETUP",
    detail: "From mainland company formation to free zone setup, trade licenses and investor services, we help entrepreneurs and companies start and structure their business in the UAE with clear, professional guidance.",
    image: "/images/generated-business-hero.webp",
    items: ["Mainland Company Formation", "Free Zone Business Setup", "Trade License Services", "License Renewal", "Establishment Card", "Investor & Partner Visas", "Company Documentation", "Government Approvals"],
    documents: ["Passport copies of shareholders", "Passport-size photographs", "Proposed trade name options", "Business activity details", "Existing visa or Emirates ID (if applicable)"],
    faqs: [
      { q: "Mainland or free zone - which is right for me?", a: "It depends on your activity, market and budget. Share your plans with us and we will explain the suitable options." },
      { q: "Can you help with the trade license?", a: "Yes. We assist with new trade licenses, renewals and related government approvals." },
      { q: "Can I get an investor visa?", a: "Yes. We assist with investor and partner visa services linked to your company setup." },
    ],
  },
  "corporate-services": {
    slug: "corporate-services",
    title: "Corporate PRO & Government Services",
    description: "Ongoing government, employee and documentation support for UAE companies and employers.",
    icon: Landmark,
    label: "CORPORATE SERVICES",
    detail: "We support manpower companies, facilities management companies, construction companies, trading companies and other UAE businesses with ongoing employee and government documentation requirements.",
    image: "/images/generated-corporate-hero.webp",
    items: ["Ongoing PRO Support", "Bulk Employee Visa Processing", "Immigration & Labour Files", "Emirates ID & Medical Coordination", "Company Document Attestation", "License & Card Renewals", "Government Correspondence", "Compliance Support"],
    documents: ["Trade license copy", "Establishment card copy", "Employee passport copies", "Employee photographs", "Authorisation letter (where required)"],
    faqs: [
      { q: "Do you work with companies on a monthly basis?", a: "Yes. We provide ongoing support for companies with regular employee and government documentation requirements." },
      { q: "Which industries do you serve?", a: "Manpower, facilities management, construction, trading companies, SMEs and entrepreneurs." },
      { q: "How do we engage your team?", a: "Contact us on WhatsApp or by phone and we will review your requirements and propose a suitable support arrangement." },
    ],
  },
};

const seoService = (slug: string, label: string, title: string, detail: string, image: string, items: string[], documents: string[]): ServiceDetail => ({
  slug,
  title,
  description: detail,
  icon: FileText,
  label,
  detail,
  image: /visa|change-status|emirates-id|medical-typing/.test(slug)
    ? contentImages.visa
    : /corporate|pro-services/.test(slug)
      ? contentImages.corporate
      : /business|trade-license/.test(slug)
        ? contentImages.business
        : image,
  items,
  documents,
  faqs: seoServiceFaqs[slug],
});

const seoServiceFaqs: Record<string, { q: string; a: string }[]> = {
  "typing-documents": [
    { q: "What typing and document clearing services do you provide?", a: "We assist with government application typing, visa and Emirates ID applications, document clearing and related immigration or labour paperwork." },
    { q: "Can I send my documents on WhatsApp for a review?", a: "Yes. Send clear copies of your available documents and explain the service you need. Our team will identify the next steps and any missing requirements." },
    { q: "Do requirements vary by application?", a: "Yes. Requirements depend on the application, authority and individual case. We confirm the applicable checklist before submission." },
  ],
  "mofa-attestation": [
    { q: "Which documents can you assist with for attestation?", a: "We assist with educational, personal and commercial document attestation requirements and explain the applicable submission sequence." },
    { q: "Do you also help with translation before attestation?", a: "Yes. Where an Arabic or English translation is required, we can explain the translation and attestation steps for your document." },
    { q: "How long does document attestation take?", a: "Timing depends on the document, issuing country, authority and required approvals. We review the document first and explain the expected process." },
  ],
  "translation-services": [
    { q: "What languages do you support?", a: "We provide Arabic and English translation assistance for official, legal, personal and business documents." },
    { q: "Can translated documents be used for official applications?", a: "We review the document purpose and explain whether a certified or authority-accepted translation format is required for your application." },
    { q: "Can you translate certificates and business documents?", a: "Yes. We assist with certificates, personal documents, contracts, company documents and other official paperwork, subject to document review." },
  ],
  "employment-visa-uae": [
    { q: "What documents are needed for an employment visa?", a: "Usually a valid passport copy, white-background photograph, sponsor company documents and the current visa or entry stamp where applicable." },
    { q: "Do you handle the complete employment visa process?", a: "Yes. We assist with entry permit, status change, medical typing, Emirates ID coordination, residence processing and cancellation support." },
    { q: "Can you help if the employee is already in the UAE?", a: "Yes. We can review the current visa or entry status and explain the suitable in-country process." },
  ],
  "family-visa-uae": [
    { q: "Can you process spouse, children and parent visas?", a: "Yes. We assist with family residence visa applications for spouses, children and parents, subject to the applicable requirements." },
    { q: "Which family documents may need attestation?", a: "Marriage and birth certificates may need attestation and supporting documentation. We review the documents before submission." },
    { q: "Do you also handle family visa renewals and cancellations?", a: "Yes. We support renewals, cancellations and related entry permit or residence visa documentation." },
  ],
  "residence-visa-uae": [
    { q: "Do you assist with new residence visas and renewals?", a: "Yes. We support new applications, renewals, status changes and cancellations with the required typing and documentation." },
    { q: "What documents are required for a residence visa?", a: "Requirements normally include a passport copy, photograph, entry permit or current visa page, sponsor documents and Emirates ID for renewals." },
    { q: "Is Emirates ID processing included?", a: "Yes. We can coordinate Emirates ID typing and the related steps as part of the residence visa process." },
  ],
  "visit-visa-uae": [
    { q: "Do you assist with 30, 60 and 90-day visit visas?", a: "Yes. We help review the suitable visit visa option for family, friends and business visitors." },
    { q: "Can you help with a visit visa extension or status change?", a: "Yes. We assist with extensions, in-country status changes and the related application documentation where applicable." },
    { q: "What documents are needed for a visit visa application?", a: "A visitor passport copy and photograph are generally required. Sponsor details, relationship proof or travel information may also be needed depending on the case." },
  ],
  "visa-renewal-uae": [
    { q: "Which visa renewals do you handle?", a: "We assist with residence, dependent and employee visa renewals, including medical typing and Emirates ID coordination." },
    { q: "Can you coordinate the medical and Emirates ID steps?", a: "Yes. We help arrange the required medical typing and coordinate the Emirates ID renewal steps with the visa process." },
    { q: "What should I send for a renewal review?", a: "Send the passport copy, current visa page, Emirates ID copy, photograph and sponsor documents where applicable." },
  ],
  "visa-cancellation-uae": [
    { q: "Which visa types can you cancel?", a: "We assist with employment, family and residence visa cancellations, as well as related company card procedures where required." },
    { q: "Can you help after cancellation with transfer or exit steps?", a: "Yes. We explain the available next steps for exit, transfer or status change after reviewing the cancellation details." },
    { q: "What documents are needed for visa cancellation?", a: "The usual documents include the passport copy, current visa page, Emirates ID copy and sponsor or company documents." },
  ],
  "change-status-uae": [
    { q: "Can I change from a visit visa to a residence visa inside the UAE?", a: "In many cases an in-country status change may be possible. We review the current visa and new sponsor details before advising." },
    { q: "Do you handle status change after visa cancellation?", a: "Yes. We assist with status change after cancellation and explain the documents and sequence required for the new visa." },
    { q: "What documents should I provide for a status change review?", a: "Please share the passport, current visa or entry permit, new sponsor documents, photograph and previous cancellation paper if applicable." },
  ],
  "emirates-id-services": [
    { q: "Do you handle new, renewal and replacement Emirates ID applications?", a: "Yes. We assist with new applications, renewals, lost ID replacements and data updates or corrections." },
    { q: "Can you guide me on the biometrics appointment?", a: "Yes. We provide guidance on the biometrics appointment and the next steps connected with the Emirates ID application." },
    { q: "What documents are needed for Emirates ID typing?", a: "Usually a passport copy, residence visa or entry permit, photograph and previous Emirates ID copy for renewals or replacements." },
  ],
  "medical-typing-uae": [
    { q: "What medical typing services do you provide?", a: "We assist with medical fitness test typing for new residence visas, renewals and employee visa applications." },
    { q: "Do you guide me to the approved medical centre?", a: "Yes. We explain the approved medical centre process and the next steps after the application is submitted." },
    { q: "What should I send for medical typing?", a: "Please share the passport copy, visa page or entry permit, photograph, Emirates ID copy and sponsor details where applicable." },
  ],
  "corporate-pro-services-uae": [
    { q: "Can you act as an outsourced PRO department?", a: "Yes. We support routine government procedures, employee documentation, immigration requirements and renewal tracking for UAE companies." },
    { q: "Do you handle multiple employee visa applications?", a: "Yes. We can coordinate bulk and ongoing employee visa, medical and Emirates ID requirements for companies." },
    { q: "What company documents are required to start?", a: "Please share the trade license, establishment card, employee passport copies, authorisation letter and company contact details." },
  ],
  "mainland-business-setup-uae": [
    { q: "Can you help with the trade name, initial approval and mainland licence?", a: "Yes. We guide you through trade name reservation, initial approval, licensing, establishment card and related documentation." },
    { q: "Do you assist with investor and partner visas?", a: "Yes. Investor and partner visa assistance can be coordinated with the mainland company setup." },
    { q: "What documents are needed to start a mainland company setup?", a: "Usually shareholder passport copies, photographs, proposed trade names, business activity details and existing visa or Emirates ID information." },
  ],
  "free-zone-business-setup-uae": [
    { q: "Can you help me choose the right free zone?", a: "Yes. We compare the suitable free zone options based on your activity, business needs and budget." },
    { q: "Do you handle free zone formation, licensing and visas?", a: "Yes. We assist with company formation, trade licensing, establishment card, investor or employee visas and renewals." },
    { q: "What documents are needed for free zone setup?", a: "The initial review normally needs shareholder passport copies, photographs, proposed company names, activity details and existing visa or Emirates ID information." },
  ],
  "trade-license-services-uae": [
    { q: "Do you handle new, renewed and cancelled trade licences?", a: "Yes. We assist with new licences, renewals, amendments and cancellations for mainland and free zone companies." },
    { q: "Can you help with activity changes and approvals?", a: "Yes. We review the proposed activity or amendment and guide you on the required approvals and permits." },
    { q: "What should I send for a trade licence review?", a: "Please share the current trade licence, owner or partner passport copies, tenancy contract, proposed changes and establishment card copy." },
  ],
};

export const seoServiceDetails: Record<string, ServiceDetail> = {
  "typing-documents": seoService("typing-documents", "Typing & Documents UAE", "Typing & Document Clearing Services in UAE", "Professional typing, document clearing and government application support in Sharjah, Dubai and across the UAE, with clear guidance on requirements and next steps.", "/images/generated-documents-hero.webp", ["Government Application Typing", "Visa & Emirates ID Typing", "Document Clearing", "Immigration & Labour Applications", "Online Form Assistance", "Application Status Guidance"], ["Passport copy", "Current visa or entry permit", "Emirates ID copy where applicable", "Passport-size photograph", "Supporting documents for the application"]),
  "mofa-attestation": seoService("mofa-attestation", "MOFA Attestation UAE", "MOFA Attestation Services in UAE", "Assistance with educational, personal and commercial document attestation requirements, translation coordination and submission guidance in the UAE.", "/images/generated-documents-hero.webp", ["Educational Certificate Attestation", "Personal Document Attestation", "Commercial Document Attestation", "Document Review", "Translation Coordination", "Submission Guidance"], ["Original document or clear scan", "Passport copy", "Emirates ID copy where applicable", "Existing attestation stamps", "Translation or supporting documents where required"]),
  "translation-services": seoService("translation-services", "Translation Services UAE", "Arabic & English Translation Services in UAE", "Arabic and English translation assistance for official, legal, personal and business documents, with guidance on the format needed for your UAE application.", "/images/generated-documents-hero.webp", ["Arabic-English Translation", "Official Document Translation", "Legal Document Translation", "Certificate Translation", "Business Document Translation", "Attestation-Ready Translation Guidance"], ["Clear copy of the document", "Passport or Emirates ID copy where required", "Purpose of the translation", "Existing authority requirements", "Preferred language and format"]),
  "employment-visa-uae": seoService("employment-visa-uae", "Employment Visa UAE", "Employment Visa Services in UAE", "Complete employment visa assistance — from entry permit to residence visa stamping — for companies hiring employees and individuals starting work in the UAE.", "/images/generated-visa-hero.webp", ["Entry Permit", "Status Change", "Medical Typing", "Emirates ID", "Residence Visa", "Visa Cancellation"], ["Passport copy (valid for 6+ months)", "Passport-size photograph (white background)", "Company trade license copy (sponsor)", "Offer letter or labour approval details", "Current visa page or entry stamp"]),
  "family-visa-uae": seoService("family-visa-uae", "Family Visa UAE", "Family Visa Services in UAE", "Bring your family to the UAE with confidence. We assist with spouse, children and parent residence visas, guiding you through eligibility, documents and each step of the process.", "/images/generated-visa-hero.webp", ["Spouse Visa", "Children Visa", "Parents Visa", "Entry Permit", "Residence Visa", "Renewal & Cancellation"], ["Sponsor passport, visa and Emirates ID copies", "Attested marriage certificate", "Attested birth certificates", "Family passport copies and photographs", "Tenancy contract and salary proof"]),
  "residence-visa-uae": seoService("residence-visa-uae", "Residence Visa UAE", "Residence Visa Services in UAE", "New residence visas, renewals and status changes — handled with accurate typing, correct documentation and clear guidance at every step.", "/images/generated-visa-hero.webp", ["New Residence Visa", "Residence Visa Renewal", "Medical Typing", "Emirates ID", "Status Change", "Visa Cancellation"], ["Passport copy (valid)", "Passport-size photograph", "Entry permit or current visa page", "Sponsor documents", "Emirates ID copy for renewals"]),
  "visit-visa-uae": seoService("visit-visa-uae", "Visit Visa UAE", "Visit Visa Services in UAE", "Visit visa assistance for family, friends and business visitors — new applications, extensions and status changes handled quickly and professionally.", "/images/generated-visa-hero.webp", ["30 / 60 / 90-Day Visit Visas", "Visit Visa Extension", "Multiple Entry Options", "Family & Friend Visits", "Status Change", "Application Typing"], ["Visitor passport copy", "Passport-size photograph", "Sponsor Emirates ID and visa copy", "Relationship proof", "Travel details where required"]),
  "visa-renewal-uae": seoService("visa-renewal-uae", "Visa Renewal UAE", "Visa Renewal Services in UAE", "Renew residence and dependent visas on time, without the stress. We manage typing, medical, Emirates ID and renewal processing with clear communication throughout.", "/images/generated-visa-hero.webp", ["Residence Visa Renewal", "Dependent Visa Renewal", "Employee Visa Renewal", "Medical Typing", "Emirates ID Renewal", "Grace Period Guidance"], ["Passport copy", "Current residence visa page", "Emirates ID copy", "Passport-size photograph", "Sponsor documents"]),
  "visa-cancellation-uae": seoService("visa-cancellation-uae", "Visa Cancellation UAE", "Visa Cancellation Services in UAE", "Cancelling an employment, family or residence visa? We handle the cancellation process correctly so you can exit, transfer or change status without complications.", "/images/generated-visa-hero.webp", ["Employment Visa Cancellation", "Family Visa Cancellation", "Residence Visa Cancellation", "Company Card Cancellation", "Status Change After Cancellation", "Exit & Transfer Guidance"], ["Passport copy", "Current visa page", "Emirates ID copy", "Sponsor or company documents", "Cancellation request details"]),
  "change-status-uae": seoService("change-status-uae", "Change Status UAE", "Change Status Services in UAE", "Moving from a visit visa to a residence visa, or between visa categories? We assist with in-country status change procedures and the related documentation.", "/images/generated-visa-hero.webp", ["Visit to Residence Status Change", "In-Country Status Change", "Status Change After Cancellation", "Entry Permit Status Update", "Visa Transfer Guidance", "Related Documentation"], ["Passport copy", "Current visa or entry permit", "New sponsor documents", "Passport-size photograph", "Previous cancellation paper"]),
  "emirates-id-services": seoService("emirates-id-services", "Emirates ID Services", "Emirates ID Typing & Services in UAE", "Fast, accurate Emirates ID application typing — new applications, renewals, replacements and data updates, coordinated with your visa process.", "/images/generated-visa-hero.webp", ["New Emirates ID Typing", "Emirates ID Renewal", "Replacement of Lost ID", "Data Update & Correction", "Urgent Service Guidance", "Biometrics Appointment Guidance"], ["Passport copy", "Residence visa or entry permit", "Passport-size photograph", "Previous Emirates ID copy", "Application details form"]),
  "medical-typing-uae": seoService("medical-typing-uae", "Medical Typing UAE", "Medical Typing Services in UAE", "Medical fitness test typing for residence visas and renewals — fast, accurate applications with guidance on approved medical centres and next steps.", "/images/generated-documents-hero.webp", ["Medical Fitness Test Typing", "Visa Medical Applications", "Renewal Medical Typing", "Employee Medical Typing", "Urgent / VIP Typing Options", "Result Follow-Up Guidance"], ["Passport copy", "Visa page or entry permit", "Passport-size photograph", "Emirates ID copy", "Sponsor details"]),
  "corporate-pro-services-uae": seoService("corporate-pro-services-uae", "Corporate PRO Services UAE", "Corporate PRO Services in UAE", "Your outsourced PRO department. We manage routine government procedures, employee documentation and immigration requirements so your team can focus on the business.", "/images/generated-corporate-hero.webp", ["Dedicated PRO Support", "Bulk Employee Visa Processing", "Immigration & Labour Procedures", "Trade License & Card Renewals", "Company Document Attestation", "Compliance & Renewal Tracking"], ["Trade license copy", "Establishment card copy", "Employee passport copies", "Authorisation letter", "Company contact details"]),
  "mainland-business-setup-uae": seoService("mainland-business-setup-uae", "Mainland Business Setup UAE", "Mainland Business Setup in UAE", "Start your mainland company with professional guidance — trade name, initial approval, licensing, documentation and investor visas handled by one team.", "/images/generated-business-hero.webp", ["Mainland Trade License", "Trade Name Reservation", "Initial Approval & Documentation", "Establishment Card", "Investor & Partner Visas", "License Renewal & Amendments"], ["Shareholder passport copies", "Passport-size photographs", "Proposed trade names", "Business activity details", "Existing visa or Emirates ID"]),
  "free-zone-business-setup-uae": seoService("free-zone-business-setup-uae", "Free Zone Business Setup UAE", "Free Zone Business Setup in UAE", "Set up in the right UAE free zone for your activity and budget. We guide you through selection, formation, licensing, visas and renewals.", "/images/generated-business-hero.webp", ["Free Zone Selection Guidance", "Company Formation", "Free Zone Trade License", "Investor & Employee Visas", "Establishment Card", "License Renewals"], ["Shareholder passport copies", "Passport-size photographs", "Proposed company names", "Business activity description", "Existing visa or Emirates ID"]),
  "trade-license-services-uae": seoService("trade-license-services-uae", "Trade License Services UAE", "Trade License Services in UAE", "New trade licenses, renewals, amendments and cancellations — for mainland and free zone companies, handled with accurate documentation and clear timelines.", "/images/generated-business-hero.webp", ["New Trade License", "Trade License Renewal", "Activity Amendment", "Trade Name Change", "License Cancellation", "Approvals & Permits"], ["Current trade license copy", "Owner and partner passport copies", "Tenancy contract", "Proposed changes or activity details", "Establishment card copy"]),
};

export const processSteps = [
  ["01", "Contact Us", "Tell us what service you need."],
  ["02", "Requirement Check", "Our team reviews your requirement."],
  ["03", "Prepare Documents", "We help prepare the required documents and applications."],
  ["04", "Complete the Process", "We assist with the relevant processing and keep you informed."],
] as const;

export const trustItems = [
  { title: "Experienced Team", text: "Professional assistance for UAE documentation and government procedures.", icon: Users },
  { title: "Complete Solutions", text: "Multiple services under one roof.", icon: Layers },
  { title: "Transparent Service", text: "Clear communication about requirements and procedures.", icon: ShieldCheck },
  { title: "Dedicated Support", text: "Easy access through phone and WhatsApp.", icon: Headphones },
] as const;

export const industries = [
  { title: "Manpower Companies", text: "Employee visa and documentation support.", icon: Users },
  { title: "Facilities Management", text: "Ongoing employee processing and government support.", icon: Building },
  { title: "Construction Companies", text: "Employee and company documentation assistance.", icon: HardHat },
  { title: "Trading Companies", text: "Business and government service support.", icon: Package },
  { title: "SMEs", text: "Flexible corporate administration support.", icon: Store },
  { title: "Entrepreneurs", text: "Business setup and government services.", icon: Rocket },
] as const;

export const benefits = [
  ["01", "Professional Team", "Experienced assistance for UAE government and business procedures."],
  ["02", "One-Stop Solution", "Multiple services under one roof."],
  ["03", "Clear Communication", "We explain the process and requirements clearly."],
  ["04", "Convenient Support", "Contact our team through WhatsApp or phone."],
  ["05", "Corporate Solutions", "Ongoing support for companies and employers."],
  ["06", "Customer Focused", "We focus on reliable service and long-term relationships."],
] as const;

export const corporateChecklist = ["Employee Visa", "Emirates ID", "Medical", "Immigration", "Documentation", "Government Services"];

export const testimonials = [
  { quote: "Professional service and very helpful team. They explained everything clearly and handled the documentation smoothly.", name: "Customer", role: "Sample review" },
  { quote: "Quick response on WhatsApp and clear guidance on the visa process. Everything was handled step by step.", name: "Customer", role: "Sample review" },
  { quote: "They support our company with employee documentation and government procedures. Reliable and easy to work with.", name: "Customer", role: "Sample review" },
];

export const generalFaqs = [
  { q: "What services does DSN Groups provide?", a: "We assist with UAE visa services, PRO procedures, typing and document clearing, attestation, translation, corporate support and business setup." },
  { q: "Do you provide corporate PRO services?", a: "Yes. We support companies with employee visa processing, immigration procedures, government applications and recurring documentation." },
  { q: "Can you assist with family visas?", a: "Yes. We assist with spouse, children and parent residence visa applications, renewals, cancellations and related documentation." },
  { q: "Do you provide MOFA attestation assistance?", a: "Yes. We help review documents and guide you through the applicable attestation and submission requirements." },
  { q: "Can you help with business setup?", a: "Yes. We assist with mainland and free zone setup, trade licences, establishment documentation and investor or partner visa support." },
  { q: "Can I send my documents through WhatsApp?", a: "Yes. You can send your initial requirement and available documents through WhatsApp for a preliminary review." },
  { q: "How long does a service take?", a: "Timelines depend on the service, authority and individual case. We explain the expected process after reviewing your requirement." },
  { q: "Do you handle applications for companies with multiple employees?", a: "Yes. We support bulk and ongoing employee visa, medical, Emirates ID and government documentation requirements for companies." },
];
