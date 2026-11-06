"use client";

import { Eye, Pencil, Trash2, X } from "lucide-react";
import type { GovernmentInvoice, PaymentMode } from "@/lib/ajfan-admin-api";

function formatMoney(value: string | number) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(Number(value) || 0);
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-AE", { dateStyle: "medium" }).format(new Date(`${value.slice(0, 10)}T00:00:00`));
}

function paymentModeLabel(value: PaymentMode) {
  return value === "bank" ? "Bank" : value === "card" ? "Card" : "Cash";
}

export function GovernmentInvoiceDetailsDialog({ invoice, onClose }: { invoice: GovernmentInvoice; onClose: () => void }) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal admin-invoice-detail-modal" role="dialog" aria-modal="true" aria-labelledby="government-invoice-details-heading">
        <div className="admin-modal-heading">
          <div><p className="admin-kicker">Government invoice</p><h2 id="government-invoice-details-heading">Invoice #{invoice.invoice_number}</h2><p className="admin-modal-subtitle">{invoice.customer_name} · {formatDate(invoice.invoice_date)}</p></div>
          <button className="admin-icon-button" type="button" aria-label="Close government invoice details" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="admin-detail-grid">
          <div className="admin-detail-field"><span>Customer</span><strong>{invoice.customer_name}</strong></div>
          <div className="admin-detail-field"><span>Email</span><strong>{invoice.customer_email}</strong></div>
          <div className="admin-detail-field"><span>Invoice date</span><strong>{formatDate(invoice.invoice_date)}</strong></div>
          <div className="admin-detail-field"><span>Payment mode</span><strong>{paymentModeLabel(invoice.payment_mode)}</strong></div>
          <div className="admin-detail-field"><span>Paid by staff</span><strong>{invoice.paid_by_staff ? invoice.staff_name || "Staff" : "No"}</strong></div>
        </div>
        <div className="admin-invoice-detail-lines">
          <h3>Government services</h3>
          {invoice.items.map((item, index) => <div className="admin-invoice-detail-line" key={item.id || `${item.service}-${index}`}><div><strong>{item.service_name}</strong><span>{item.description || "No description"}</span><small>{formatDate(item.start_date)} – {formatDate(item.end_date)} · Qty {item.quantity}</small></div><strong>{formatMoney(item.line_total)}</strong></div>)}
        </div>
        <div className="admin-invoice-totals admin-invoice-detail-totals"><span>Subtotal <strong>{formatMoney(invoice.subtotal)}</strong></span><span>Discount <strong>{formatMoney(invoice.discount_amount)}</strong></span><span>Total invoice <strong>{formatMoney(invoice.total_amount)}</strong></span><span>Received <strong>{formatMoney(invoice.received_amount)}</strong></span><span>Balance <strong>{formatMoney(invoice.balance_amount)}</strong></span></div>
        {invoice.notes && <div className="admin-invoice-notes"><span>Notes</span><p>{invoice.notes}</p></div>}
        <div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={onClose}>Close</button></div>
      </section>
    </div>
  );
}

export function AdminDeleteGovernmentInvoice({ invoice, isDeleting, onCancel, onConfirm }: { invoice: GovernmentInvoice; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-government-invoice-heading">
        <div className="admin-delete-icon" aria-hidden="true"><Trash2 size={20} /></div><p className="admin-kicker">Delete government invoice</p><h2 id="delete-government-invoice-heading">Remove invoice #{invoice.invoice_number}?</h2><p>This invoice will be removed from the active list. Its record is retained safely.</p>
        <div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={onCancel} disabled={isDeleting}>Cancel</button><button className="admin-danger-button" type="button" onClick={onConfirm} disabled={isDeleting}><Trash2 size={16} /> {isDeleting ? "Deleting…" : "Delete invoice"}</button></div>
      </section>
    </div>
  );
}

export function GovernmentInvoiceActionIcons({ invoiceNumber, onView, onEdit, onDelete }: { invoiceNumber: string; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return <div className="admin-row-actions"><button className="admin-row-action admin-row-action-view" type="button" aria-label={`View government invoice ${invoiceNumber}`} onClick={onView}><Eye size={16} /></button><button className="admin-row-action admin-row-action-edit" type="button" aria-label={`Edit government invoice ${invoiceNumber}`} onClick={onEdit}><Pencil size={16} /></button><button className="admin-row-action admin-row-action-delete" type="button" aria-label={`Delete government invoice ${invoiceNumber}`} onClick={onDelete}><Trash2 size={16} /></button></div>;
}
