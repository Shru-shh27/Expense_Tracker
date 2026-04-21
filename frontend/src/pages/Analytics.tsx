import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, AlertTriangle, TrendingDown, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import { analyticsService, type SummaryResponse, type CategoryResponse } from '../services/analyticsService';
import { budgetService } from '../services/budgetService';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#64748b'];
const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Education: '📚', Bills: '🧾', Other: '💸',
};

export default function Analytics() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Budget setter
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [savingBudget, setSavingBudget] = useState(false);

  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sum, cat] = await Promise.all([
        analyticsService.getSummary(month, year),
        analyticsService.getCategoryBreakdown(month, year),
      ]);
      setSummary(sum);
      setCategory(cat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [month, year]);

  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetInput);
    if (!amount || amount <= 0) return;
    setSavingBudget(true);
    try {
      await budgetService.set({ limitAmount: amount, month, year });
      setShowBudgetModal(false);
      setBudgetInput('');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save budget');
    } finally {
      setSavingBudget(false);
    }
  };

  const categoryData = Object.entries(category?.categoryTotals ?? {}).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  const totalExpenses = Number(summary?.totalExpenses ?? 0);
  const budgetLimit = Number(summary?.budgetLimit ?? 0);
  const budgetPct = budgetLimit > 0 ? Math.min((totalExpenses / budgetLimit) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-slate-500 text-sm">Your financial overview for {monthName} {year}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="analytics-set-budget"
            onClick={() => setShowBudgetModal(true)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium hover:border-primary transition-colors"
          >
            {budgetLimit ? 'Update Budget' : '+ Set Budget'}
          </button>
          {/* Month navigation */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2">
            <button id="prev-month" onClick={prevMonth} className="hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold min-w-[100px] text-center">{monthName} {year}</span>
            <button id="next-month" onClick={nextMonth} className="hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-3xl" />)}
          </div>
          <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col gap-2">
              <p className="text-sm text-slate-500 font-medium">Total Spent</p>
              <h3 className="text-3xl font-bold text-danger">${totalExpenses.toFixed(2)}</h3>
              <p className="text-xs text-slate-400 mt-auto">{monthName} {year}</p>
            </Card>

            <Card className="flex flex-col gap-2">
              <p className="text-sm text-slate-500 font-medium">Budget Limit</p>
              <h3 className="text-3xl font-bold">{budgetLimit ? `$${budgetLimit.toFixed(2)}` : '—'}</h3>
              {budgetLimit > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{budgetPct.toFixed(0)}% used</span>
                    <span>${(budgetLimit - totalExpenses).toFixed(2)} left</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${budgetPct >= 100 ? 'bg-danger' : budgetPct >= 80 ? 'bg-amber-400' : 'bg-success'}`}
                      style={{ width: `${budgetPct}%` }}
                    />
                  </div>
                </div>
              )}
              {!budgetLimit && (
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="text-primary text-xs hover:underline mt-auto"
                >
                  Set a budget →
                </button>
              )}
            </Card>

            <Card className={`flex flex-col gap-2 ${summary?.budgetExceeded ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}`}>
              <p className="text-sm text-slate-500 font-medium">Status</p>
              {summary?.budgetExceeded ? (
                <>
                  <div className="flex items-center gap-2 text-danger">
                    <AlertTriangle size={20} />
                    <h3 className="text-xl font-bold">Over Budget!</h3>
                  </div>
                  <p className="text-sm text-danger/80">Exceeded by ${(totalExpenses - budgetLimit).toFixed(2)}</p>
                </>
              ) : budgetLimit > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-success">
                    <TrendingDown size={20} />
                    <h3 className="text-xl font-bold">On Track</h3>
                  </div>
                  <p className="text-sm text-slate-500">${(budgetLimit - totalExpenses).toFixed(2)} remaining</p>
                </>
              ) : (
                <h3 className="text-xl font-bold text-slate-400">No budget set</h3>
              )}
            </Card>
          </div>

          {categoryData.length === 0 ? (
            <Card>
              <div className="text-center py-16 text-slate-400">
                <TrendingDown size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No expense data for {monthName} {year}</p>
                <p className="text-sm mt-1">Add some expenses to see your analytics</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Spending by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, 'Spent']} />
                      <Legend formatter={(value) => `${CATEGORY_ICONS[value] ?? ''} ${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Category Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} layout="vertical">
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                      <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, 'Spent']} />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Category Detail Table */}
              <Card className="lg:col-span-2">
                <h3 className="text-lg font-bold mb-4">Category Details</h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                          style={{ backgroundColor: COLORS[i % COLORS.length] + '20' }}>
                          {CATEGORY_ICONS[item.name] ?? '💸'}
                        </div>
                        <span className="font-medium text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block w-32">
                          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${(item.value / totalExpenses) * 100}%`,
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 w-10 text-right">
                          {((item.value / totalExpenses) * 100).toFixed(0)}%
                        </span>
                        <span className="font-bold text-sm w-20 text-right">${item.value.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBudgetModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-1">Set Monthly Budget</h3>
            <p className="text-slate-500 text-sm mb-4">{monthName} {year}</p>
            <input
              id="budget-amount-input"
              type="number"
              min="1"
              step="0.01"
              value={budgetInput}
              onChange={e => setBudgetInput(e.target.value)}
              placeholder="e.g. 2000.00"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                id="budget-save-btn"
                onClick={handleSaveBudget}
                disabled={savingBudget || !budgetInput}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary text-white text-sm font-medium disabled:opacity-60"
              >
                {savingBudget && <Loader2 size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
