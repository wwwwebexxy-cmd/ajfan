"use client";

import { Eye, Trash2, X } from "lucide-react";
import type { Customer } from "@/lib/ajfan-admin-api";

type CustomerDetailsProps = {
  customer: Customer;
  isLoading: boolean;
  onClose: () => void;
};

type DeleteCustomerProps = {
  customer: Customer;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const detailFields: Array<{ key: keyof Customer; label: string }> = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address_line_1", label: "Address line 1" },
  { key: "address_line_2", label: "Address line 2" },
  { key: "address_line_3", label: "Address line 3" },
  { key: "bank_name", label: "Bank name" },
  { key: "account_holder_name", label: "Account holder name" },
  { key: "account_number", label: "Account number" },
  { key: "swift_address", label: "SWIFT address" },
  { key: "iban", label: "IBAN" },
  { key: "trn", label: "TRN" },
  { key: "notes", label: "Notes" },
];

export function AdminCustomerDetails({ customer, isLoading, onClose }: CustomerDetailsProps) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="customer-details-heading">
        <div className="admin-modal-heading">
          <div>
            <p className="admin-kicker">Customer details</p>
            <h2 id="customer-details-heading">{customer.name}</h2>
          </div>
          <button className="admin-icon-button" type="button" aria-label="Close customer details" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        {isLoading ? (
          <div className="admin-detail-loading" role="status">Loading customer details…</div>
        ) : (
          <div className="admin-detail-grid">
            {detailFields.map(({ key, label }) => {
              const value = customer[key];
              return (
                <div className={key === "notes" ? "admin-detail-field admin-field-wide" : "admin-detail-field"} key={key}>
                  <span>{label}</span>
                  <strong>{value ? String(value) : "—"}</strong>
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-modal-actions">
          <button className="admin-secondary-button" type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}

export function AdminDeleteCustomer({ customer, isDeleting, onCancel, onConfirm }: DeleteCustomerProps) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-customer-heading">
        <div className="admin-delete-icon" aria-hidden="true"><Trash2 size={20} /></div>
        <p className="admin-kicker">Delete customer</p>
        <h2 id="delete-customer-heading">Remove {customer.name}?</h2>
        <p>This customer record will be permanently removed. This action cannot be undone.</p>
        <div className="admin-modal-actions">
          <button className="admin-secondary-button" type="button" onClick={onCancel} disabled={isDeleting}>Cancel</button>
          <button className="admin-danger-button" type="button" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 size={16} /> {isDeleting ? "Delete" : "Delete customer"}
          </button>
        </div>
      </section>
    </div>
  );
}

export function CustomerActionIcons({ onView, onDelete, customerName }: { onView: () => void; onDelete: () => void; customerName: string }) {
  return (
    <div className="admin-row-actions">
      <button className="admin-row-action admin-row-action-view" type="button" aria-label={`View ${customerName}`} onClick={onView}>
        <Eye size={16} />
      </button>
      <button className="admin-row-action admin-row-action-delete" type="button" aria-label={`Delete ${customerName}`} onClick={onDelete}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
