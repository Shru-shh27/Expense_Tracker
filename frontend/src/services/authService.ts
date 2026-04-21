import { apiFetch } from './api';

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
}

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<string>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
};
