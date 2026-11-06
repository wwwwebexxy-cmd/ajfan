"use client";

import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Pencil, Plus, RefreshCw, RotateCcw, Search, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminApiError,
  createCustomerDocument,
  Credentials,
  Customer,
  CustomerDocument,
  CustomerDocumentFilters,
  CustomerDocumentInput,
  deleteCustomerDocument,
  listCustomerDocuments,
  listCustomers,
  updateCustomerDocument,
} from "@/lib/ajfan-admin-api";

const emptyDocument: CustomerDocumentInput = {
  document_title: "",
  expiry_date: "",
  customer: "",
  notes: "",
};

const emptyFilters: Required<CustomerDocumentFilters> = {
  expiry_from: "",
  expiry_to: "",
  customer: "",
};

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

function csvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function AdminCustomerDocuments({ credentials, onLogout }: { credentials: Credentials; onLogout: () => void }) {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<Required<CustomerDocumentFilters>>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Required<CustomerDocumentFilters>>(emptyFilters);
  const [documentForm, setDocumentForm] = useState<CustomerDocumentInput>(emptyDocument);
  const [editingDocument, setEditingDocument] = useState<CustomerDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerDocument | null>(null);
  const [openOptionsId, setOpenOptionsId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refreshData(nextFilters: Required<CustomerDocumentFilters> = appliedFilters) {
    setLoading(true);
    setError("");
    try {
      const [nextDocuments, nextCustomers] = await Promise.all([
        listCustomerDocuments(credentials, nextFilters),
        listCustomers(credentials),
      ]);
      setDocuments(nextDocuments);
      setCustomers(nextCustomers);
      setAppliedFilters(nextFilters);
      setPage(1);
    } catch (loadError) {
      if (isAuthError(loadError)) onLogout();
      else setError("Could not load customer documents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData(emptyFilters);
  }, [credentials]);

  function openNewDocument() {
    setEditingDocument(null);
    setDocumentForm(emptyDocument);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditDocument(customerDocument: CustomerDocument) {
    setEditingDocument(customerDocument);
    setDocumentForm({
      document_title: customerDocument.document_title,
      expiry_date: customerDocument.expiry_date,
      customer: customerDocument.customer,
      notes: customerDocument.notes || "",
    });
    setOpenOptionsId(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingDocument(null);
    setDocumentForm(emptyDocument);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void refreshData(filters);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    void refreshData(emptyFilters);
  }

  async function saveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!documentForm.customer) {
      setError("Select a customer before saving the document.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const payload: CustomerDocumentInput = {
      ...documentForm,
      customer: Number(documentForm.customer),
      document_title: documentForm.document_title.trim(),
    };
    try {
      const savedDocument = editingDocument
        ? await updateCustomerDocument(credentials, editingDocument.id, payload)
        : await createCustomerDocument(credentials, payload);
      setDocuments((current) => editingDocument ? current.map((item) => item.id === savedDocument.id ? savedDocument : item) : [savedDocument, ...current]);
      closeForm();
      setNotice(editingDocument ? "Document updated successfully." : "Document added successfully.");
    } catch (saveError) {
      if (isAuthError(saveError)) onLogout();
      else setError(saveError instanceof AdminApiError ? saveError.message : "Could not save the document.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError("");
    try {
      await deleteCustomerDocument(credentials, deleteTarget.id);
      setDocuments((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Document deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) onLogout();
      else setError("Could not delete the document.");
    } finally {
      setDeleteBusy(false);
    }
  }

  function exportToExcel() {
    const rows = [
      ["Document Title", "Expiry Date", "Customer Name", "Notes"],
      ...documents.map((item) => [item.document_title, item.expiry_date, item.customer_name, item.notes || ""]),
    ];
    const csv = rows.map((row) => row.map(csvValue).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "customer-documents.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(documents.length / rowCount));
  const currentPage = Math.min(page, totalPages);
  const visibleDocuments = useMemo(() => documents.slice((currentPage - 1) * rowCount, currentPage * rowCount), [documents, currentPage, rowCount]);
  const firstVisible = documents.length ? (currentPage - 1) * rowCount + 1 : 0;
  const lastVisible = Math.min(currentPage * rowCount, documents.length);

  return <>
    <div className="admin-page-heading"><div><p className="admin-kicker">Admin workspace</p><h1>Customer Documents</h1><p>Review customer documents and expiry dates in one list.</p></div><div className="admin-heading-actions"><button className="admin-secondary-button" type="button" onClick={() => void refreshData()} disabled={loading || busy}><RefreshCw size={16} /> Refresh</button><button className="admin-primary-button" type="button" onClick={openNewDocument}><Plus size={17} /> Add document</button></div></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}
    <section className="admin-panel admin-document-filter-panel" aria-labelledby="customer-documents-filter-heading">
      <div className="admin-panel-heading"><div><p className="admin-kicker">Customer documents</p><h2 id="customer-documents-filter-heading">Document filters</h2></div></div>
      <form onSubmit={handleSearch}><div className="admin-document-filter-grid"><label htmlFor="document-expiry-from">Expiry date from<input id="document-expiry-from" type="date" value={filters.expiry_from} onChange={(event) => setFilters((current) => ({ ...current, expiry_from: event.target.value }))} /></label><label htmlFor="document-expiry-to">Expiry date to<input id="document-expiry-to" type="date" value={filters.expiry_to} onChange={(event) => setFilters((current) => ({ ...current, expiry_to: event.target.value }))} /></label><label htmlFor="document-customer-filter">Customer<select id="document-customer-filter" value={filters.customer} onChange={(event) => setFilters((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label></div><div className="admin-document-filter-actions"><button className="admin-primary-button" type="submit" disabled={loading}><Search size={15} /> Search</button><button className="admin-secondary-button" type="button" onClick={resetFilters} disabled={loading}><RotateCcw size={15} /> Reset</button><Link className="admin-secondary-button" href="/">Back to home page</Link><button className="admin-text-button" type="button" onClick={openNewDocument}><Plus size={15} /> Add document</button></div></form>
    </section>
    <section className="admin-panel admin-document-list-panel" aria-labelledby="document-list-heading">
      <div className="admin-panel-heading"><div><p className="admin-kicker">Customer documents</p><h2 id="document-list-heading">Document List</h2></div><span className="admin-count"><FileText size={15} /> {documents.length} {documents.length === 1 ? "document" : "documents"}</span></div>
      <div className="admin-document-toolbar"><div className="admin-document-export-actions"><button className="admin-secondary-button" type="button" onClick={exportToExcel} disabled={!documents.length}><Download size={15} /> Export to Excel</button><button className="admin-secondary-button" type="button" onClick={() => window.print()} disabled={!documents.length}><Download size={15} /> Export to PDF</button></div><span className="admin-search-help">Showing the current filtered list.</span></div>
      {loading ? <div className="admin-empty-state" role="status">Loading customer documents…</div> : documents.length === 0 ? <div className="admin-empty-state"><FileText size={28} /><h3>No customer documents found</h3><p>Use Add document to create the first record.</p><button className="admin-primary-button" type="button" onClick={openNewDocument}><Plus size={17} /> Add document</button></div> : <><div className="admin-table-wrap"><table className="admin-table admin-document-table"><thead><tr><th scope="col">Document Title</th><th scope="col">Expiry Date</th><th scope="col">Customer Name</th><th scope="col">Notes</th><th scope="col">Update Expiry Date</th><th scope="col">Options</th><th scope="col" aria-label="Delete" /></tr></thead><tbody>{visibleDocuments.map((customerDocument) => <tr key={customerDocument.id}><th scope="row">{customerDocument.document_title}</th><td>{formatDate(customerDocument.expiry_date)}</td><td>{customerDocument.customer_name}</td><td><span className="admin-document-notes">{customerDocument.notes || "—"}</span></td><td><button className="admin-text-button" type="button" onClick={() => openEditDocument(customerDocument)}><Pencil size={14} /> Update</button></td><td><div className="admin-document-options"><button className="admin-secondary-button admin-document-options-button" type="button" aria-expanded={openOptionsId === customerDocument.id} onClick={() => setOpenOptionsId((current) => current === customerDocument.id ? null : customerDocument.id)}>Options <ChevronDown size={14} /></button>{openOptionsId === customerDocument.id && <div className="admin-document-options-menu"><button type="button" onClick={() => openEditDocument(customerDocument)}><Pencil size={14} /> Edit document</button></div>}</div></td><td><button className="admin-row-action admin-row-action-delete" type="button" aria-label={`Delete ${customerDocument.document_title}`} onClick={() => { setDeleteTarget(customerDocument); setOpenOptionsId(null); }}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div><div className="admin-document-pagination"><div className="admin-pagination-controls"><button className="admin-row-action" type="button" aria-label="First page" disabled={currentPage === 1} onClick={() => setPage(1)}>&lt;&lt;</button><button className="admin-row-action" type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /></button><span className="admin-pagination-current">{currentPage}</span><button className="admin-row-action" type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><ChevronRight size={16} /></button><button className="admin-row-action" type="button" aria-label="Last page" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}>&gt;&gt;</button></div><span className="admin-document-showing">Showing {firstVisible}-{lastVisible} of {documents.length}</span><label className="admin-document-select-label">Go to page<select value={currentPage} onChange={(event) => setPage(Number(event.target.value))}>{Array.from({ length: totalPages }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label><label className="admin-document-select-label">Row count<select value={rowCount} onChange={(event) => { setRowCount(Number(event.target.value)); setPage(1); }}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label></div></>}
    </section>
    {showForm && <div className="admin-modal-layer"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="customer-document-form-heading"><div className="admin-modal-heading"><div><p className="admin-kicker">Customer document</p><h2 id="customer-document-form-heading">{editingDocument ? "Edit document" : "Add document"}</h2></div><button className="admin-icon-button" type="button" aria-label="Close document form" onClick={closeForm}><X size={19} /></button></div><form className="admin-customer-form" onSubmit={saveDocument}><div className="admin-form-grid"><label htmlFor="customer-document-title">Document title *<input id="customer-document-title" required value={documentForm.document_title} onChange={(event) => setDocumentForm((current) => ({ ...current, document_title: event.target.value }))} /></label><label htmlFor="customer-document-expiry">Expiry date *<input id="customer-document-expiry" type="date" required value={documentForm.expiry_date} onChange={(event) => setDocumentForm((current) => ({ ...current, expiry_date: event.target.value }))} /></label><label className="admin-field-wide" htmlFor="customer-document-customer">Customer *<select id="customer-document-customer" required value={documentForm.customer} onChange={(event) => setDocumentForm((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select></label><label className="admin-field-wide" htmlFor="customer-document-notes">Notes<textarea id="customer-document-notes" rows={5} value={documentForm.notes} onChange={(event) => setDocumentForm((current) => ({ ...current, notes: event.target.value }))} /></label></div><div className="admin-form-actions"><button className="admin-secondary-button" type="button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "Saving…" : editingDocument ? "Save changes" : "Add document"}</button></div></form></section></div>}
    {deleteTarget && <div className="admin-modal-layer"><section className="admin-modal admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-customer-document-heading"><div className="admin-delete-icon" aria-hidden="true"><Trash2 size={20} /></div><p className="admin-kicker">Delete document</p><h2 id="delete-customer-document-heading">Remove {deleteTarget.document_title}?</h2><p>This document will be removed from the active list. Its record is retained safely.</p><div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={() => setDeleteTarget(null)} disabled={deleteBusy}>Cancel</button><button className="admin-danger-button" type="button" onClick={confirmDelete} disabled={deleteBusy}><Trash2 size={16} /> {deleteBusy ? "Deleting…" : "Delete document"}</button></div></section></div>}
  </>;
}
