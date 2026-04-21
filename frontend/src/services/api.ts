// Central fetch wrapper with JWT auth injection and 401 handling

const BASE_URL = '/api';

function getToken(): string | null {
  const user = localStorage.getItem('expense_user');
  if (!user) return null;
  try {
    return JSON.parse(user).token ?? null;
  } catch {
    return null;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem('expense_user');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  // Handle empty responses (e.g. 200 OK with no body for DELETE)
  const text = await response.text();
  if (!text) return undefined as unknown as T;
  return JSON.parse(text) as T;
}
