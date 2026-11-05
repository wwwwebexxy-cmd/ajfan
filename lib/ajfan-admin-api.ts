export type Credentials = {
  email: string;
  password: string;
};

export type CustomerInput = {
  name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  swift_address: string;
  iban: string;
  trn: string;
  notes: string;
};

export type Customer = CustomerInput & {
  id: number;
  created_at: string;
  updated_at: string;
};

export type ServiceInput = {
  name: string;
  service_charge: string;
  includes_government_fee: boolean;
  government_fee: string;
  description: string;
  image: File | null;
};

export type Service = Omit<ServiceInput, "image"> & {
  id: number;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export class AdminApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "AdminApiError";
  }
}

function encodeBasicAuth(credentials: Credentials) {
  const bytes = new TextEncoder().encode(`${credentials.email}:${credentials.password}`);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
}

async function readError(response: Response) {
  try {
    const payload = await response.json() as Record<string, unknown>;
    const messages = Object.entries(payload)
      .flatMap(([field, value]) => {
        const values = Array.isArray(value) ? value : [value];
        return values.map((item) => `${field}: ${String(item)}`);
      });

    return messages.join(" ") || "The request could not be completed.";
  } catch {
    return "The request could not be completed.";
  }
}

async function request<T>(path: string, credentials: Credentials, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const isMultipart = typeof FormData !== "undefined" && init?.body instanceof FormData;
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Basic ${encodeBasicAuth(credentials)}`);
  if (!isMultipart) headers.set("Content-Type", "application/json");

  const response = await fetch(`/api/backend${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  if (!response.ok) throw new AdminApiError(response.status, await readError(response));

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function listCustomers(credentials: Credentials) {
  const payload = await request<Customer[] | { results: Customer[] }>("/customers/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createCustomer(credentials: Credentials, customer: CustomerInput) {
  return request<Customer>("/customers/", credentials, {
    method: "POST",
    body: JSON.stringify(customer),
  });
}

export function getCustomer(credentials: Credentials, customerId: number) {
  return request<Customer>(`/customers/${customerId}/`, credentials);
}

export function updateCustomer(credentials: Credentials, customerId: number, customer: CustomerInput) {
  return request<Customer>(`/customers/${customerId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(customer),
  });
}

export function deleteCustomer(credentials: Credentials, customerId: number) {
  return request<void>(`/customers/${customerId}/`, credentials, { method: "DELETE" });
}

function serviceFormData(service: ServiceInput) {
  const formData = new FormData();
  formData.append("name", service.name);
  formData.append("service_charge", service.service_charge);
  formData.append("includes_government_fee", String(service.includes_government_fee));
  formData.append("government_fee", service.government_fee);
  formData.append("description", service.description);
  if (service.image) formData.append("image", service.image);
  return formData;
}

export async function listServices(credentials: Credentials) {
  const payload = await request<Service[] | { results: Service[] }>("/services/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createService(credentials: Credentials, service: ServiceInput) {
  return request<Service>("/services/", credentials, {
    method: "POST",
    body: serviceFormData(service),
  });
}

export function getService(credentials: Credentials, serviceId: number) {
  return request<Service>(`/services/${serviceId}/`, credentials);
}

export function updateService(credentials: Credentials, serviceId: number, service: ServiceInput) {
  return request<Service>(`/services/${serviceId}/`, credentials, {
    method: "PATCH",
    body: serviceFormData(service),
  });
}

export function deleteService(credentials: Credentials, serviceId: number) {
  return request<void>(`/services/${serviceId}/`, credentials, { method: "DELETE" });
}
