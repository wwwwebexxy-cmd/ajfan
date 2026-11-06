"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LogIn, Menu, Plus, RefreshCw, Search, ShieldCheck, Users, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { AdminApiError, createCustomer, Credentials, CustomerInput, deleteCustomer, getCustomer, listCustomers, Customer, updateCustomer } from "@/lib/ajfan-admin-api";
import { AdminCustomerDetails, AdminDeleteCustomer, CustomerActionIcons } from "./admin-customer-dialogs";
import { AdminDashboard } from "./admin-dashboard";
import { AdminSidebar, AdminView } from "./admin-sidebar";
import { AdminServices } from "./admin-services";
import { AdminSalesInvoices } from "./admin-sales-invoices";
import { AdminGovernmentInvoices } from "./admin-government-invoices";
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
  swift_address: "",
  iban: "",
  trn: "",
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
  { name: "swift_address", label: "SWIFT address" },
  { name: "iban", label: "IBAN" },
  { name: "trn", label: "TRN" },
  { name: "notes", label: "Notes", wide: true },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(value));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

function customerToForm(customer: Customer): CustomerInput {
  return {
    name: customer.name ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    address_line_1: customer.address_line_1 ?? "",
    address_line_2: customer.address_line_2 ?? "",
    address_line_3: customer.address_line_3 ?? "",
    bank_name: customer.bank_name ?? "",
    account_holder_name: customer.account_holder_name ?? "",
    account_number: customer.account_number ?? "",
    swift_address: customer.swift_address ?? "",
    iban: customer.iban ?? "",
    trn: customer.trn ?? "",
    notes: customer.notes ?? "",
  };
}

export function AdminCustomers() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerForm, setCustomerForm] = useState<CustomerInput>(emptyCustomer);
  const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [detailBusy, setDetailBusy] = useState(false);
  const [editBusy, setEditBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
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
    setSearchTerm("");
    setSelectedCustomer(null);
    setDeleteTarget(null);
    setEditingCustomer(null);
    setEditBusy(false);
    setError("");
    setNotice("");
  }

  function navigateTo(view: AdminView) {
    setActiveView(view);
    setSidebarOpen(false);
    setError("");
    setNotice("");
    if (view !== "customers") {
      setShowForm(false);
      setEditingCustomer(null);
    }
  }

  function openNewCustomer() {
    setActiveView("customers");
    setShowForm(true);
    setEditingCustomer(null);
    setCustomerForm(emptyCustomer);
    setEditBusy(false);
    setSidebarOpen(false);
    setError("");
    setNotice("");
  }

  function closeCustomerForm() {
    setShowForm(false);
    setEditingCustomer(null);
    setEditBusy(false);
  }

  async function editCustomer(customer: Customer) {
    if (!credentials) return;
    setActiveView("customers");
    setShowForm(true);
    setEditingCustomer(customer);
    setCustomerForm(customerToForm(customer));
    setEditBusy(true);
    setError("");
    setNotice("");

    try {
      const details = await getCustomer(credentials, customer.id);
      setEditingCustomer(details);
      setCustomerForm(customerToForm(details));
    } catch (editError) {
      if (isAuthError(editError)) handleLogout();
      else {
        setError("Could not load customer details for editing.");
        closeCustomerForm();
      }
    } finally {
      setEditBusy(false);
    }
  }

  async function viewCustomer(customer: Customer) {
    if (!credentials) return;
    setSelectedCustomer(customer);
    setDetailBusy(true);
    setError("");

    try {
      setSelectedCustomer(await getCustomer(credentials, customer.id));
    } catch (detailError) {
      if (isAuthError(detailError)) handleLogout();
      else setError("Could not load customer details.");
    } finally {
      setDetailBusy(false);
    }
  }

  async function confirmDeleteCustomer() {
    if (!credentials || !deleteTarget) return;
    setDeleteBusy(true);
    setError("");

    try {
      await deleteCustomer(credentials, deleteTarget.id);
      setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Customer deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) handleLogout();
      else setError("Could not delete the customer.");
    } finally {
      setDeleteBusy(false);
    }
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

  async function handleSaveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!credentials) return;
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const savedCustomer = editingCustomer
        ? await updateCustomer(credentials, editingCustomer.id, customerForm)
        : await createCustomer(credentials, customerForm);
      setCustomerForm(emptyCustomer);
      setShowForm(false);
      setEditingCustomer(null);
      setNotice(editingCustomer ? "Customer updated successfully." : "Customer saved successfully.");
      setCustomers((currentCustomers) => editingCustomer
        ? currentCustomers.map((customer) => customer.id === savedCustomer.id ? savedCustomer : customer)
        : [savedCustomer, ...currentCustomers]);
    } catch (createError) {
      if (isAuthError(createError)) handleLogout();
      else setError(createError instanceof AdminApiError ? createError.message : "Could not save the customer.");
    } finally {
      setBusy(false);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCustomers = normalizedSearch
    ? customers.filter((customer) => [customer.name, customer.email, customer.phone].some((value) => value.toLowerCase().includes(normalizedSearch)))
    : customers;

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
            <input suppressHydrationWarning id="admin-email" name="email" type="email" autoComplete="username" required value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} />
            <label htmlFor="admin-password">Password</label>
            <input suppressHydrationWarning id="admin-password" name="password" type="password" autoComplete="current-password" required value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} />
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button suppressHydrationWarning className="admin-primary-button" type="submit" disabled={busy}>
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
          ) : activeView === "services" ? (
            <AdminServices credentials={credentials} onLogout={handleLogout} />
          ) : activeView === "sales" ? (
            <AdminSalesInvoices credentials={credentials} onLogout={handleLogout} onAddCustomer={openNewCustomer} onAddService={() => navigateTo("services")} />
          ) : activeView === "government-invoices" ? (
            <AdminGovernmentInvoices credentials={credentials} onLogout={handleLogout} onAddCustomer={openNewCustomer} onAddService={() => navigateTo("services")} />
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
                    <div><p className="admin-kicker">Customer details</p><h2 id="new-customer-heading">{editingCustomer ? "Edit customer" : "New customer"}</h2></div>
                    <button className="admin-icon-button" type="button" aria-label="Close customer form" onClick={closeCustomerForm}><X size={19} /></button>
                  </div>
                  <form className="admin-customer-form" onSubmit={handleSaveCustomer} aria-busy={editBusy}>
                    <div className="admin-form-grid">
                      {customerFields.map((field) => (
                        <label key={field.name} className={field.wide ? "admin-field-wide" : ""} htmlFor={`customer-${field.name}`}>
                          {field.label}
                          {field.name === "name" || field.name === "email" || field.name === "phone" ? <span aria-hidden="true"> *</span> : null}
                          {field.name === "notes" ? (
                            <textarea id={`customer-${field.name}`} name={field.name} rows={4} value={customerForm[field.name] ?? ""} onChange={(event) => setCustomerForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                          ) : (
                            <input id={`customer-${field.name}`} name={field.name} type={field.type || "text"} required={field.name === "name" || field.name === "email" || field.name === "phone"} value={customerForm[field.name] ?? ""} onChange={(event) => setCustomerForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                          )}
                        </label>
                      ))}
                    </div>
                    <div className="admin-form-actions">
                      <button className="admin-secondary-button" type="button" onClick={closeCustomerForm}>Cancel</button>
                      <button className="admin-primary-button" type="submit" disabled={busy || editBusy}><CheckCircle2 size={16} /> {editingCustomer ? "Save changes" : "Save customer"}</button>
                    </div>
                  </form>
                </section>
              )}

              <section className="admin-panel" aria-labelledby="customer-list-heading">
                <div className="admin-panel-heading">
                  <div><p className="admin-kicker">Customer records</p><h2 id="customer-list-heading">Customer list</h2></div>
                  <span className="admin-count"><Users size={15} /> {filteredCustomers.length}{normalizedSearch ? ` of ${customers.length}` : ""} {filteredCustomers.length === 1 ? "customer" : "customers"}</span>
                </div>
                <div className="admin-list-toolbar">
                  <label className="admin-search-label" htmlFor="customer-search">Search customers</label>
                  <div className="admin-search-control">
                    <Search size={17} aria-hidden="true" />
                    <input id="customer-search" className="admin-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name, email or phone" aria-describedby="customer-search-help" />
                    {searchTerm && <button className="admin-search-clear" type="button" aria-label="Clear customer search" onClick={() => setSearchTerm("")}><X size={15} /></button>}
                  </div>
                  <span id="customer-search-help" className="admin-search-help">Search by customer name, email or phone number.</span>
                </div>
                {customers.length === 0 ? (
                  <div className="admin-empty-state"><Users size={28} /><h3>No customers yet</h3><p>Create the first customer record to see it here.</p><button className="admin-primary-button" type="button" onClick={openNewCustomer}><Plus size={17} /> New customer</button></div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="admin-empty-state"><Search size={28} /><h3>No matching customers</h3><p>Try another name, email or phone number.</p><button className="admin-secondary-button" type="button" onClick={() => setSearchTerm("")}>Clear search</button></div>
                ) : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead><tr><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Added</th><th scope="col">Actions</th></tr></thead>
                      <tbody>{filteredCustomers.map((customer) => <tr key={customer.id}><th scope="row">{customer.name}</th><td>{customer.email}</td><td>{customer.phone}</td><td>{formatDate(customer.created_at)}</td><td><CustomerActionIcons customerName={customer.name} onView={() => viewCustomer(customer)} onEdit={() => editCustomer(customer)} onDelete={() => { setDeleteTarget(customer); setSelectedCustomer(null); setError(""); }} /></td></tr>)}</tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
      {selectedCustomer && <AdminCustomerDetails customer={selectedCustomer} isLoading={detailBusy} onClose={() => setSelectedCustomer(null)} />}
      {deleteTarget && <AdminDeleteCustomer customer={deleteTarget} isDeleting={deleteBusy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDeleteCustomer} />}
    </main>
  );
}
