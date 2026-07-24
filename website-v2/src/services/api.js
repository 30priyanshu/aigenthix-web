import { config } from '../lib/config';

const DEFAULT_TIMEOUT_MS = 15000;

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL || config.API_URL;
  }

  async request(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const isFormDataBody = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const defaultHeaders = isFormDataBody
      ? { Accept: 'application/json' }
      : { 'Content-Type': 'application/json', Accept: 'application/json' };

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.error || data?.detail || response.statusText || 'Unknown API Error';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async postForm(endpoint, formData, timeoutMs = DEFAULT_TIMEOUT_MS, options = {}) {
    return this.request(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: formData,
        headers: {
          ...(options.headers || {}),
          Accept: 'application/json',
        },
      },
      timeoutMs
    );
  }
}

export const apiClient = new ApiClient(config.API_URL);
