"use client";

import { Eye, Pencil, Trash2, X } from "lucide-react";
import type { Service } from "@/lib/ajfan-admin-api";

function formatMoney(value: string) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(Number(value));
}

export function ServiceDetailsDialog({ service, onClose }: { service: Service; onClose: () => void }) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="service-details-heading">
        <div className="admin-modal-heading">
          <div>
            <p className="admin-kicker">Service details</p>
            <h2 id="service-details-heading">{service.name}</h2>
          </div>
          <button className="admin-icon-button" type="button" aria-label="Close service details" onClick={onClose}><X size={19} /></button>
        </div>
        {service.image && <img className="admin-service-detail-image" src={service.image} alt={`${service.name} service`} />}
        <div className="admin-detail-grid">
          <div className="admin-detail-field"><span>Service charge</span><strong>{formatMoney(service.service_charge)}</strong></div>
          <div className="admin-detail-field"><span>Government fee</span><strong>{formatMoney(service.government_fee)}</strong></div>
          <div className="admin-detail-field"><span>Price label</span><strong>{service.includes_government_fee ? "Including government fee" : "Government fee excluded"}</strong></div>
          <div className="admin-detail-field admin-field-wide"><span>Description</span><strong>{service.description || "—"}</strong></div>
        </div>
        <div className="admin-modal-actions"><button className="admin-secondary-button" type="button" onClick={onClose}>Close</button></div>
      </section>
    </div>
  );
}

export function AdminDeleteService({ service, isDeleting, onCancel, onConfirm }: { service: Service; isDeleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="admin-modal-layer">
      <section className="admin-modal admin-delete-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-service-heading">
        <div className="admin-delete-icon" aria-hidden="true"><Trash2 size={20} /></div>
        <p className="admin-kicker">Delete service</p>
        <h2 id="delete-service-heading">Remove {service.name}?</h2>
        <p>This service will be removed from the active list. Its record is retained safely.</p>
        <div className="admin-modal-actions">
          <button className="admin-secondary-button" type="button" onClick={onCancel} disabled={isDeleting}>Cancel</button>
          <button className="admin-danger-button" type="button" onClick={onConfirm} disabled={isDeleting}><Trash2 size={16} /> {isDeleting ? "Deleting…" : "Delete service"}</button>
        </div>
      </section>
    </div>
  );
}

export function ServiceActionIcons({ serviceName, onView, onEdit, onDelete }: { serviceName: string; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="admin-row-actions">
      <button className="admin-row-action admin-row-action-view" type="button" aria-label={`View ${serviceName}`} onClick={onView}><Eye size={16} /></button>
      <button className="admin-row-action admin-row-action-edit" type="button" aria-label={`Edit ${serviceName}`} onClick={onEdit}><Pencil size={16} /></button>
      <button className="admin-row-action admin-row-action-delete" type="button" aria-label={`Delete ${serviceName}`} onClick={onDelete}><Trash2 size={16} /></button>
    </div>
  );
}
