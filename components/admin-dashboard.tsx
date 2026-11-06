"use client";

import { ArrowRight, BellRing, BriefcaseBusiness, FileCheck2, FileText, FolderOpen, LayoutGrid, RefreshCw, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  AdminApiError,
  Credentials,
  CustomerDocument,
  listCustomerDocuments,
  listGovernmentInvoices,
  listQuotations,
  listReminders,
  listSalesInvoices,
  listServices,
  Reminder,
} from "@/lib/ajfan-admin-api";
import type { Customer } from "@/lib/ajfan-admin-api";
import type { AdminView } from "./admin-sidebar";
import { AdminCustomerGrowthChart } from "./admin-customer-growth-chart";

type AdminDashboardProps = {
  credentials: Credentials;
  customers: Customer[];
  onLogout: () => void;
  onNewCustomer: () => void;
  onOpenCustomers: () => void;
  onOpenView: (view: AdminView) => void;
};

type OverviewState = {
  services: number;
  salesInvoices: number;
  governmentInvoices: number;
  quotations: number;
  documents: CustomerDocument[];
  reminders: Reminder[];
  loading: boolean;
  error: string;
};

type ModuleCard = {
  label: string;
  count: number;
  icon: typeof Users;
  tone: string;
  view: AdminView;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(value));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

const initialOverview: OverviewState = {
  services: 0,
  salesInvoices: 0,
  governmentInvoices: 0,
  quotations: 0,
  documents: [],
  reminders: [],
  loading: true,
  error: "",
};

export function AdminDashboard({ credentials, customers, onLogout, onNewCustomer, onOpenCustomers, onOpenView }: AdminDashboardProps) {
  const [overview, setOverview] = useState<OverviewState>(initialOverview);
  const recentCustomers = [...customers]
    .sort((first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime())
    .slice(0, 3);
  const latestCustomer = recentCustomers[0];

  async function loadOverview() {
    setOverview((current) => ({ ...current, loading: true, error: "" }));
    try {
      const [services, salesInvoices, governmentInvoices, quotations, documents, reminders] = await Promise.all([
        listServices(credentials),
        listSalesInvoices(credentials),
        listGovernmentInvoices(credentials),
        listQuotations(credentials),
        listCustomerDocuments(credentials),
        listReminders(credentials),
      ]);
      setOverview({
        services: services.length,
        salesInvoices: salesInvoices.length,
        governmentInvoices: governmentInvoices.length,
        quotations: quotations.length,
        documents,
        reminders,
        loading: false,
        error: "",
      });
    } catch (error) {
      if (isAuthError(error)) onLogout();
      else setOverview((current) => ({ ...current, loading: false, error: "Some overview data could not be loaded." }));
    }
  }

  useEffect(() => {
    void loadOverview();
  }, [credentials]);

  const moduleCards: ModuleCard[] = [
    { label: "Customers", count: customers.length, icon: Users, tone: "admin-overview-module-teal", view: "customers" },
    { label: "Services", count: overview.services, icon: BriefcaseBusiness, tone: "admin-overview-module-navy", view: "services" },
    { label: "Sales invoices", count: overview.salesInvoices, icon: FileText, tone: "admin-overview-module-gold", view: "sales" },
    { label: "Govt. invoices", count: overview.governmentInvoices, icon: FileCheck2, tone: "admin-overview-module-blue", view: "government-invoices" },
    { label: "Quotations", count: overview.quotations, icon: FileText, tone: "admin-overview-module-purple", view: "quotations" },
    { label: "Customer documents", count: overview.documents.length, icon: FolderOpen, tone: "admin-overview-module-teal", view: "customer-documents" },
    { label: "Reminders", count: overview.reminders.length, icon: BellRing, tone: "admin-overview-module-gold", view: "reminders" },
  ];

  const attentionItems = useMemo(() => [
    ...overview.reminders.map((reminder) => ({ id: `reminder-${reminder.id}`, title: reminder.reminder_title, customer: reminder.customer_name, date: reminder.due_date, label: "Reminder due", view: "reminders" as AdminView })),
    ...overview.documents.map((document) => ({ id: `document-${document.id}`, title: document.document_title, customer: document.customer_name, date: document.expiry_date, label: "Document expiry", view: "customer-documents" as AdminView })),
  ].sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime()).slice(0, 4), [overview.documents, overview.reminders]);

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">Workspace overview</p><h1>Overview</h1><p>See customers, services, billing, documents, and reminders at a glance.</p></div>
        <div className="admin-heading-actions"><button className="admin-secondary-button" type="button" onClick={() => void loadOverview()} disabled={overview.loading}><RefreshCw size={16} /> Refresh overview</button><button className="admin-primary-button" type="button" onClick={onNewCustomer}><UserPlus size={17} /> New customer</button></div>
      </div>

      {overview.error && <p className="admin-error admin-page-error" role="alert">{overview.error}</p>}

      <div className="admin-stat-grid">
        <article className="admin-stat-card"><span className="admin-stat-icon"><Users size={18} /></span><div><p>Total customers</p><strong>{customers.length}</strong></div><button type="button" aria-label="Open customer list" onClick={onOpenCustomers}><ArrowRight size={17} /></button></article>
        <article className="admin-stat-card"><span className="admin-stat-icon admin-stat-icon-teal"><ShieldCheck size={18} /></span><div><p>Workspace access</p><strong>Admin only</strong></div></article>
        <article className="admin-stat-card"><span className="admin-stat-icon admin-stat-icon-soft"><LayoutGrid size={18} /></span><div><p>Active modules</p><strong>7</strong></div></article>
      </div>

      <section className="admin-panel admin-overview-modules" aria-labelledby="overview-modules-heading">
        <div className="admin-panel-heading"><div><p className="admin-kicker">Workspace snapshot</p><h2 id="overview-modules-heading">All modules</h2></div><span className="admin-count">{overview.loading ? "Updating…" : "Live counts"}</span></div>
        <div className="admin-overview-module-grid">{moduleCards.map(({ label, count, icon: Icon, tone, view }) => <button className="admin-overview-module-card" type="button" key={view} onClick={() => onOpenView(view)}><span className={`admin-overview-module-icon ${tone}`}><Icon size={18} /></span><span><strong>{overview.loading && view !== "customers" ? "—" : count}</strong><small>{label}</small></span><ArrowRight size={16} aria-hidden="true" /></button>)}</div>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-welcome-panel" aria-labelledby="admin-welcome-heading"><p className="admin-kicker">Quick actions</p><h2 id="admin-welcome-heading">Everything important, in one overview.</h2><p>Open a module from the snapshot above or use the quick actions below to keep the workspace moving.</p><div className="admin-dashboard-actions"><button className="admin-secondary-button" type="button" onClick={onOpenCustomers}>View customers <ArrowRight size={16} /></button><button className="admin-primary-button" type="button" onClick={onNewCustomer}><UserPlus size={16} /> Add customer</button></div></section>
        <section className="admin-panel admin-recent-panel" aria-labelledby="recent-customers-heading"><div className="admin-panel-heading"><div><p className="admin-kicker">Activity</p><h2 id="recent-customers-heading">Recent customers</h2></div><button className="admin-text-button" type="button" onClick={onOpenCustomers}>View all <ArrowRight size={15} /></button></div>{recentCustomers.length === 0 ? <p className="admin-recent-empty">No customer records have been added yet.</p> : <div className="admin-recent-list">{recentCustomers.map((customer) => <div className="admin-recent-item" key={customer.id}><span className="admin-avatar">{customer.name.charAt(0).toUpperCase()}</span><div><strong>{customer.name}</strong><span>{customer.email}</span></div><time dateTime={customer.created_at}>{formatDate(customer.created_at)}</time></div>)}</div>}</section>
      </div>

      <div className="admin-dashboard-grid admin-overview-attention-grid">
        <section className="admin-panel admin-recent-panel" aria-labelledby="overview-attention-heading"><div className="admin-panel-heading"><div><p className="admin-kicker">Next actions</p><h2 id="overview-attention-heading">Needs attention</h2></div><BellRing size={18} className="admin-heading-icon" aria-hidden="true" /></div>{overview.loading ? <p className="admin-recent-empty">Loading reminders and document expiries…</p> : attentionItems.length === 0 ? <p className="admin-recent-empty">No reminders or expiring documents yet.</p> : <div className="admin-attention-list">{attentionItems.map((item) => <button className="admin-attention-item" type="button" key={item.id} onClick={() => onOpenView(item.view)}><span className="admin-attention-date">{formatDate(item.date)}</span><span><strong>{item.title}</strong><small>{item.label} · {item.customer}</small></span><ArrowRight size={15} aria-hidden="true" /></button>)}</div>}</section>
        <section className="admin-panel admin-recent-panel" aria-labelledby="overview-guide-heading"><div className="admin-panel-heading"><div><p className="admin-kicker">How to use</p><h2 id="overview-guide-heading">Start here</h2></div></div><div className="admin-overview-guide"><p><strong>1.</strong> Add customers and services.</p><p><strong>2.</strong> Create invoices or quotations.</p><p><strong>3.</strong> Track document expiry and reminders.</p></div></section>
      </div>

      <AdminCustomerGrowthChart customers={customers} />
    </>
  );
}
