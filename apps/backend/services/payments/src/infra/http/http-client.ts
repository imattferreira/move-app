// TODO: handle errors
import { camelfy, snakefy } from '~/utils/object';

interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: Record<string, unknown>): Promise<T>;
}

export class FetchHttpClientAdapter implements HttpClient {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    const data = await res.json();

    return camelfy(data) as T;
  }

  async post<T>(url: string, data: Record<string, unknown>): Promise<T> {
    const body = JSON.stringify(snakefy(data));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
    const d = await res.json();

    return camelfy(d) as T;
  }
}

export default HttpClient;
