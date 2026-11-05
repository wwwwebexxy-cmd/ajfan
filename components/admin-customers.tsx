"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LogIn, Menu, Plus, RefreshCw, ShieldCheck, Users, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminApiError, createCustomer, Credentials, CustomerInput, listCustomers, Customer } from "@/lib/ajfan-admin-api";
import { AdminDashboard } from "./admin-dashboard";
import { AdminSidebar, AdminView } from "./admin-sidebar";
import { Brand } from "./brand";

const emptyCustomer: CustomerInput = {
  name: "",
  email: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  address_line_3: "",
  bank_name: "",
  account_holder_name: "",
  account_number: "",
  zip_address: "",
  ifsc: "",
  notes: "",
};

const customerFields: Array<{ name: keyof CustomerInput; label: string; type?: string; wide?: boolean }> = [
  { name: "name", label: "Customer name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "address_line_1", label: "Address line 1" },
  { name: "address_line_2", label: "Address line 2" },
  { name: "address_line_3", label: "Address line 3" },
  { name: "bank_name", label: "Bank name" },
  { name: "account_holder_name", label: "Account holder name" },
  { name: "account_number", label: "Account number" },
  { name: "zip_address", label: "ZIP address" },
  { name: "ifsc", label: "IFSC" },
  { name: "notes", label: "Notes", wide: true },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(value));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

export function AdminCustomers() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerForm, setCustomerForm] = useState<CustomerInput>(emptyCustomer);
  const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const nextCredentials = { email: loginForm.email.trim(), password: loginForm.password };

    try {
      const records = await listCustomers(nextCredentials);
      setCredentials(nextCredentials);
      setCustomers(records);
      setActiveView("dashboard");
      setLoginForm({ email: "", password: "" });
    } catch (loginError) {
      setError(isAuthError(loginError) ? "Invalid admin email or password." : "Unable to connect to the AJFAN backend.");
    } finally {
      setBusy(false);
    }
  }

  function handleLogout() {
    setCredentials(null);
    setCustomers([]);
    setCustomerForm(emptyCustomer);
    setShowForm(false);
    setActiveView("dashboard");
    setSidebarOpen(false);
    setError("");
    setNotice("");
  }

  function navigateTo(view: AdminView) {
    setActiveView(view);
    setSidebarOpen(false);
    setError("");
    setNotice("");
    if (view === "dashboard") setShowForm(false);
  }

  function openNewCustomer() {
    setActiveView("customers");
    setShowForm(true);
    setSidebarOpen(false);
    setError("");
    setNotice("");
  }

  async function refreshCustomers() {
    if (!credentials) return;
    setBusy(true);
    setError("");

    try {
      setCustomers(await listCustomers(credentials));
    } catch (refreshError) {
      if (isAuthError(refreshError)) handleLogout();
      else setError("Could not refresh the customer list.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!credentials) return;
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await createCustomer(credentials, customerForm);
      setCustomerForm(emptyCustomer);
      setShowForm(false);
      setNotice("Customer saved successfully.");
      setCustomers(await listCustomers(credentials));
    } catch (createError) {
      if (isAuthError(createError)) handleLogout();
      else setError(createError instanceof AdminApiError ? createError.message : "Could not save the customer.");
    } finally {
      setBusy(false);
    }
  }

  if (!credentials) {
    return (
      <main className="admin-shell admin-login-shell">
        <div className="admin-login-card">
          <div className="admin-brand-row">
            <Brand />
            <span className="admin-lock-mark" aria-hidden="true"><ShieldCheck size={20} /></span>
          </div>
          <p className="admin-kicker">Private workspace</p>
          <h1>Ajifan Documents</h1>
          <p className="admin-intro">Sign in with your admin email and password to manage customers.</p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" name="email" type="email" autoComplete="username" required value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} />
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" required value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} />
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="admin-primary-button" type="submit" disabled={busy}>
              <LogIn size={17} /> {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <Link className="admin-back-link" href="/"><ArrowLeft size={15} /> Back to home</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <AdminSidebar
        activeView={activeView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        onNavigate={navigateTo}
      />
      <div className="admin-workspace">
        <header className="admin-mobile-header">
          <button className="admin-mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <Link href="/" aria-label="Back to AJFAN home"><Brand /></Link>
          <button className="admin-mobile-home-button" type="button" onClick={handleLogout}>Log out</button>
        </header>
        <div className="admin-content">
          {notice && <p className="admin-notice" role="status"><CheckCircle2 size={17} /> {notice}</p>}
          {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}

          {activeView === "dashboard" ? (
            <AdminDashboard customers={customers} onNewCustomer={openNewCustomer} onOpenCustomers={() => navigateTo("customers")} />
          ) : (
            <>
              <div className="admin-page-heading">
                <div>
                  <p className="admin-kicker">Admin workspace</p>
                  <h1>Customers</h1>
                  <p>Save and review customer records securely.</p>
                </div>
                <div className="admin-heading-actions">
                  <button className="admin-secondary-button" type="button" onClick={refreshCustomers} disabled={busy}><RefreshCw size={16} /> Refresh</button>
                  <button className="admin-primary-button" type="button" onClick={openNewCustomer}><Plus size={17} /> New customer</button>
                </div>
              </div>

              {showForm && (
                <section className="admin-panel admin-form-panel" aria-labelledby="new-customer-heading">
                  <div className="admin-panel-heading">
                    <div><p className="admin-kicker">Customer details</p><h2 id="new-customer-heading">New customer</h2></div>
                    <button className="admin-icon-button" type="button" aria-label="Close new customer form" onClick={() => setShowForm(false)}><X size={19} /></button>
                  </div>
                  <form className="admin-customer-form" onSubmit={handleCreateCustomer}>
                    <div className="admin-form-grid">
                      {customerFields.map((field) => (
                        <label key={field.name} className={field.wide ? "admin-field-wide" : ""} htmlFor={`customer-${field.name}`}>
                          {field.label}
                          {field.name === "name" || field.name === "email" || field.name === "phone" ? <span aria-hidden="true"> *</span> : null}
                          {field.name === "notes" ? (
                            <textarea id={`customer-${field.name}`} name={field.name} rows={4} value={customerForm[field.name]} onChange={(event) => setCustomerForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                          ) : (
                            <input id={`customer-${field.name}`} name={field.name} type={field.type || "text"} required={field.name === "name" || field.name === "email" || field.name === "phone"} value={customerForm[field.name]} onChange={(event) => setCustomerForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                          )}
                        </label>
                      ))}
                    </div>
                    <div className="admin-form-actions">
                      <button className="admin-secondary-button" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                      <button className="admin-primary-button" type="submit" disabled={busy}><CheckCircle2 size={16} /> {busy ? "Saving…" : "Save customer"}</button>
                    </div>
                  </form>
                </section>
              )}

              <section className="admin-panel" aria-labelledby="customer-list-heading">
                <div className="admin-panel-heading">
                  <div><p className="admin-kicker">Customer records</p><h2 id="customer-list-heading">Customer list</h2></div>
                  <span className="admin-count"><Users size={15} /> {customers.length} {customers.length === 1 ? "customer" : "customers"}</span>
                </div>
                {customers.length === 0 ? (
                  <div className="admin-empty-state"><Users size={28} /><h3>No customers yet</h3><p>Create the first customer record to see it here.</p><button className="admin-primary-button" type="button" onClick={openNewCustomer}><Plus size={17} /> New customer</button></div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Added</th></tr></thead>
                      <tbody>{customers.map((customer) => <tr key={customer.id}><th scope="row">{customer.name}</th><td>{customer.email}</td><td>{customer.phone}</td><td>{formatDate(customer.created_at)}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
