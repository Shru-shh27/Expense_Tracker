import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Wallet, ShoppingBag, TrendingUp, Plus, AlertTriangle } from 'lucide-react';
import Card from '../components/Card';
import { expenseService, type ExpenseResponse } from '../services/expenseService';
import { analyticsService, type SummaryResponse } from '../services/analyticsService';

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Education: '📚', Bills: '🧾', Other: '💸',
};

interface Props {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [expData, sumData] = await Promise.all([
          expenseService.getAll(),
          analyticsService.getSummary(month, year),
        ]);
        setExpenses(expData);
        setSummary(sumData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [month, year]);

  // Build weekly chart data from expenses (last 7 days)
  const chartData = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const totals: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      totals[days[d.getDay()]] = 0;
    }
    expenses.forEach(e => {
      const d = new Date(e.date);
      const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
      if (diff <= 6) {
        const label = days[d.getDay()];
        totals[label] = (totals[label] ?? 0) + Number(e.amount);
      }
    });
    return Object.entries(totals).map(([name, expense]) => ({ name, expense: +expense.toFixed(2) }));
  })();

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalExpenses = summary?.totalExpenses ?? 0;
  const budget = summary?.budgetLimit ?? 0;
  const budgetExceeded = summary?.budgetExceeded ?? false;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-3xl" />)}
        </div>
        <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <button
          id="dashboard-add-expense"
          onClick={() => onNavigate('transactions')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-2xl shadow-soft font-medium transition-colors"
        >
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {budgetExceeded && (
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-2xl text-sm flex items-center gap-2">
          <AlertTriangle size={16} /> You've exceeded your monthly budget of ${Number(budget).toFixed(2)}!
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Monthly Expenses</p>
              <h3 className="text-2xl font-bold">${Number(totalExpenses).toFixed(2)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
            <TrendingUp size={16} />
            <span>{expenses.length} transactions this month</span>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${budgetExceeded ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Budget Limit</p>
              <h3 className="text-2xl font-bold">{budget ? `$${Number(budget).toFixed(2)}` : 'Not set'}</h3>
            </div>
          </div>
          {budget > 0 && (
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${budgetExceeded ? 'bg-danger' : 'bg-success'}`}
                style={{ width: `${Math.min((Number(totalExpenses) / Number(budget)) * 100, 100)}%` }}
              />
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-4 bg-gradient-to-br from-primary to-primary-hover border-none text-white">
          <h3 className="text-lg font-bold">Ask AI Assistant</h3>
          <p className="text-sm opacity-90 mt-1">Get insights on your spending habits and budget recommendations instantly.</p>
          <button
            id="dashboard-try-ai"
            onClick={() => onNavigate('assistant')}
            className="mt-auto self-start bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-all"
          >
            Try it now →
          </button>
        </Card>
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-6">Last 7 Days Spending</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(val: number) => [`$${val}`, 'Spent']}
                />
                <Area type="monotone" dataKey="expense" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold">Recent</h3>
            <button
              id="dashboard-view-all"
              onClick={() => onNavigate('transactions')}
              className="text-primary text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No expenses yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentExpenses.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                      {CATEGORY_ICONS[tx.category] ?? '💸'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm truncate max-w-[120px]">{tx.description}</p>
                      <p className="text-xs text-slate-500">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-danger">-${Number(tx.amount).toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Stats */}
      {expenses.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">All-Time Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-2xl font-bold text-primary">{expenses.length}</p>
              <p className="text-xs text-slate-500 mt-1">Total Transactions</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-2xl font-bold text-danger">
                ${expenses.reduce((s, e) => s + Number(e.amount), 0).toFixed(0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total Spent</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-2xl font-bold text-success">
                ${(expenses.reduce((s, e) => s + Number(e.amount), 0) / expenses.length).toFixed(0)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Avg per Transaction</p>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <p className="text-2xl font-bold">
                {[...new Set(expenses.map(e => e.category))].length}
              </p>
              <p className="text-xs text-slate-500 mt-1">Categories Used</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
