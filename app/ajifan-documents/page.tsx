import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin-customers";

export const metadata: Metadata = {
  title: "Ajifan Documents Admin",
  description: "Private AJFAN customer administration.",
  robots: { index: false, follow: false },
};

export default function AjifanDocumentsPage() {
  return <AdminCustomers />;
}
