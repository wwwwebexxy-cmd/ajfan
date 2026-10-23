import { PageFrame } from "@/components/page-frame";
import { ServiceDetailPage } from "@/components/service-detail-page";
import { serviceDetails } from "@/data/site-data";
import { serviceMetadata } from "@/lib/site-meta";

export const metadata = serviceMetadata(serviceDetails["business-setup"], "business-setup");

export default function BusinessSetupPage() {
  return <PageFrame><ServiceDetailPage slug="business-setup" /></PageFrame>;
}
