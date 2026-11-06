"use client";

import { CheckCircle2, FileText, Plus, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminApiError,
  createQuotation,
  Credentials,
  Customer,
  deleteQuotation,
  listCustomers,
  listQuotations,
  listServices,
  Quotation,
  QuotationInput,
  Service,
  updateQuotation,
} from "@/lib/ajfan-admin-api";
import { AdminDeleteQuotation, QuotationActionIcons, QuotationDetailsDialog } from "./admin-quotation-dialogs";

type QuotationLineForm = {
  service: number | "";
  description: string;
  government_fee: string;
  service_fee: string;
  quantity: string;
  start_date: string;
  end_date: string;
};

type QuotationForm = Omit<QuotationInput, "items"> & { items: QuotationLineForm[]; quotation_number?: string };

function emptyLine(): QuotationLineForm {
  return { service: "", description: "", government_fee: "0", service_fee: "0", quantity: "1", start_date: "", end_date: "" };
}

function emptyQuotation(): QuotationForm {
  return { quotation_date: "", customer: "", items: [emptyLine()], discount_amount: "0", notes: "" };
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

function lineTotal(line: QuotationLineForm) {
  return ((Number(line.government_fee) || 0) + (Number(line.service_fee) || 0)) * Math.max(0, Number(line.quantity) || 0);
}

function quotationToForm(quotation: Quotation): QuotationForm {
  return {
    quotation_number: quotation.quotation_number,
    quotation_date: quotation.quotation_date,
    customer: quotation.customer,
    items: quotation.items.map((item) => ({
      service: item.service,
      description: item.description ?? "",
      government_fee: item.government_fee ?? "0",
      service_fee: item.service_fee ?? "0",
      quantity: String(item.quantity ?? 1),
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
    })),
    discount_amount: quotation.discount_amount ?? "0",
    notes: quotation.notes ?? "",
  };
}

export function AdminQuotations({ credentials, onLogout, onAddCustomer, onAddService }: { credentials: Credentials; onLogout: () => void; onAddCustomer: () => void; onAddService: () => void }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [quotationForm, setQuotationForm] = useState<QuotationForm>(emptyQuotation);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null);
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
      const [nextQuotations, nextCustomers, nextServices] = await Promise.all([
        listQuotations(credentials),
        listCustomers(credentials),
        listServices(credentials),
      ]);
      setQuotations(nextQuotations);
      setCustomers(nextCustomers);
      setServices(nextServices);
    } catch (loadError) {
      if (isAuthError(loadError)) onLogout();
      else setError("Could not load quotation data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, [credentials]);

  function openNewQuotation() {
    setEditingQuotation(null);
    setQuotationForm({ ...emptyQuotation(), quotation_date: localDate() });
    setShowForm(true);
    setSelectedQuotation(null);
    setError("");
    setNotice("");
  }

  function openEditQuotation(quotation: Quotation) {
    setEditingQuotation(quotation);
    setQuotationForm(quotationToForm(quotation));
    setShowForm(true);
    setSelectedQuotation(null);
    setError("");
    setNotice("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingQuotation(null);
    setQuotationForm(emptyQuotation());
  }

  function updateLine(index: number, changes: Partial<QuotationLineForm>) {
    setQuotationForm((current) => ({ ...current, items: current.items.map((line, lineIndex) => lineIndex === index ? { ...line, ...changes } : line) }));
  }

  function selectService(index: number, value: string) {
    const service = services.find((item) => String(item.id) === value);
    updateLine(index, service ? {
      service: service.id,
      description: service.description || "",
      government_fee: service.government_fee || "0",
      service_fee: service.service_charge || "0",
    } : { service: "", description: "", government_fee: "0", service_fee: "0" });
  }

  function addLine() {
    setQuotationForm((current) => ({ ...current, items: [...current.items, emptyLine()] }));
  }

  function removeLine(index: number) {
    setQuotationForm((current) => ({ ...current, items: current.items.length > 1 ? current.items.filter((_, lineIndex) => lineIndex !== index) : current.items }));
  }

  const totals = useMemo(() => {
    const subtotal = quotationForm.items.reduce((sum, item) => sum + lineTotal(item), 0);
    const discount = Number(quotationForm.discount_amount) || 0;
    return { subtotal, total: Math.max(0, subtotal - discount) };
  }, [quotationForm.items, quotationForm.discount_amount]);

  async function saveQuotation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quotationForm.customer || quotationForm.items.some((item) => !item.service)) {
      setError("Select a customer and a service for every quotation line.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const payload: QuotationInput = {
      quotation_date: quotationForm.quotation_date,
      customer: Number(quotationForm.customer),
      items: quotationForm.items.map((item) => ({ ...item, service: Number(item.service), quantity: String(Math.max(1, Number(item.quantity) || 1)) })),
      discount_amount: quotationForm.discount_amount || "0",
      notes: quotationForm.notes,
    };
    try {
      const savedQuotation = editingQuotation
        ? await updateQuotation(credentials, editingQuotation.id, payload)
        : await createQuotation(credentials, payload);
      setQuotations((current) => editingQuotation ? current.map((quotation) => quotation.id === savedQuotation.id ? savedQuotation : quotation) : [savedQuotation, ...current]);
      closeForm();
      setNotice(editingQuotation ? "Quotation updated successfully." : `Quotation #${savedQuotation.quotation_number} created successfully.`);
    } catch (saveError) {
      if (isAuthError(saveError)) onLogout();
      else setError(saveError instanceof AdminApiError ? saveError.message : "Could not save the quotation.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError("");
    try {
      await deleteQuotation(credentials, deleteTarget.id);
      setQuotations((current) => current.filter((quotation) => quotation.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Quotation deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) onLogout();
      else setError("Could not delete the quotation.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredQuotations = normalizedSearch
    ? quotations.filter((quotation) => [quotation.quotation_number, quotation.customer_name, quotation.customer_email].some((value) => value.toLowerCase().includes(normalizedSearch)))
    : quotations;

  return <>
    <div className="admin-page-heading"><div><p className="admin-kicker">Admin workspace</p><h1>Quotations</h1><p>Create customer quotations with service dates and clear pricing.</p></div><div className="admin-heading-actions"><button className="admin-secondary-button" type="button" onClick={refreshData} disabled={loading || busy}><RefreshCw size={16} /> Refresh</button><button className="admin-primary-button" type="button" onClick={openNewQuotation}><Plus size={17} /> New quotation</button></div></div>
    {notice && <p className="admin-notice" role="status"><CheckCircle2 size={17} /> {notice}</p>}
    {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}
    {showForm && <section className="admin-panel" aria-labelledby="new-quotation-heading"><div className="admin-panel-heading"><div><p className="admin-kicker">Quotation details</p><h2 id="new-quotation-heading">{editingQuotation ? `Edit quotation #${editingQuotation.quotation_number}` : "Create quotation"}</h2><p className="admin-form-help">Quotation number is generated after save.</p></div><button className="admin-icon-button" type="button" aria-label="Close quotation form" onClick={closeForm}><X size={19} /></button></div>
      <form className="admin-customer-form" onSubmit={saveQuotation}><div className="admin-form-grid"><div className="admin-field-block"><span className="admin-field-label">Quotation number</span><div className="admin-readonly-field">{editingQuotation?.quotation_number || "Generated after save"}</div></div><label htmlFor="quotation-date">Date *<input id="quotation-date" type="date" required value={quotationForm.quotation_date} onChange={(event) => setQuotationForm((current) => ({ ...current, quotation_date: event.target.value }))} /></label><div className="admin-field-block admin-field-wide"><span className="admin-field-label">Select existing customer *</span><div className="admin-invoice-inline-control"><select id="quotation-customer" required value={quotationForm.customer} onChange={(event) => setQuotationForm((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select><button className="admin-secondary-button" type="button" onClick={onAddCustomer}><Plus size={15} /> New customer</button></div></div></div>
        <div className="admin-invoice-items-heading"><div><p className="admin-kicker">Quotation lines</p><h3>Services</h3></div><div className="admin-invoice-item-actions"><button className="admin-secondary-button" type="button" onClick={onAddService}><Plus size={15} /> New service</button><button className="admin-secondary-button" type="button" onClick={addLine}><Plus size={15} /> Add line</button></div></div>
        <div className="admin-invoice-items">{quotationForm.items.map((item, index) => <div className="admin-invoice-item" key={`quotation-line-${index}`}><div className="admin-invoice-item-heading"><strong>Service {index + 1}</strong>{quotationForm.items.length > 1 && <button className="admin-icon-button" type="button" aria-label={`Remove service ${index + 1}`} onClick={() => removeLine(index)}><X size={17} /></button>}</div><div className="admin-form-grid"><label htmlFor={`quotation-service-${index}`}>Service name *<select id={`quotation-service-${index}`} required value={item.service} onChange={(event) => selectService(index, event.target.value)}><option value="">Select service</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label><label htmlFor={`quotation-quantity-${index}`}>Quantity *<input id={`quotation-quantity-${index}`} type="number" min="1" step="1" required value={item.quantity} onChange={(event) => updateLine(index, { quantity: event.target.value })} /></label><label htmlFor={`quotation-government-fee-${index}`}>Government fee<input id={`quotation-government-fee-${index}`} type="number" min="0" step="0.01" value={item.government_fee} onChange={(event) => updateLine(index, { government_fee: event.target.value })} /></label><label htmlFor={`quotation-service-fee-${index}`}>Service charge<input id={`quotation-service-fee-${index}`} type="number" min="0" step="0.01" value={item.service_fee} onChange={(event) => updateLine(index, { service_fee: event.target.value })} /></label><label htmlFor={`quotation-start-date-${index}`}>Start date *<input id={`quotation-start-date-${index}`} type="date" required value={item.start_date} onChange={(event) => updateLine(index, { start_date: event.target.value })} /></label><label htmlFor={`quotation-end-date-${index}`}>End date *<input id={`quotation-end-date-${index}`} type="date" required value={item.end_date} onChange={(event) => updateLine(index, { end_date: event.target.value })} /></label><label className="admin-field-wide" htmlFor={`quotation-description-${index}`}>Description<textarea id={`quotation-description-${index}`} rows={3} value={item.description} onChange={(event) => updateLine(index, { description: event.target.value })} /></label><div className="admin-invoice-line-total"><span>Line total</span><strong>{formatMoney(lineTotal(item))}</strong></div></div></div>)}</div>
        <div className="admin-invoice-summary-grid"><div className="admin-invoice-summary-card"><p className="admin-kicker">Quotation summary</p><div className="admin-invoice-totals"><span>Total invoice <strong>{formatMoney(totals.subtotal)}</strong></span><label>Discount amount<input type="number" min="0" step="0.01" value={quotationForm.discount_amount} onChange={(event) => setQuotationForm((current) => ({ ...current, discount_amount: event.target.value }))} /></label><span>Total net <strong>{formatMoney(totals.total)}</strong></span></div></div><div className="admin-invoice-summary-card"><p className="admin-kicker">Additional details</p><label htmlFor="quotation-notes">Notes<textarea id="quotation-notes" rows={6} value={quotationForm.notes} onChange={(event) => setQuotationForm((current) => ({ ...current, notes: event.target.value }))} /></label></div></div>
        <div className="admin-form-actions"><button className="admin-secondary-button" type="button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}><CheckCircle2 size={16} /> {busy ? "Saving…" : editingQuotation ? "Save changes" : "Save quotation"}</button></div>
      </form></section>}
    <section className="admin-panel" aria-labelledby="quotation-list-heading"><div className="admin-panel-heading"><div><p className="admin-kicker">Quotation records</p><h2 id="quotation-list-heading">Quotation list</h2></div><span className="admin-count"><FileText size={15} /> {filteredQuotations.length}{normalizedSearch ? ` of ${quotations.length}` : ""} {filteredQuotations.length === 1 ? "quotation" : "quotations"}</span></div><div className="admin-list-toolbar"><label className="admin-search-label" htmlFor="quotation-search">Search quotations</label><div className="admin-search-control"><Search size={17} aria-hidden="true" /><input id="quotation-search" className="admin-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Quotation number or customer" />{searchTerm && <button className="admin-search-clear" type="button" aria-label="Clear quotation search" onClick={() => setSearchTerm("")}><X size={15} /></button>}</div><span className="admin-search-help">Search by quotation number, customer name or email.</span></div>{loading ? <div className="admin-empty-state" role="status">Loading quotations…</div> : quotations.length === 0 ? <div className="admin-empty-state"><FileText size={28} /><h3>No quotations yet</h3><p>Create the first quotation using your existing customers and services.</p><button className="admin-primary-button" type="button" onClick={openNewQuotation}><Plus size={17} /> New quotation</button></div> : filteredQuotations.length === 0 ? <div className="admin-empty-state"><Search size={28} /><h3>No matching quotations</h3><p>Try another quotation number or customer.</p><button className="admin-secondary-button" type="button" onClick={() => setSearchTerm("")}>Clear search</button></div> : <div className="admin-table-wrap"><table className="admin-table admin-invoice-table"><thead><tr><th scope="col">Quotation</th><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Total net</th><th scope="col">Actions</th></tr></thead><tbody>{filteredQuotations.map((quotation) => <tr key={quotation.id}><th scope="row">#{quotation.quotation_number}</th><td>{formatDate(quotation.quotation_date)}</td><td><strong>{quotation.customer_name}</strong><span className="admin-table-subtext">{quotation.customer_email}</span></td><td><strong className="admin-invoice-total">{formatMoney(quotation.total_amount)}</strong></td><td><QuotationActionIcons quotationNumber={quotation.quotation_number} onView={() => setSelectedQuotation(quotation)} onEdit={() => openEditQuotation(quotation)} onDelete={() => { setDeleteTarget(quotation); setSelectedQuotation(null); setError(""); }} /></td></tr>)}</tbody></table></div>}</section>
    {selectedQuotation && <QuotationDetailsDialog quotation={selectedQuotation} onClose={() => setSelectedQuotation(null)} />}
    {deleteTarget && <AdminDeleteQuotation quotation={deleteTarget} isDeleting={deleteBusy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
  </>;
}
