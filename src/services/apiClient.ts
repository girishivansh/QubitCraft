export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ data?: T; error?: string }> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.signal ? 30000 : 8000);

    const res = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = json?.detail || json?.error || `Request failed with status ${res.status}`;
      return { error: errMsg };
    }

    return { data: json as T };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { error: 'Request timed out' };
    }
    return { error: err.message || 'Network request failed' };
  }
}
