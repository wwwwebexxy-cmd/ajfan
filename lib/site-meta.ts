import type { Metadata } from "next";
import type { ServiceDetail } from "@/data/site-data";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3001").replace(/\/+$/, "");
export const siteName = "AJFAN Documents Clearing";
export const siteAlternateName = "AJFAN Typing";
export const siteDescription = "AJFAN Documents Clearing provides professional UAE visa, PRO, typing, attestation, translation and business setup services in Abu Dhabi and across the UAE.";
export const businessPhone = "+971529812786";
export const businessEmail = "ajfantyping@gmail.com";
export const whatsappUrl = `https://wa.me/${businessPhone.replace(/\D/g, "")}`;
export const socialProfiles = [
  "https://www.instagram.com/ajfan_typing?dlrf=aWFscHhtcjNla2R4&utm_source=qr",
  "https://www.facebook.com/share/1FCMCfVwu2/?mibextid=wwXIfr",
];
export const siteKeywords = [
  "AJFAN Documents Clearing",
  "AJFAN Typing Services",
  "UAE government services",
  "visa services UAE",
  "PRO services UAE",
  "business setup UAE",
  "typing services Abu Dhabi",
  "typing centre Abu Dhabi",
  "visa typing Abu Dhabi",
  "document clearing Abu Dhabi",
  "document clearing UAE",
  "MOFA attestation UAE",
  "translation services UAE",
  "Emirates ID services",
  "corporate PRO support Abu Dhabi",
  "mainland business setup Abu Dhabi",
];

export const businessLocations = [
  {
    name: "Ajfan Typing & Studio",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Ghalah St, Al Nahyan, Zone 1",
      addressLocality: "Abu Dhabi",
      addressCountry: "AE",
    },
    map: "https://maps.google.com/?q=Ajfan+Typing+%26+Studio+Al+Ghalah+St+Al+Nahyan+Abu+Dhabi",
  },
] as const;

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/ajfan-hero-services.webp",
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();
  return {
    title,
    description,
    keywords: Array.from(new Set([...keywords, ...siteKeywords])),
    alternates: { canonical: url },
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: { telephone: true, email: true, address: true },
    other: {
      "geo.region": "AE-AZ",
      "geo.placename": "Abu Dhabi, United Arab Emirates",
      "business:contact_data:locality": "Abu Dhabi",
      "business:contact_data:country_name": "United Arab Emirates",
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      locale: "en_AE",
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
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
}

export function serviceMetadata(service: ServiceDetail, slug: string): Metadata {
  return pageMetadata({
    title: service.title,
    description: service.detail,
    path: `/${slug}`,
    image: service.image,
    keywords: [service.title, ...service.items, `${service.title} Abu Dhabi`, `${service.title} Dubai`, "UAE services"],
  });
}
