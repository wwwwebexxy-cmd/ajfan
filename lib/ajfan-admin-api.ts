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

export type StaffMember = {
  id: number;
  email: string;
  name: string;
};

export type SalesInvoiceItemInput = {
  service: number | "";
  description: string;
  sub_fee: string;
  service_fee: string;
  quantity: string;
  start_date: string;
  expiry_date: string;
};

export type PaymentMode = "cash" | "bank" | "card";

export type SalesInvoiceInput = {
  invoice_date: string;
  customer: number | "";
  items: SalesInvoiceItemInput[];
  discount_amount: string;
  received_amount: string;
  payment_mode: PaymentMode;
  paid_by_staff: boolean;
  staff: number | null | "";
  notes: string;
};

export type SalesInvoiceItem = Omit<SalesInvoiceItemInput, "service" | "quantity"> & {
  id: number;
  service: number;
  service_name: string;
  quantity: number;
  line_total: string;
};

export type SalesInvoice = {
  id: number;
  invoice_number: string;
  invoice_date: string;
  customer: number;
  customer_name: string;
  customer_email: string;
  items: SalesInvoiceItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  received_amount: string;
  balance_amount: string;
  payment_mode: PaymentMode;
  paid_by_staff: boolean;
  staff: number | null;
  staff_name: string;
  notes: string;
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

export async function listStaff(credentials: Credentials) {
  const payload = await request<StaffMember[] | { results: StaffMember[] }>("/sales-invoices/staff/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export async function listSalesInvoices(credentials: Credentials) {
  const payload = await request<SalesInvoice[] | { results: SalesInvoice[] }>("/sales-invoices/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createSalesInvoice(credentials: Credentials, invoice: SalesInvoiceInput) {
  return request<SalesInvoice>("/sales-invoices/", credentials, {
    method: "POST",
    body: JSON.stringify(invoice),
  });
}

export function getSalesInvoice(credentials: Credentials, invoiceId: number) {
  return request<SalesInvoice>(`/sales-invoices/${invoiceId}/`, credentials);
}

export function updateSalesInvoice(credentials: Credentials, invoiceId: number, invoice: SalesInvoiceInput) {
  return request<SalesInvoice>(`/sales-invoices/${invoiceId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(invoice),
  });
}

export function deleteSalesInvoice(credentials: Credentials, invoiceId: number) {
  return request<void>(`/sales-invoices/${invoiceId}/`, credentials, { method: "DELETE" });
}

export type GovernmentInvoiceItemInput = {
  service: number | "";
  description: string;
  government_fee: string;
  service_fee: string;
  quantity: string;
  start_date: string;
  end_date: string;
};

export type GovernmentInvoiceInput = {
  invoice_date: string;
  customer: number | "";
  items: GovernmentInvoiceItemInput[];
  discount_amount: string;
  received_amount: string;
  payment_mode: PaymentMode;
  paid_by_staff: boolean;
  staff: number | null | "";
  notes: string;
};

export type GovernmentInvoiceItem = Omit<GovernmentInvoiceItemInput, "service" | "quantity"> & {
  id: number;
  service: number;
  service_name: string;
  quantity: number;
  line_total: string;
};

export type GovernmentInvoice = {
  id: number;
  invoice_number: string;
  invoice_date: string;
  customer: number;
  customer_name: string;
  customer_email: string;
  items: GovernmentInvoiceItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  received_amount: string;
  balance_amount: string;
  payment_mode: PaymentMode;
  paid_by_staff: boolean;
  staff: number | null;
  staff_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export async function listGovernmentInvoices(credentials: Credentials) {
  const payload = await request<GovernmentInvoice[] | { results: GovernmentInvoice[] }>("/government-invoices/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createGovernmentInvoice(credentials: Credentials, invoice: GovernmentInvoiceInput) {
  return request<GovernmentInvoice>("/government-invoices/", credentials, {
    method: "POST",
    body: JSON.stringify(invoice),
  });
}

export function getGovernmentInvoice(credentials: Credentials, invoiceId: number) {
  return request<GovernmentInvoice>(`/government-invoices/${invoiceId}/`, credentials);
}

export function updateGovernmentInvoice(credentials: Credentials, invoiceId: number, invoice: GovernmentInvoiceInput) {
  return request<GovernmentInvoice>(`/government-invoices/${invoiceId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(invoice),
  });
}

export function deleteGovernmentInvoice(credentials: Credentials, invoiceId: number) {
  return request<void>(`/government-invoices/${invoiceId}/`, credentials, { method: "DELETE" });
}

export async function listGovernmentStaff(credentials: Credentials) {
  const payload = await request<StaffMember[] | { results: StaffMember[] }>("/government-invoices/staff/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export type QuotationItemInput = {
  service: number | "";
  description: string;
  government_fee: string;
  service_fee: string;
  quantity: string;
  start_date: string;
  end_date: string;
};

export type QuotationInput = {
  quotation_date: string;
  customer: number | "";
  items: QuotationItemInput[];
  discount_amount: string;
  notes: string;
};

export type QuotationItem = Omit<QuotationItemInput, "service" | "quantity"> & {
  id: number;
  service: number;
  service_name: string;
  quantity: number;
  line_total: string;
};

export type Quotation = {
  id: number;
  quotation_number: string;
  quotation_date: string;
  customer: number;
  customer_name: string;
  customer_email: string;
  items: QuotationItem[];
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export async function listQuotations(credentials: Credentials) {
  const payload = await request<Quotation[] | { results: Quotation[] }>("/quotations/", credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createQuotation(credentials: Credentials, quotation: QuotationInput) {
  return request<Quotation>("/quotations/", credentials, {
    method: "POST",
    body: JSON.stringify(quotation),
  });
}

export function getQuotation(credentials: Credentials, quotationId: number) {
  return request<Quotation>(`/quotations/${quotationId}/`, credentials);
}

export function updateQuotation(credentials: Credentials, quotationId: number, quotation: QuotationInput) {
  return request<Quotation>(`/quotations/${quotationId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(quotation),
  });
}

export function deleteQuotation(credentials: Credentials, quotationId: number) {
  return request<void>(`/quotations/${quotationId}/`, credentials, { method: "DELETE" });
}

export type CustomerDocumentInput = {
  document_title: string;
  expiry_date: string;
  customer: number | "";
  notes: string;
};

export type CustomerDocument = CustomerDocumentInput & {
  id: number;
  customer_name: string;
  created_at: string;
  updated_at: string;
};

export type CustomerDocumentFilters = {
  expiry_from?: string;
  expiry_to?: string;
  customer?: number | "";
};

export async function listCustomerDocuments(credentials: Credentials, filters: CustomerDocumentFilters = {}) {
  const query = new URLSearchParams();
  if (filters.expiry_from) query.set("expiry_from", filters.expiry_from);
  if (filters.expiry_to) query.set("expiry_to", filters.expiry_to);
  if (filters.customer) query.set("customer", String(filters.customer));
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await request<CustomerDocument[] | { results: CustomerDocument[] }>(`/customer-documents/${suffix}`, credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createCustomerDocument(credentials: Credentials, document: CustomerDocumentInput) {
  return request<CustomerDocument>("/customer-documents/", credentials, {
    method: "POST",
    body: JSON.stringify(document),
  });
}

export function updateCustomerDocument(credentials: Credentials, documentId: number, document: CustomerDocumentInput) {
  return request<CustomerDocument>(`/customer-documents/${documentId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(document),
  });
}

export function deleteCustomerDocument(credentials: Credentials, documentId: number) {
  return request<void>(`/customer-documents/${documentId}/`, credentials, { method: "DELETE" });
}

export type ReminderInput = {
  reminder_title: string;
  due_date: string;
  customer: number | "";
  notes: string;
};

export type Reminder = ReminderInput & {
  id: number;
  customer_name: string;
  created_at: string;
  updated_at: string;
};

export type ReminderFilters = {
  due_from?: string;
  due_to?: string;
  customer?: number | "";
};

export async function listReminders(credentials: Credentials, filters: ReminderFilters = {}) {
  const query = new URLSearchParams();
  if (filters.due_from) query.set("due_from", filters.due_from);
  if (filters.due_to) query.set("due_to", filters.due_to);
  if (filters.customer) query.set("customer", String(filters.customer));
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const payload = await request<Reminder[] | { results: Reminder[] }>(`/reminders/${suffix}`, credentials);
  return Array.isArray(payload) ? payload : payload.results;
}

export function createReminder(credentials: Credentials, reminder: ReminderInput) {
  return request<Reminder>("/reminders/", credentials, {
    method: "POST",
    body: JSON.stringify(reminder),
  });
}

export function updateReminder(credentials: Credentials, reminderId: number, reminder: ReminderInput) {
  return request<Reminder>(`/reminders/${reminderId}/`, credentials, {
    method: "PATCH",
    body: JSON.stringify(reminder),
  });
}

export function deleteReminder(credentials: Credentials, reminderId: number) {
  return request<void>(`/reminders/${reminderId}/`, credentials, { method: "DELETE" });
}
