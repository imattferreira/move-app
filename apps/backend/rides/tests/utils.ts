type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Response<T> = {
  status: number;
  data: T | null;
};

const BASE_URL = 'http://localhost:3000';

export function makeRequest<T>(
  method: HttpMethods,
  endpoint: string
): Promise<Response<T>>;

export function makeRequest<T>(
  method: HttpMethods,
  endpoint: string,
  data: Record<string, unknown>
): Promise<Response<T>>;

export async function makeRequest<T>(
  method: HttpMethods,
  endpoint: string,
  data?: Record<string, unknown>
): Promise<Response<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const fetchArgs: RequestInit = { method: method };

  if (method !== 'GET' && data) {
    fetchArgs.body = JSON.stringify(data);
    fetchArgs.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(url, fetchArgs);

  if (res.headers.get('Content-Type')?.includes('application/json')) {
    return {
      status: res.status,
      data: (await res.json()) as T
    };
  }

  return {
    status: res.status,
    data: null
  };
}
