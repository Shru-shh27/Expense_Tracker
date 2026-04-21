import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, ShoppingBag } from 'lucide-react';
import Card from '../components/Card';
import { expenseService, type ExpenseRequest, type ExpenseResponse } from '../services/expenseService';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Bills', 'Other'];

const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Shopping: '🛍️', Entertainment: '🎬',
  Health: '💊', Education: '📚', Bills: '🧾', Other: '💸',
};

function today() {
  return new Date().toISOString().split('T')[0];
}

const emptyForm: ExpenseRequest = {
  description: '', amount: 0, category: 'Food', date: today(),
};

export default function Transactions() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ExpenseRequest>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAll();
      setExpenses(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (exp: ExpenseResponse) => {
    setForm({ description: exp.description, amount: Number(exp.amount), category: exp.category, date: exp.date });
    setEditId(exp.id);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditId(null); setForm(emptyForm); };

  const handleSave = async () => {
    if (!form.description || !form.amount || !form.date) return;
    setSaving(true);
    try {
      if (editId) {
        const updated = await expenseService.update(editId, form);
        setExpenses(prev => prev.map(e => e.id === editId ? updated : e));
      } else {
        const created = await expenseService.create(form);
        setExpenses(prev => [created, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch {
      setError('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filterCategory === 'All' ? expenses : expenses.filter(e => e.category === filterCategory);
  const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} · Total: ${totalFiltered.toFixed(2)}</p>
        </div>
        <button
          id="add-expense-btn"
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-2xl font-medium shadow-soft transition-colors"
        >
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-primary text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary'
            }`}
          >
            {cat !== 'All' ? CATEGORY_ICONS[cat] : ''} {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">{error}</div>
      )}

      <Card>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Click "Add Expense" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(exp => (
              <div key={exp.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                    {CATEGORY_ICONS[exp.category] ?? '💸'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{exp.description}</p>
                    <p className="text-xs text-slate-500">{exp.category} · {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-danger">-${Number(exp.amount).toFixed(2)}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(exp)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-primary transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      disabled={deletingId === exp.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-danger transition-colors"
                    >
                      {deletingId === exp.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editId ? 'Edit Expense' : 'Add Expense'}</h3>
              <button onClick={closeModal} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <input
                  id="expense-description"
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Grocery run"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Amount ($)</label>
                  <input
                    id="expense-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.amount || ''}
                    onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input
                    id="expense-date"
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`py-2 rounded-xl text-xs font-medium flex flex-col items-center gap-1 transition-all border ${
                        form.category === cat
                          ? 'bg-primary text-white border-primary shadow-md'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-primary'
                      }`}
                    >
                      <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              id="expense-save-btn"
              onClick={handleSave}
              disabled={saving || !form.description || !form.amount}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
