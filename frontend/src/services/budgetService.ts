import { apiFetch } from './api';

export interface BudgetRequest {
  limitAmount: number;
  month: number;
  year: number;
}

export interface BudgetResponse {
  id: string;
  limitAmount: number;
  month: number;
  year: number;
  message: string;
}

export const budgetService = {
  get: (month: number, year: number) =>
    apiFetch<BudgetResponse>(`/budgets?month=${month}&year=${year}`),

  set: (data: BudgetRequest) =>
    apiFetch<BudgetResponse>('/budgets', { method: 'POST', body: data }),
};
