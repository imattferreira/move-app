type Response<T> = {
  status: number;
  data: T;
};

const BASE_URL = 'http://localhost:3000';

export function makeRequest<T>(endpoint: string): Promise<Response<T>>;

export function makeRequest<T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<Response<T>>;

export async function makeRequest<T>(
  endpoint: string,
  data?: Record<string, unknown>
): Promise<Response<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const method = data ? 'POST' : 'GET';
  const fetchArgs: RequestInit = { method: method };

  if (data) {
    fetchArgs.body = JSON.stringify(data);
    fetchArgs.headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(url, fetchArgs);

  return {
    status: res.status,
    data: (await res.json()) as T
  };
}
