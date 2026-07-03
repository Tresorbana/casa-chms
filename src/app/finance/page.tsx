'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

const EXPENSE_CATEGORIES = [
  'UTILITIES',
  'SUPPLIES',
  'SALARIES',
  'MAINTENANCE',
  'FOOD_PURCHASE',
  'TRANSPORT',
  'RENT',
  'FUEL',
  'OTHER',
];

const CATEGORY_LABELS: Record<string, string> = {
  UTILITIES: 'Utilities',
  SUPPLIES: 'Supplies',
  SALARIES: 'Salaries & Wages',
  MAINTENANCE: 'Maintenance',
  FOOD_PURCHASE: 'Food & Beverage Purchase',
  TRANSPORT: 'Transport',
  RENT: 'Rent',
  FUEL: 'Fuel',
  OTHER: 'Other',
};

const INCOME_TYPE_LABELS: Record<string, string> = {
  ROOM: 'Room Revenue',
  RESTAURANT: 'Restaurant & Bar',
  CONFERENCE: 'Events & Conference',
  SERVICE: 'Services & Add-ons',
  OTHER_INCOME: 'Other Income',
};

const OTHER_INCOME_CATEGORIES = ['PARKING', 'LAUNDRY', 'TRANSPORT', 'COMMISSION', 'DONATION', 'RENT_OUT', 'OTHER'];
const OTHER_INCOME_LABELS: Record<string, string> = {
  PARKING: 'Parking Fees',
  LAUNDRY: 'Laundry',
  TRANSPORT: 'Transport',
  COMMISSION: 'Commission',
  DONATION: 'Donation',
  RENT_OUT: 'Space Rental',
  OTHER: 'Other',
};

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    UTILITIES: 'bg-blue-100 text-blue-700',
    SUPPLIES: 'bg-purple-100 text-purple-700',
    SALARIES: 'bg-amber-100 text-amber-700',
    MAINTENANCE: 'bg-orange-100 text-orange-700',
    FOOD_PURCHASE: 'bg-green-100 text-green-700',
    TRANSPORT: 'bg-pink-100 text-pink-700',
    RENT: 'bg-pink-100 text-pink-700',
    FUEL: 'bg-amber-100 text-amber-700',
    OTHER: 'bg-muted text-muted-foreground',
  };
  return map[cat] || 'bg-muted text-muted-foreground';
}

export default function Finance() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'income' | 'other-income'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'UTILITIES',
    description: '',
    amount: '',
    date: todayStr,
    paymentMethod: 'CASH',
    vendor: '',
  });
  const [incomeForm, setIncomeForm] = useState({
    description: '',
    amount: '',
    category: 'OTHER',
    date: todayStr,
    paymentMethod: 'CASH',
    source: '',
  });

  const { data, isLoading } = useSWR(
    `/api/finance?from=${from}&to=${to}`,
    fetcher,
    { onError: () => toast.error('Failed to load finance data') }
  );

  const { data: otherIncomeData, mutate: mutateOtherIncome } = useSWR(
    `/api/finance/other-income?from=${from}&to=${to}`,
    fetcher
  );

  const totalIncome = data?.totalIncome ?? 0;
  const totalExpenses = data?.totalExpenses ?? 0;
  const profit = data?.profit ?? 0;
  const expenses: any[] = data?.expenses ?? [];
  const invoices: any[] = data?.invoices ?? [];
  const otherIncomeItems: any[] = Array.isArray(otherIncomeData) ? otherIncomeData : (data?.otherIncome ?? []);
  const incomeByType: Record<string, number> = data?.incomeByType ?? {};
  const expensesByCategory: Record<string, number> = data?.expensesByCategory ?? {};

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount) { toast.error('Description and amount required'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { toast.error('Failed to record expense'); return; }
      mutate(`/api/finance?from=${from}&to=${to}`);
      setIsModalOpen(false);
      setForm({ category: 'UTILITIES', description: '', amount: '', date: todayStr, paymentMethod: 'CASH', vendor: '' });
      toast.success('Expense recorded');
    } catch { toast.error('Error recording expense'); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await fetch(`/api/finance/${id}`, { method: 'DELETE' });
      mutate(`/api/finance?from=${from}&to=${to}`);
      toast.success('Expense deleted');
    } catch { toast.error('Failed to delete expense'); }
  };

  const handleAddOtherIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.description || !incomeForm.amount) { toast.error('Description and amount required'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/finance/other-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incomeForm),
      });
      if (!res.ok) { toast.error('Failed to record income'); return; }
      mutate(`/api/finance?from=${from}&to=${to}`);
      mutateOtherIncome();
      setIsIncomeModalOpen(false);
      setIncomeForm({ description: '', amount: '', category: 'OTHER', date: todayStr, paymentMethod: 'CASH', source: '' });
      toast.success('Income recorded');
    } catch { toast.error('Error recording income'); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteOtherIncome = async (id: string) => {
    if (!confirm('Delete this income record?')) return;
    try {
      await fetch(`/api/finance/other-income?id=${id}`, { method: 'DELETE' });
      mutate(`/api/finance?from=${from}&to=${to}`);
      mutateOtherIncome();
      toast.success('Income record deleted');
    } catch { toast.error('Failed to delete income record'); }
  };

  const profitClass = profit >= 0
    ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : 'text-destructive border-destructive/20 bg-destructive/5';

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Finance"
        description="Income, expenses, and profitability for Ubumwe Hotel by Kamdine."
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Add Income
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">remove_circle</span>
              Record Expense
            </button>
          </div>
        }
      />

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <span className="text-xs font-medium text-muted-foreground">Date range:</span>
        <div className="flex items-center gap-2">
          <input type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" value={from} onChange={e => setFrom(e.target.value)} />
          <span className="text-muted-foreground text-xs">to</span>
          <input type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div className="flex gap-2 ml-auto">
          {['This Month', 'Last 30 Days', 'This Year'].map(label => (
            <button
              key={label}
              onClick={() => {
                const now = new Date();
                if (label === 'This Month') {
                  setFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
                  setTo(now.toISOString().split('T')[0]);
                } else if (label === 'Last 30 Days') {
                  const d = new Date(); d.setDate(d.getDate() - 30);
                  setFrom(d.toISOString().split('T')[0]);
                  setTo(now.toISOString().split('T')[0]);
                } else {
                  setFrom(`${now.getFullYear()}-01-01`);
                  setTo(now.toISOString().split('T')[0]);
                }
              }}
              className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">trending_up</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Income</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">RWF {isLoading ? '—' : totalIncome.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Paid invoices in period</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 text-[18px]">trending_down</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
          </div>
          <p className="text-2xl font-semibold text-foreground">RWF {isLoading ? '—' : totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{expenses.length} expense records</p>
        </div>
        <div className={`border rounded-xl p-5 ${profitClass}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${profit >= 0 ? 'bg-emerald-200' : 'bg-destructive/20'}`}>
              <span className={`material-symbols-outlined text-[18px] ${profit >= 0 ? 'text-emerald-700' : 'text-destructive'}`}>
                {profit >= 0 ? 'savings' : 'money_off'}
              </span>
            </div>
            <p className="text-xs font-medium">{profit >= 0 ? 'Net Profit' : 'Net Loss'}</p>
          </div>
          <p className="text-2xl font-semibold">RWF {isLoading ? '—' : Math.abs(profit).toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-70">Income minus expenses</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-muted border border-border rounded-lg w-fit">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'expenses', label: 'Expenses' },
          { key: 'income', label: 'Invoice Income' },
          { key: 'other-income', label: 'Other Income' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${activeTab === key ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income by Type */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Income by Source</h3>
            </div>
            <div className="p-5 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
              ) : Object.entries(incomeByType).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No income in this period</p>
              ) : Object.entries(incomeByType).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                  <span className="text-sm font-medium text-foreground">{INCOME_TYPE_LABELS[type] || type}</span>
                  <span className="text-sm font-semibold text-emerald-600">RWF {(amount as number).toLocaleString()}</span>
                </div>
              ))}
              {totalIncome > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-sm font-bold text-foreground">RWF {totalIncome.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Expenses by Category</h3>
            </div>
            <div className="p-5 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
              ) : Object.entries(expensesByCategory).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No expenses in this period</p>
              ) : Object.entries(expensesByCategory).map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${categoryColor(cat)}`}>{CATEGORY_LABELS[cat] || cat}</span>
                  </div>
                  <span className="text-sm font-semibold text-destructive">RWF {(amount as number).toLocaleString()}</span>
                </div>
              ))}
              {totalExpenses > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-sm font-bold text-destructive">RWF {totalExpenses.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Expense Records</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{expenses.length} records in selected period</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add expense
            </button>
          </div>
          {expenses.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">receipt</span>
              <p className="text-sm">No expenses recorded in this period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {['Date', 'Category', 'Description', 'Vendor', 'Payment', 'Amount', ''].map((h, i) => (
                      <th key={h || i} className="px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {expenses.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${categoryColor(exp.category)}`}>{CATEGORY_LABELS[exp.category] || exp.category}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground max-w-[200px] truncate">{exp.description}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{exp.vendor || '—'}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{exp.paymentMethod || '—'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-destructive">RWF {exp.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Income Tab */}
      {activeTab === 'income' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Paid Invoices</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{invoices.length} paid invoices in period</p>
          </div>
          {invoices.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">receipt_long</span>
              <p className="text-sm">No paid invoices in this period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {['Date', 'Guest', 'Type', 'Payment Method', 'Amount'].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{new Date(inv.paidAt || inv.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-sm text-foreground">{inv.guestName}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">{INCOME_TYPE_LABELS[inv.type] || inv.type}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{inv.paymentMethod || '—'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-emerald-600">RWF {inv.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Other Income Tab */}
      {activeTab === 'other-income' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Other Income</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{otherIncomeItems.length} records · Non-invoice income (parking, laundry, etc.)</p>
            </div>
            <button
              onClick={() => setIsIncomeModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Add income
            </button>
          </div>
          {otherIncomeItems.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">payments</span>
              <p className="text-sm">No other income recorded in this period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {['Date', 'Category', 'Description', 'Source', 'Payment', 'Amount', 'Recorded by', ''].map((h, i) => (
                      <th key={h || i} className="px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {otherIncomeItems.map((item: any) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-medium">
                          {OTHER_INCOME_LABELS[item.category] || item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground max-w-[180px] truncate">{item.description}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{item.source || '—'}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{item.paymentMethod || '—'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-emerald-600">RWF {item.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{item.createdByName || '—'}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleDeleteOtherIncome(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={5} className="px-5 py-3 text-xs font-semibold text-foreground">Total Other Income</td>
                    <td className="px-5 py-3 text-sm font-bold text-emerald-600">
                      RWF {otherIncomeItems.reduce((s: number, i: any) => s + i.amount, 0).toLocaleString()}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Income Modal */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Record Other Income</h3>
              <button onClick={() => setIsIncomeModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddOtherIncome} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={incomeForm.category} onChange={e => setIncomeForm({ ...incomeForm, category: e.target.value })}>
                    {OTHER_INCOME_CATEGORIES.map(c => <option key={c} value={c}>{OTHER_INCOME_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Date</label>
                  <input type="date" className={inputClass} value={incomeForm.date} onChange={e => setIncomeForm({ ...incomeForm, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description</label>
                <input required type="text" className={inputClass} placeholder="What was the income for?" value={incomeForm.description} onChange={e => setIncomeForm({ ...incomeForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Amount (RWF)</label>
                  <input required type="number" min="0" className={inputClass} placeholder="0" value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Payment Method</label>
                  <select className={inputClass} value={incomeForm.paymentMethod} onChange={e => setIncomeForm({ ...incomeForm, paymentMethod: e.target.value })}>
                    {['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CARD'].map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Source / Reference (optional)</label>
                <input type="text" className={inputClass} placeholder="e.g. Guest name, company, reference" value={incomeForm.source} onChange={e => setIncomeForm({ ...incomeForm, source: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsIncomeModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Recording...' : 'Record Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Record Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Date</label>
                  <input type="date" className={inputClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description</label>
                <input required type="text" className={inputClass} placeholder="What was the expense for?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Amount (RWF)</label>
                  <input required type="number" min="0" className={inputClass} placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Payment Method</label>
                  <select className={inputClass} value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                    {['CASH', 'BANK_TRANSFER', 'MOBILE_MONEY', 'CARD', 'CHEQUE'].map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Vendor / Supplier (optional)</label>
                <input type="text" className={inputClass} placeholder="Who was paid?" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Recording...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
