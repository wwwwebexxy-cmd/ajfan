import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageFrame } from "@/components/page-frame";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { seoServiceDetails } from "@/data/site-data";
import { serviceMetadata } from "@/lib/site-meta";

export function generateStaticParams() {
  return Object.keys(seoServiceDetails).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = seoServiceDetails[slug];
  return service ? serviceMetadata(service, slug) : {};
}

export default async function SeoServiceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!seoServiceDetails[slug]) notFound();
  return <PageFrame><ServiceDetailPage slug={slug} /></PageFrame>;
}
