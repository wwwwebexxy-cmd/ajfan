"use client";

import { CheckCircle2, FileText, Plus, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminApiError,
  createSalesInvoice,
  Credentials,
  Customer,
  deleteSalesInvoice,
  listCustomers,
  listSalesInvoices,
  listServices,
  listStaff,
  SalesInvoice,
  SalesInvoiceInput,
  Service,
  StaffMember,
  updateSalesInvoice,
} from "@/lib/ajfan-admin-api";
import { AdminDeleteSalesInvoice, SalesInvoiceActionIcons, SalesInvoiceDetailsDialog } from "./admin-sales-invoice-dialogs";

type InvoiceLineForm = {
  service: number | "";
  description: string;
  sub_fee: string;
  service_fee: string;
  quantity: string;
  start_date: string;
  expiry_date: string;
};

type InvoiceForm = Omit<SalesInvoiceInput, "items"> & { items: InvoiceLineForm[]; invoice_number?: string };

function emptyLine(): InvoiceLineForm {
  return { service: "", description: "", sub_fee: "0", service_fee: "0", quantity: "1", start_date: "", expiry_date: "" };
}

function emptyInvoice(): InvoiceForm {
  return { invoice_date: "", customer: "", items: [emptyLine()], discount_amount: "0", received_amount: "0", paid_by_staff: false, staff: "", notes: "" };
}

function localDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(Number(value) || 0);
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

function invoiceToForm(invoice: SalesInvoice): InvoiceForm {
  return {
    invoice_number: invoice.invoice_number,
    invoice_date: invoice.invoice_date,
    customer: invoice.customer,
    items: invoice.items.map((item) => ({
      service: item.service,
      description: item.description ?? "",
      sub_fee: item.sub_fee ?? "0",
      service_fee: item.service_fee ?? "0",
      quantity: String(item.quantity ?? 1),
      start_date: item.start_date ?? "",
      expiry_date: item.expiry_date ?? "",
    })),
    discount_amount: invoice.discount_amount ?? "0",
    received_amount: invoice.received_amount ?? "0",
    paid_by_staff: invoice.paid_by_staff,
    staff: invoice.staff ?? "",
    notes: invoice.notes ?? "",
  };
}

function lineTotal(line: InvoiceLineForm) {
  return ((Number(line.sub_fee) || 0) + (Number(line.service_fee) || 0)) * Math.max(0, Number(line.quantity) || 0);
}

export function AdminSalesInvoices({ credentials, onLogout, onAddCustomer, onAddService }: { credentials: Credentials; onLogout: () => void; onAddCustomer: () => void; onAddService: () => void }) {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [invoiceForm, setInvoiceForm] = useState<InvoiceForm>(emptyInvoice);
  const [editingInvoice, setEditingInvoice] = useState<SalesInvoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalesInvoice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refreshData() {
    setLoading(true);
    setError("");
    try {
      const [nextInvoices, nextCustomers, nextServices, nextStaff] = await Promise.all([
        listSalesInvoices(credentials),
        listCustomers(credentials),
        listServices(credentials),
        listStaff(credentials),
      ]);
      setInvoices(nextInvoices);
      setCustomers(nextCustomers);
      setServices(nextServices);
      setStaff(nextStaff);
    } catch (loadError) {
      if (isAuthError(loadError)) onLogout();
      else setError("Could not load sales invoice data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, [credentials]);

  function openNewInvoice() {
    setEditingInvoice(null);
    setInvoiceForm({ ...emptyInvoice(), invoice_date: localDate() });
    setShowForm(true);
    setSelectedInvoice(null);
    setError("");
    setNotice("");
  }

  function openEditInvoice(invoice: SalesInvoice) {
    setEditingInvoice(invoice);
    setInvoiceForm(invoiceToForm(invoice));
    setShowForm(true);
    setSelectedInvoice(null);
    setError("");
    setNotice("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingInvoice(null);
    setInvoiceForm(emptyInvoice());
  }

  function updateLine(index: number, changes: Partial<InvoiceLineForm>) {
    setInvoiceForm((current) => ({ ...current, items: current.items.map((line, lineIndex) => lineIndex === index ? { ...line, ...changes } : line) }));
  }

  function selectService(index: number, value: string) {
    const service = services.find((item) => String(item.id) === value);
    updateLine(index, service ? {
      service: service.id,
      description: service.description || "",
      sub_fee: service.government_fee || "0",
      service_fee: service.service_charge || "0",
    } : { service: "", description: "", sub_fee: "0", service_fee: "0" });
  }

  function addLine() {
    setInvoiceForm((current) => ({ ...current, items: [...current.items, emptyLine()] }));
  }

  function removeLine(index: number) {
    setInvoiceForm((current) => ({ ...current, items: current.items.length > 1 ? current.items.filter((_, lineIndex) => lineIndex !== index) : current.items }));
  }

  const totals = useMemo(() => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + lineTotal(item), 0);
    const discount = Number(invoiceForm.discount_amount) || 0;
    const total = Math.max(0, subtotal - discount);
    const received = Number(invoiceForm.received_amount) || 0;
    return { subtotal, total, balance: total - received };
  }, [invoiceForm.items, invoiceForm.discount_amount, invoiceForm.received_amount]);

  async function saveInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invoiceForm.customer || invoiceForm.items.some((item) => !item.service)) {
      setError("Select a customer and a service for every invoice line.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const payload: SalesInvoiceInput = {
      invoice_date: invoiceForm.invoice_date,
      customer: Number(invoiceForm.customer),
      items: invoiceForm.items.map((item) => ({ ...item, service: Number(item.service), quantity: String(Math.max(1, Number(item.quantity) || 1)) })),
      discount_amount: invoiceForm.discount_amount || "0",
      received_amount: invoiceForm.received_amount || "0",
      paid_by_staff: invoiceForm.paid_by_staff,
      staff: invoiceForm.paid_by_staff && invoiceForm.staff ? Number(invoiceForm.staff) : null,
      notes: invoiceForm.notes,
    };

    try {
      const savedInvoice = editingInvoice
        ? await updateSalesInvoice(credentials, editingInvoice.id, payload)
        : await createSalesInvoice(credentials, payload);
      setInvoices((currentInvoices) => editingInvoice
        ? currentInvoices.map((invoice) => invoice.id === savedInvoice.id ? savedInvoice : invoice)
        : [savedInvoice, ...currentInvoices]);
      closeForm();
      setNotice(editingInvoice ? "Sales invoice updated successfully." : `Sales invoice #${savedInvoice.invoice_number} created successfully.`);
    } catch (saveError) {
      if (isAuthError(saveError)) onLogout();
      else setError(saveError instanceof AdminApiError ? saveError.message : "Could not save the sales invoice.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError("");
    try {
      await deleteSalesInvoice(credentials, deleteTarget.id);
      setInvoices((currentInvoices) => currentInvoices.filter((invoice) => invoice.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Sales invoice deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) onLogout();
      else setError("Could not delete the sales invoice.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredInvoices = normalizedSearch
    ? invoices.filter((invoice) => [invoice.invoice_number, invoice.customer_name, invoice.customer_email].some((value) => value.toLowerCase().includes(normalizedSearch)))
    : invoices;

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">Admin workspace</p><h1>Sales invoices</h1><p>Create invoices from your existing customers and services.</p></div>
        <div className="admin-heading-actions">
          <button className="admin-secondary-button" type="button" onClick={refreshData} disabled={loading || busy}><RefreshCw size={16} /> Refresh</button>
          <button className="admin-primary-button" type="button" onClick={openNewInvoice}><Plus size={17} /> New sales invoice</button>
        </div>
      </div>

      {notice && <p className="admin-notice" role="status"><CheckCircle2 size={17} /> {notice}</p>}
      {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}

      {showForm && (
        <section className="admin-panel" aria-labelledby="new-sales-invoice-heading">
          <div className="admin-panel-heading">
            <div><p className="admin-kicker">Invoice details</p><h2 id="new-sales-invoice-heading">{editingInvoice ? `Edit invoice #${editingInvoice.invoice_number}` : "New sales invoice"}</h2><p className="admin-form-help">The backend generates the invoice number only after the invoice is created successfully.</p></div>
            <button className="admin-icon-button" type="button" aria-label="Close invoice form" onClick={closeForm}><X size={19} /></button>
          </div>
          <form className="admin-customer-form" onSubmit={saveInvoice}>
            <div className="admin-form-grid">
              <div className="admin-field-block"><span className="admin-field-label">Invoice number</span><div className="admin-readonly-field">{editingInvoice?.invoice_number || "Generated after save"}</div></div>
              <label htmlFor="sales-invoice-date">Invoice date *<input id="sales-invoice-date" type="date" required value={invoiceForm.invoice_date} onChange={(event) => setInvoiceForm((current) => ({ ...current, invoice_date: event.target.value }))} /></label>
              <div className="admin-field-block admin-field-wide"><span className="admin-field-label">Customer *</span><div className="admin-invoice-inline-control"><select id="sales-invoice-customer" required value={invoiceForm.customer} onChange={(event) => setInvoiceForm((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select><button className="admin-secondary-button" type="button" onClick={onAddCustomer}><Plus size={15} /> Add customer</button></div></div>
            </div>

            <div className="admin-invoice-items-heading"><div><p className="admin-kicker">Invoice lines</p><h3>Services</h3></div><div className="admin-invoice-item-actions"><button className="admin-secondary-button" type="button" onClick={onAddService}><Plus size={15} /> New service</button><button className="admin-secondary-button" type="button" onClick={addLine}><Plus size={15} /> Add line</button></div></div>
            <div className="admin-invoice-items">
              {invoiceForm.items.map((item, index) => (
                <div className="admin-invoice-item" key={`invoice-line-${index}`}>
                  <div className="admin-invoice-item-heading"><strong>Service {index + 1}</strong>{invoiceForm.items.length > 1 && <button className="admin-icon-button" type="button" aria-label={`Remove service ${index + 1}`} onClick={() => removeLine(index)}><X size={17} /></button>}</div>
                  <div className="admin-form-grid">
                    <label htmlFor={`invoice-service-${index}`}>Service name *<select id={`invoice-service-${index}`} required value={item.service} onChange={(event) => selectService(index, event.target.value)}><option value="">Select service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
                    <label htmlFor={`invoice-quantity-${index}`}>Quantity *<input id={`invoice-quantity-${index}`} type="number" min="1" step="1" required value={item.quantity} onChange={(event) => updateLine(index, { quantity: event.target.value })} /></label>
                    <label htmlFor={`invoice-sub-fee-${index}`}>Sub fee / government fee<input id={`invoice-sub-fee-${index}`} type="number" min="0" step="0.01" value={item.sub_fee} onChange={(event) => updateLine(index, { sub_fee: event.target.value })} /></label>
                    <label htmlFor={`invoice-service-fee-${index}`}>Service fee<input id={`invoice-service-fee-${index}`} type="number" min="0" step="0.01" value={item.service_fee} onChange={(event) => updateLine(index, { service_fee: event.target.value })} /></label>
                    <label htmlFor={`invoice-start-date-${index}`}>Start date *<input id={`invoice-start-date-${index}`} type="date" required value={item.start_date} onChange={(event) => updateLine(index, { start_date: event.target.value })} /></label>
                    <label htmlFor={`invoice-expiry-date-${index}`}>Expiry date *<input id={`invoice-expiry-date-${index}`} type="date" required value={item.expiry_date} onChange={(event) => updateLine(index, { expiry_date: event.target.value })} /></label>
                    <label className="admin-field-wide" htmlFor={`invoice-description-${index}`}>Description<textarea id={`invoice-description-${index}`} rows={3} value={item.description} onChange={(event) => updateLine(index, { description: event.target.value })} /></label>
                    <div className="admin-invoice-line-total"><span>Line total</span><strong>{formatMoney(lineTotal(item))}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-invoice-summary-grid">
              <div className="admin-invoice-summary-card">
                <p className="admin-kicker">Payment summary</p>
                <div className="admin-invoice-totals"><span>Subtotal <strong>{formatMoney(totals.subtotal)}</strong></span><label>Discount amount<input type="number" min="0" step="0.01" value={invoiceForm.discount_amount} onChange={(event) => setInvoiceForm((current) => ({ ...current, discount_amount: event.target.value }))} /></label><span>Total invoice <strong>{formatMoney(totals.total)}</strong></span><label>Received amount<input type="number" min="0" step="0.01" value={invoiceForm.received_amount} onChange={(event) => setInvoiceForm((current) => ({ ...current, received_amount: event.target.value }))} /></label><span className={totals.balance < 0 ? "admin-invoice-balance-negative" : ""}>Balance amount <strong>{formatMoney(totals.balance)}</strong></span></div>
              </div>
              <div className="admin-invoice-summary-card">
                <p className="admin-kicker">Payment details</p>
                <label className="admin-checkbox-field" htmlFor="sales-invoice-paid-by-staff"><input id="sales-invoice-paid-by-staff" type="checkbox" checked={invoiceForm.paid_by_staff} onChange={(event) => setInvoiceForm((current) => ({ ...current, paid_by_staff: event.target.checked, staff: event.target.checked ? current.staff : "" }))} /><span>Paid by staff</span></label>
                <label htmlFor="sales-invoice-staff">Staff member<select id="sales-invoice-staff" required={invoiceForm.paid_by_staff} disabled={!invoiceForm.paid_by_staff} value={invoiceForm.staff ?? ""} onChange={(event) => setInvoiceForm((current) => ({ ...current, staff: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select staff</option>{staff.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.email}</option>)}</select></label>
                <label htmlFor="sales-invoice-notes">Notes<textarea id="sales-invoice-notes" rows={5} value={invoiceForm.notes} onChange={(event) => setInvoiceForm((current) => ({ ...current, notes: event.target.value }))} /></label>
              </div>
            </div>
            <div className="admin-form-actions"><button className="admin-secondary-button" type="button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}><CheckCircle2 size={16} /> {busy ? "Saving…" : editingInvoice ? "Save changes" : "Create invoice"}</button></div>
          </form>
        </section>
      )}

      <section className="admin-panel" aria-labelledby="sales-invoice-list-heading">
        <div className="admin-panel-heading"><div><p className="admin-kicker">Billing records</p><h2 id="sales-invoice-list-heading">Sales invoice list</h2></div><span className="admin-count"><FileText size={15} /> {filteredInvoices.length}{normalizedSearch ? ` of ${invoices.length}` : ""} {filteredInvoices.length === 1 ? "invoice" : "invoices"}</span></div>
        <div className="admin-list-toolbar"><label className="admin-search-label" htmlFor="sales-invoice-search">Search invoices</label><div className="admin-search-control"><Search size={17} aria-hidden="true" /><input id="sales-invoice-search" className="admin-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Invoice number or customer" />{searchTerm && <button className="admin-search-clear" type="button" aria-label="Clear invoice search" onClick={() => setSearchTerm("")}><X size={15} /></button>}</div><span className="admin-search-help">Search by invoice number, customer name or email.</span></div>
        {loading ? <div className="admin-empty-state" role="status">Loading sales invoices…</div> : invoices.length === 0 ? <div className="admin-empty-state"><FileText size={28} /><h3>No sales invoices yet</h3><p>Create the first invoice using your existing customers and services.</p><button className="admin-primary-button" type="button" onClick={openNewInvoice}><Plus size={17} /> New sales invoice</button></div> : filteredInvoices.length === 0 ? <div className="admin-empty-state"><Search size={28} /><h3>No matching invoices</h3><p>Try another invoice number or customer.</p><button className="admin-secondary-button" type="button" onClick={() => setSearchTerm("")}>Clear search</button></div> : <div className="admin-table-wrap"><table className="admin-table admin-invoice-table"><thead><tr><th scope="col">Invoice</th><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Total</th><th scope="col">Balance</th><th scope="col">Actions</th></tr></thead><tbody>{filteredInvoices.map((invoice) => <tr key={invoice.id}><th scope="row">#{invoice.invoice_number}</th><td>{formatDate(invoice.invoice_date)}</td><td><strong>{invoice.customer_name}</strong><span className="admin-table-subtext">{invoice.customer_email}</span></td><td><strong className="admin-invoice-total">{formatMoney(invoice.total_amount)}</strong></td><td><strong className={Number(invoice.balance_amount) > 0 ? "admin-invoice-balance-due" : "admin-invoice-balance-paid"}>{formatMoney(invoice.balance_amount)}</strong></td><td><SalesInvoiceActionIcons invoiceNumber={invoice.invoice_number} onView={() => setSelectedInvoice(invoice)} onEdit={() => openEditInvoice(invoice)} onDelete={() => { setDeleteTarget(invoice); setSelectedInvoice(null); setError(""); }} /></td></tr>)}</tbody></table></div>}
      </section>

      {selectedInvoice && <SalesInvoiceDetailsDialog invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
      {deleteTarget && <AdminDeleteSalesInvoice invoice={deleteTarget} isDeleting={deleteBusy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </>
  );
}
