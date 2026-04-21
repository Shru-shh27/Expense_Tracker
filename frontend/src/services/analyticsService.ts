import { apiFetch } from './api';

export interface SummaryResponse {
  month: number;
  year: number;
  totalExpenses: number;
  budgetLimit: number;
  budgetExceeded: boolean;
}

export interface CategoryResponse {
  month: number;
  year: number;
  categoryTotals: Record<string, number>;
}

export const analyticsService = {
  getSummary: (month: number, year: number) =>
    apiFetch<SummaryResponse>(`/analytics/summary?month=${month}&year=${year}`),

  getCategoryBreakdown: (month: number, year: number) =>
    apiFetch<CategoryResponse>(`/analytics/category?month=${month}&year=${year}`),
};
