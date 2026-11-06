"use client";

import Link from "next/link";
import { BriefcaseBusiness, FileCheck2, FileText, LayoutDashboard, LogOut, Users, X } from "lucide-react";
import { Brand } from "./brand";

export type AdminView = "dashboard" | "customers" | "services" | "sales" | "government-invoices";

type AdminSidebarProps = {
  activeView: AdminView;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigate: (view: AdminView) => void;
};

const navigation: Array<{ id: AdminView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "services", label: "Services", icon: BriefcaseBusiness },
  { id: "sales", label: "Sales Invoice", icon: FileText },
  { id: "government-invoices", label: "Govt. Invoice", icon: FileCheck2 },
];

export function AdminSidebar({ activeView, isOpen, onClose, onLogout, onNavigate }: AdminSidebarProps) {
  return (
    <>
      <aside className={`admin-sidebar${isOpen ? " is-open" : ""}`} aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <Link href="/" aria-label="Back to AJFAN home" onClick={onClose}>
            <Brand dark />
          </Link>
          <button className="admin-sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="admin-sidebar-section">
          <p className="admin-sidebar-label">Workspace</p>
          <nav className="admin-sidebar-nav">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                className={`admin-sidebar-link${activeView === id ? " is-active" : ""}`}
                key={id}
                type="button"
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => onNavigate(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <Link className="admin-sidebar-home" href="/" onClick={onClose}>Back to website</Link>
          <button className="admin-sidebar-logout" type="button" onClick={onLogout}>
            <LogOut size={17} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      {isOpen && <button className="admin-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={onClose} />}
    </>
  );
}
