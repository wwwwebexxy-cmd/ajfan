"use client";

import { ArrowRight, ShieldCheck, UserPlus, Users } from "lucide-react";
import type { Customer } from "@/lib/ajfan-admin-api";
import { AdminCustomerGrowthChart } from "./admin-customer-growth-chart";

type AdminDashboardProps = {
  customers: Customer[];
  onNewCustomer: () => void;
  onOpenCustomers: () => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(value));
}

export function AdminDashboard({ customers, onNewCustomer, onOpenCustomers }: AdminDashboardProps) {
  const recentCustomers = [...customers]
    .sort((first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime())
    .slice(0, 3);
  const latestCustomer = recentCustomers[0];

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">Overview</p>
          <h1>Overview</h1>
          <p>Welcome back. Manage your customer records from one place.</p>
        </div>
        <button className="admin-primary-button" type="button" onClick={onNewCustomer}>
          <UserPlus size={17} /> New customer
        </button>
      </div>

      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><Users size={18} /></span>
          <div><p>Total customers</p><strong>{customers.length}</strong></div>
          <button type="button" aria-label="Open customer list" onClick={onOpenCustomers}><ArrowRight size={17} /></button>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon admin-stat-icon-teal"><ShieldCheck size={18} /></span>
          <div><p>Workspace access</p><strong>Admin only</strong></div>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon admin-stat-icon-soft"><ArrowRight size={18} /></span>
          <div><p>Latest customer</p><strong>{latestCustomer ? formatDate(latestCustomer.created_at) : "No records"}</strong></div>
        </article>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-welcome-panel" aria-labelledby="admin-welcome-heading">
          <p className="admin-kicker">Quick actions</p>
          <h2 id="admin-welcome-heading">Keep customer records organized.</h2>
          <p>Use the Customers section to add a new record or review the saved customer list.</p>
          <div className="admin-dashboard-actions">
            <button className="admin-secondary-button" type="button" onClick={onOpenCustomers}>View customers <ArrowRight size={16} /></button>
            <button className="admin-primary-button" type="button" onClick={onNewCustomer}><UserPlus size={16} /> Add customer</button>
          </div>
        </section>

        <section className="admin-panel admin-recent-panel" aria-labelledby="recent-customers-heading">
          <div className="admin-panel-heading">
            <div><p className="admin-kicker">Activity</p><h2 id="recent-customers-heading">Recent customers</h2></div>
            <button className="admin-text-button" type="button" onClick={onOpenCustomers}>View all <ArrowRight size={15} /></button>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="admin-recent-empty">No customer records have been added yet.</p>
          ) : (
            <div className="admin-recent-list">
              {recentCustomers.map((customer) => (
                <div className="admin-recent-item" key={customer.id}>
                  <span className="admin-avatar">{customer.name.charAt(0).toUpperCase()}</span>
                  <div><strong>{customer.name}</strong><span>{customer.email}</span></div>
                  <time dateTime={customer.created_at}>{formatDate(customer.created_at)}</time>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <AdminCustomerGrowthChart customers={customers} />
    </>
  );
}
