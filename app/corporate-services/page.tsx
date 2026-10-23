import { PageFrame } from "@/components/page-frame";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { serviceDetails } from "@/data/site-data";
import { serviceMetadata } from "@/lib/site-meta";

export const metadata = serviceMetadata(serviceDetails["corporate-services"], "corporate-services");

export default function CorporateServicesPage() {
  return <PageFrame><ServiceDetailPage slug="corporate-services" /></PageFrame>;
}
