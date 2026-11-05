"use client";

import { CheckCircle2, ImagePlus, Plus, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AdminApiError, createService, Credentials, deleteService, listServices, Service, ServiceInput, updateService } from "@/lib/ajfan-admin-api";
import { AdminDeleteService, ServiceActionIcons, ServiceDetailsDialog } from "./admin-service-dialogs";

const emptyService: ServiceInput = {
  name: "",
  service_charge: "",
  includes_government_fee: false,
  government_fee: "0",
  description: "",
  image: null,
};

function formatMoney(value: string) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(Number(value));
}

function isAuthError(error: unknown): error is AdminApiError {
  return error instanceof AdminApiError && (error.status === 401 || error.status === 403);
}

export function AdminServices({ credentials, onLogout }: { credentials: Credentials; onLogout: () => void }) {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceForm, setServiceForm] = useState<ServiceInput>(emptyService);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refreshServices() {
    setLoading(true);
    setError("");
    try {
      setServices(await listServices(credentials));
    } catch (loadError) {
      if (isAuthError(loadError)) onLogout();
      else setError("Could not load services.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshServices();
  }, [credentials]);

  function openNewService() {
    setEditingService(null);
    setServiceForm(emptyService);
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function openEditService(service: Service) {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      service_charge: service.service_charge,
      includes_government_fee: service.includes_government_fee,
      government_fee: service.government_fee,
      description: service.description,
      image: null,
    });
    setShowForm(true);
    setError("");
    setNotice("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingService(null);
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const savedService = editingService
        ? await updateService(credentials, editingService.id, serviceForm)
        : await createService(credentials, serviceForm);
      setServices((currentServices) => editingService
        ? currentServices.map((service) => service.id === savedService.id ? savedService : service)
        : [savedService, ...currentServices]);
      setServiceForm(emptyService);
      setEditingService(null);
      setShowForm(false);
      setNotice(editingService ? "Service updated successfully." : "Service saved successfully.");
    } catch (saveError) {
      if (isAuthError(saveError)) onLogout();
      else setError(saveError instanceof AdminApiError ? saveError.message : "Could not save the service.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    setError("");
    try {
      await deleteService(credentials, deleteTarget.id);
      setServices((currentServices) => currentServices.filter((service) => service.id !== deleteTarget.id));
      setDeleteTarget(null);
      setNotice("Service deleted successfully.");
    } catch (deleteError) {
      if (isAuthError(deleteError)) onLogout();
      else setError("Could not delete the service.");
    } finally {
      setDeleteBusy(false);
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredServices = normalizedSearch
    ? services.filter((service) => service.name.toLowerCase().includes(normalizedSearch))
    : services;

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-kicker">Admin workspace</p><h1>Services</h1><p>Create and manage the services shown in your catalogue.</p></div>
        <div className="admin-heading-actions">
          <button className="admin-secondary-button" type="button" onClick={refreshServices} disabled={loading || busy}><RefreshCw size={16} /> Refresh</button>
          <button className="admin-primary-button" type="button" onClick={openNewService}><Plus size={17} /> New service</button>
        </div>
      </div>

      {notice && <p className="admin-notice" role="status"><CheckCircle2 size={17} /> {notice}</p>}
      {error && <p className="admin-error admin-page-error" role="alert">{error}</p>}

      {showForm && (
        <section className="admin-panel" aria-labelledby="new-service-heading">
          <div className="admin-panel-heading">
            <div><p className="admin-kicker">Service details</p><h2 id="new-service-heading">{editingService ? "Edit service" : "New service"}</h2></div>
            <button className="admin-icon-button" type="button" aria-label="Close service form" onClick={closeForm}><X size={19} /></button>
          </div>
          <form className="admin-customer-form" onSubmit={saveService}>
            <div className="admin-form-grid">
              <label htmlFor="service-name">Service name *<input id="service-name" type="text" required value={serviceForm.name} onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))} /></label>
              <label htmlFor="service-charge">Service charge *<input id="service-charge" type="number" min="0" step="0.01" required value={serviceForm.service_charge} onChange={(event) => setServiceForm((current) => ({ ...current, service_charge: event.target.value }))} /></label>
              <label htmlFor="government-fee">Government fee *<input id="government-fee" type="number" min="0" step="0.01" required value={serviceForm.government_fee} onChange={(event) => setServiceForm((current) => ({ ...current, government_fee: event.target.value }))} /></label>
              <label className="admin-checkbox-field" htmlFor="includes-government-fee"><input id="includes-government-fee" type="checkbox" checked={serviceForm.includes_government_fee} onChange={(event) => setServiceForm((current) => ({ ...current, includes_government_fee: event.target.checked }))} /><span>Including government fee</span></label>
              <label className="admin-field-wide" htmlFor="service-description">Description<textarea id="service-description" rows={5} value={serviceForm.description} onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))} /></label>
              <label className="admin-field-wide admin-image-field" htmlFor="service-image">Service image<input id="service-image" type="file" accept="image/*" onChange={(event) => setServiceForm((current) => ({ ...current, image: event.target.files?.[0] ?? null }))} />{editingService?.image && <span>Leave empty to keep the current image.</span>}{serviceForm.image && <span>Selected: {serviceForm.image.name}</span>}</label>
            </div>
            <div className="admin-form-actions"><button className="admin-secondary-button" type="button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit" disabled={busy}><CheckCircle2 size={16} /> {editingService ? "Save changes" : "Save service"}</button></div>
          </form>
        </section>
      )}

      <section className="admin-panel" aria-labelledby="service-list-heading">
        <div className="admin-panel-heading"><div><p className="admin-kicker">Service catalogue</p><h2 id="service-list-heading">Service list</h2></div><span className="admin-count"><ImagePlus size={15} /> {filteredServices.length}{normalizedSearch ? ` of ${services.length}` : ""} {filteredServices.length === 1 ? "service" : "services"}</span></div>
        <div className="admin-list-toolbar"><label className="admin-search-label" htmlFor="service-search">Search services</label><div className="admin-search-control"><Search size={17} aria-hidden="true" /><input id="service-search" className="admin-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Service name" />{searchTerm && <button className="admin-search-clear" type="button" aria-label="Clear service search" onClick={() => setSearchTerm("")}><X size={15} /></button>}</div><span className="admin-search-help">Search by service name.</span></div>
        {loading ? (
          <div className="admin-empty-state" role="status">Loading services…</div>
        ) : services.length === 0 ? (
          <div className="admin-empty-state"><ImagePlus size={28} /><h3>No services yet</h3><p>Create the first service for your catalogue.</p><button className="admin-primary-button" type="button" onClick={openNewService}><Plus size={17} /> New service</button></div>
        ) : filteredServices.length === 0 ? (
          <div className="admin-empty-state"><Search size={28} /><h3>No matching services</h3><p>Try another service name.</p><button className="admin-secondary-button" type="button" onClick={() => setSearchTerm("")}>Clear search</button></div>
        ) : (
          <div className="admin-table-wrap"><table className="admin-table admin-service-table"><thead><tr><th scope="col">Image</th><th scope="col">Service</th><th scope="col">Price</th><th scope="col">Government fee</th><th scope="col">Description</th><th scope="col">Actions</th></tr></thead><tbody>{filteredServices.map((service) => <tr key={service.id}><td>{service.image ? <img className="admin-service-thumb" src={service.image} alt="" /> : <span className="admin-service-thumb admin-service-thumb-empty"><ImagePlus size={17} /></span>}</td><th scope="row">{service.name}</th><td><strong className="admin-service-price">{formatMoney(service.service_charge)}</strong><span className="admin-service-label">{service.includes_government_fee ? "Including government fee" : "Government fee excluded"}</span></td><td>{formatMoney(service.government_fee)}</td><td><span className="admin-service-description">{service.description || "—"}</span></td><td><ServiceActionIcons serviceName={service.name} onView={() => setSelectedService(service)} onEdit={() => openEditService(service)} onDelete={() => { setDeleteTarget(service); setSelectedService(null); setError(""); }} /></td></tr>)}</tbody></table></div>
        )}
      </section>

      {selectedService && <ServiceDetailsDialog service={selectedService} onClose={() => setSelectedService(null)} />}
      {deleteTarget && <AdminDeleteService service={deleteTarget} isDeleting={deleteBusy} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
    </>
  );
}
