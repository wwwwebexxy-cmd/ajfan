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
  trn: string;
  notes: string;
};

export type Customer = CustomerInput & {
  id: number;
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
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encodeBasicAuth(credentials)}`,
      ...init?.headers,
    },
  });

  if (!response.ok) throw new AdminApiError(response.status, await readError(response));

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
