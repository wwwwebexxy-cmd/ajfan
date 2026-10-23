import { PageFrame } from "@/components/page-frame";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { serviceDetails } from "@/data/site-data";
import { serviceMetadata } from "@/lib/site-meta";

export const metadata = serviceMetadata(serviceDetails["visa-services"], "visa-services");

export default function VisaServicesPage() {
  return <PageFrame><ServiceDetailPage slug="visa-services" /></PageFrame>;
}
