import { PageFrame } from "@/components/page-frame";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { serviceDetails } from "@/data/site-data";
import { serviceMetadata } from "@/lib/site-meta";

export const metadata = serviceMetadata(serviceDetails["pro-services"], "pro-services");

export default function ProServicesPage() {
  return <PageFrame><ServiceDetailPage slug="pro-services" /></PageFrame>;
}
