import type { Metadata } from "next";
import "./globals.css";
import { services } from "@/data/site-data";
import {
  businessEmail,
  businessLocations,
  businessPhone,
  siteAlternateName,
  siteDescription,
  siteKeywords,
  siteName,
  siteUrl,
  socialProfiles,
} from "@/lib/site-meta";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | UAE Government & Business Services`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteAlternateName,
  category: "business services",
  alternates: { canonical: "/" },
  icons: {
    icon: "/dsn-group-logo.webp",
    shortcut: "/dsn-group-logo.webp",
    apple: "/dsn-group-logo.webp",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} | UAE Government & Business Services`,
    description: siteDescription,
    locale: "en_AE",
    images: [{ url: "/images/hero-uae-services.webp", width: 2056, height: 765, alt: "UAE government and business services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | UAE Government & Business Services`,
    description: siteDescription,
    images: ["/images/hero-uae-services.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: siteName,
    alternateName: siteAlternateName,
    url: siteUrl,
    image: `${siteUrl}/images/hero-uae-services.webp`,
    logo: { "@type": "ImageObject", url: `${siteUrl}/dsn-group-logo.webp` },
    description: siteDescription,
    telephone: businessPhone,
    email: businessEmail,
    priceRange: "$$",
    address: businessLocations[0].address,
    location: businessLocations.map((location) => ({
      "@type": "Place",
      name: location.name,
      address: location.address,
      hasMap: location.map,
    })),
    areaServed: [
      { "@type": "City", name: "Sharjah" },
      { "@type": "City", name: "Dubai" },
      { "@type": "Country", name: "United Arab Emirates" },
    ],
    availableLanguage: ["English", "Arabic"],
    sameAs: socialProfiles,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: businessPhone,
      email: businessEmail,
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "UAE government and business services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          url: `${siteUrl}${["visa-services", "pro-services", "business-setup", "corporate-services", "typing-documents", "mofa-attestation", "translation-services"].includes(service.slug) ? `/${service.slug}` : "/services"}`,
          provider: { "@id": `${siteUrl}/#business` },
          areaServed: { "@type": "Country", name: "United Arab Emirates" },
        },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    publisher: { "@id": `${siteUrl}/#business` },
    inLanguage: "en-AE",
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
      </body>
    </html>
  );
}
