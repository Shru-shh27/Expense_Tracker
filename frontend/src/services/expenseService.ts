import { apiFetch } from './api';

export type ExpenseRequest = {
  description: string;
  amount: number;
  category: string;
  date: string; // ISO date string YYYY-MM-DD
};

export type ExpenseResponse = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

export const expenseService = {
  getAll: () => apiFetch<ExpenseResponse[]>('/expenses'),

  create: (data: ExpenseRequest) =>
    apiFetch<ExpenseResponse>('/expenses', { method: 'POST', body: data }),

  update: (id: string, data: ExpenseRequest) =>
    apiFetch<ExpenseResponse>(`/expenses/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    apiFetch<void>(`/expenses/${id}`, { method: 'DELETE' }),
};
