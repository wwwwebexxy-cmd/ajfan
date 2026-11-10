"use client";

import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Download, FileText, Pencil, RefreshCw, RotateCcw, Search, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AdminApiError,
  Credentials,
  Customer,
  deleteReminder,
  listCustomers,
  listReminders,
  Reminder,
  ReminderFilters,
  ReminderInput,
  updateReminder,
} from "@/lib/ajfan-admin-api";

const emptyReminder: ReminderInput = {
  reminder_title: "",
  due_date: "",
  customer: "",
  notes: "",
};

const emptyFilters: Required<ReminderFilters> = {
  due_from: "",
  due_to: "",
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

export function AdminReminders({ credentials, onLogout }: { credentials: Credentials; onLogout: () => void }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<Required<ReminderFilters>>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Required<ReminderFilters>>(emptyFilters);
  const [reminderForm, setReminderForm] = useState<ReminderInput>(emptyReminder);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reminder | null>(null);
  const [openOptionsId, setOpenOptionsId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [rowCount, setRowCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refreshData(nextFilters: Required<ReminderFilters> = appliedFilters) {
    setLoading(true);
    setError("");
    try {
      const [nextReminders, nextCustomers] = await Promise.all([
        listReminders(credentials, nextFilters),
        listCustomers(credentials),
      ]);
      setReminders(nextReminders);
      setCustomers(nextCustomers);
      setAppliedFilters(nextFilters);
      setPage(1);
    } catch (loadError) {
      if (isAuthError(loadError)) onLogout();
      else setError("Could not load reminders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshData(emptyFilters);
  }, [credentials]);

  function openEditReminder(reminder: Reminder) {
    setEditingReminder(reminder);
    setReminderForm({
      reminder_title: reminder.reminder_title,
      due_date: reminder.due_date,
      customer: reminder.customer,
      notes: reminder.notes || "",
    });
    setOpenOptionsId(null);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingReminder(null);
    setReminderForm(emptyReminder);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void refreshData(filters);
  }

  function resetFilters() {
    setFilters(emptyFilters);
    void refreshData(emptyFilters);
  }

  async function saveReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingReminder) return;
    if (!reminderForm.customer) {
      setError("Select a customer before saving the reminder.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const payload: ReminderInput = {
      ...reminderForm,
      customer: Number(reminderForm.customer),
      reminder_title: reminderForm.reminder_title.trim(),
    };
    try {
      const savedReminder = await updateReminder(credentials, editingReminder.id, payload);
      setReminders((current) => current.map((item) => item.id === savedReminder.id ? savedReminder : item));
      closeForm();
      setNotice("Reminder updated successfully.");
      void refreshData(appliedFilters);
    } catch (saveError) {
      if (isAuthError(saveError)) onLogout();
      else setError(saveError instanceof AdminApiError ? saveError.message : "Could not save the reminder.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError("");
    try {
      await deleteReminder(credentials, deleteTarget.id);
      setReminders((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Reminder deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) onLogout();
      else setError("Could not delete the reminder.");
    } finally {
      setDeleteBusy(false);
    }
  }

  function exportToExcel() {
    const rows = [
      ["Reminder Title", "Due Date", "Customer Name", "Notes"],
      ...reminders.map((item) => [item.reminder_title, item.due_date, item.customer_name, item.notes || ""]),
    ];
    const csv = rows.map((row) => row.map(csvValue).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "reminders.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(reminders.length / rowCount));
  const currentPage = Math.min(page, totalPages);
  const visibleReminders = useMemo(() => reminders.slice((currentPage - 1) * rowCount, currentPage * rowCount), [reminders, currentPage, rowCount]);
  const firstVisible = reminders.length ? (currentPage - 1) * rowCount + 1 : 0;
  const lastVisible = Math.min(currentPage * rowCount, reminders.length);

  return <>
    <div className="admin-page-heading"><div><p className="admin-kicker">Admin workspace</p><h1>Reminders</h1><p>Automatic reminders created 10 days before customer documents expire.</p></div><div className="admin-heading-actions"><button className="admin-secondary-button" type="button" onClick={() => void refreshData()} disabled={loading || busy}><RefreshCw size={16} /> Refresh</button></div></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}
    <section className="admin-panel admin-document-filter-panel" aria-labelledby="reminder-filter-heading">
      <div className="admin-panel-heading"><div><p className="admin-kicker">Reminders</p><h2 id="reminder-filter-heading">Reminder filters</h2></div></div>
      <form onSubmit={handleSearch}><div className="admin-document-filter-grid"><label htmlFor="reminder-due-from">Due date from<input id="reminder-due-from" type="date" value={filters.due_from} onChange={(event) => setFilters((current) => ({ ...current, due_from: event.target.value }))} /></label><label htmlFor="reminder-due-to">Due date to<input id="reminder-due-to" type="date" value={filters.due_to} onChange={(event) => setFilters((current) => ({ ...current, due_to: event.target.value }))} /></label><label htmlFor="reminder-customer-filter">Customer<select id="reminder-customer-filter" value={filters.customer} onChange={(event) => setFilters((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label></div><div className="admin-document-filter-actions"><button className="admin-primary-button" type="submit" disabled={loading}><Search size={15} /> Search</button><button className="admin-secondary-button" type="button" onClick={resetFilters} disabled={loading}><RotateCcw size={15} /> Reset</button><Link className="admin-secondary-button" href="/">Back to home page</Link></div></form>
    </section>
    <section className="admin-panel admin-document-list-panel" aria-labelledby="reminder-list-heading">
      <div className="admin-panel-heading"><div><p className="admin-kicker">Customer reminders</p><h2 id="reminder-list-heading">Reminder List</h2></div><span className="admin-count"><FileText size={15} /> {reminders.length} {reminders.length === 1 ? "reminder" : "reminders"}</span></div>
      <div className="admin-document-toolbar"><div className="admin-document-export-actions"><button className="admin-secondary-button" type="button" onClick={exportToExcel} disabled={!reminders.length}><Download size={15} /> Export to Excel</button><button className="admin-secondary-button" type="button" onClick={() => window.print()} disabled={!reminders.length}><Download size={15} /> Export to PDF</button></div><span className="admin-search-help">Showing the current filtered list.</span></div>
      {loading ? <div className="admin-empty-state" role="status">Loading reminders…</div> : reminders.length === 0 ? <div className="admin-empty-state"><FileText size={28} /><h3>No automatic reminders yet</h3><p>Reminders are created automatically 10 days before a customer document expires.</p></div> : <><div className="admin-table-wrap"><table className="admin-table admin-document-table admin-reminder-table"><thead><tr><th scope="col">Reminder Title</th><th scope="col">Due Date</th><th scope="col">Customer Name</th><th scope="col">Notes</th><th scope="col">Update Due Date</th><th scope="col">Options</th></tr></thead><tbody>{visibleReminders.map((reminder) => <tr key={reminder.id}><th scope="row">{reminder.reminder_title}</th><td>{formatDate(reminder.due_date)}</td><td>{reminder.customer_name}</td><td><span className="admin-document-notes">{reminder.notes || "—"}</span></td><td><button className="admin-text-button" type="button" onClick={() => openEditReminder(reminder)}><Pencil size={14} /> Update</button></td><td><div className="admin-document-options"><button className="admin-secondary-button admin-document-options-button" type="button" aria-expanded={openOptionsId === reminder.id} onClick={() => setOpenOptionsId((current) => current === reminder.id ? null : reminder.id)}>Options <ChevronDown size={14} /></button>{openOptionsId === reminder.id && <div className="admin-document-options-menu"><button type="button" onClick={() => openEditReminder(reminder)}><Pencil size={14} /> Edit reminder</button><button type="button" onClick={() => { setDeleteTarget(reminder); setOpenOptionsId(null); }}><Trash2 size={14} /> Delete reminder</button></div>}</div></td></tr>)}</tbody></table></div><div className="admin-document-pagination"><div className="admin-pagination-controls"><button className="admin-row-action" type="button" aria-label="First page" disabled={currentPage === 1} onClick={() => setPage(1)}>&lt;&lt;</button><button className="admin-row-action" type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft size={16} /></button><span className="admin-pagination-current">{currentPage}</span><button className="admin-row-action" type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><ChevronRight size={16} /></button><button className="admin-row-action" type="button" aria-label="Last page" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)}>&gt;&gt;</button></div><span className="admin-document-showing">Showing {firstVisible}-{lastVisible} of {reminders.length}</span><label className="admin-document-select-label">Row count<select value={rowCount} onChange={(event) => { setRowCount(Number(event.target.value)); setPage(1); }}><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label></div></>}
    </section>
    {showForm && editingReminder && <div className="admin-modal-layer"><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="reminder-form-heading"><div className="admin-modal-heading"><div><p className="admin-kicker">Automatic reminder</p><h2 id="reminder-form-heading">Edit reminder</h2></div><button className="admin-icon-button" type="button" aria-label="Close reminder form" onClick={closeForm}><X size={19} /></button></div><form className="admin-customer-form" onSubmit={saveReminder}><div className="admin-form-grid"><label htmlFor="reminder-title">Reminder title *<input id="reminder-title" required value={reminderForm.reminder_title} onChange={(event) => setReminderForm((current) => ({ ...current, reminder_title: event.target.value }))} /></label><label htmlFor="reminder-due-date">Due date *<input id="reminder-due-date" type="date" required value={reminderForm.due_date} onChange={(event) => setReminderForm((current) => ({ ...current, due_date: event.target.value }))} /></label><label className="admin-field-wide" htmlFor="reminder-customer">Customer *<select id="reminder-customer" required value={reminderForm.customer} onChange={(event) => setReminderForm((current) => ({ ...current, customer: event.target.value ? Number(event.target.value) : "" }))}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</select></label><label className="admin-field-wide" htmlFor="reminder-notes">Notes<textarea id="reminder-notes" rows={5} value={reminderForm.notes} onChange={(event) => setReminderForm((current) => ({ ...current, notes: event.target.value }))} /></label></div><div className="admin-form-actions"><button className="admin-secondary-button" type="button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button></div></form></section></div>}
    {deleteTarget && <div className="admin-modal-layer"><section className="admin-modal admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-reminder-heading"><div className="admin-delete-icon" aria-hidden="true"><Trash2 size={20} /></div><p className="admin-kicker">Delete reminder</p><h2 id="delete-reminder-heading">Remove {deleteTarget.reminder_title}?</h2><p>This reminder will be removed from the active list. Its record is retained safely.</p><div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={() => setDeleteTarget(null)} disabled={deleteBusy}>Cancel</button><button className="admin-danger-button" type="button" onClick={confirmDelete} disabled={deleteBusy}><Trash2 size={16} /> {deleteBusy ? "Deleting…" : "Delete reminder"}</button></div></section></div>}
  </>;
}
