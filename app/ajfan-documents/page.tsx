import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin-customers";

export const metadata: Metadata = {
  title: "Ajfan Documents Admin",
  description: "Private AJFAN customer administration.",
  robots: { index: false, follow: false },
};

export default function AjfanDocumentsPage() {
  return <AdminCustomers />;
}
