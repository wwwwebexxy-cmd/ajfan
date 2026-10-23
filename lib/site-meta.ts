import type { Metadata } from "next";
import type { ServiceDetail } from "@/data/site-data";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://advancedsolution.ae").replace(/\/+$/, "");
export const siteName = "DSN Groups";
export const siteAlternateName = "DSN: Dream Starts Now";
export const siteDescription = "DSN Groups provides professional UAE visa, PRO, typing, attestation, translation and business setup services in Sharjah and across the UAE.";
export const businessPhone = "+971543145156";
export const businessEmail = "info@dsngroups.com";
export const whatsappUrl = `https://wa.me/${businessPhone.replace(/\D/g, "")}`;
export const socialProfiles = [
  "https://www.instagram.com/dsngroups",
  "https://www.facebook.com/people/DSN-Groups/61594177463846/",
];
export const siteKeywords = [
  "DSN Groups",
  "DSN Dream Starts Now",
  "UAE government services",
  "visa services UAE",
  "PRO services UAE",
  "business setup UAE",
  "typing services Sharjah",
  "document clearing UAE",
  "MOFA attestation UAE",
  "translation services UAE",
  "Emirates ID services",
];

export const businessLocations = [
  {
    name: "DSN Groups Sharjah Office",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shams Business Centre, Media City Free Zone, Al Messaned",
      addressLocality: "Sharjah",
      addressCountry: "AE",
    },
    map: "https://maps.google.com/?q=Shams+Business+Centre+Media+City+Free+Zone+Al+Messaned+Sharjah",
  },
] as const;

export function pageMetadata({
  title,
  description,
  path,
  image = "/images/hero-uae-services.webp",
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
    keywords: [service.title, ...service.items, `${service.title} Sharjah`, `${service.title} Dubai`, "UAE services"],
  });
}
