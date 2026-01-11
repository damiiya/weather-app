export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpError extends Error {
  public status: number;
  public payload?: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

type FetchJsonOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { method = 'GET', headers, body, signal } = options;

  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 204) return null as T;

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const data = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    throw new HttpError(res.status, `Request failed: ${res.status}`, data);
  }

  return data as T;
}
