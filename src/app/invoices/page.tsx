'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

export default function InvoicesList() {
  const { data: invoices, isLoading } = useSWR('/api/invoices', fetcher, {
    onError: () => toast.error('Failed to load invoices'),
  });
  const [filter, setFilter] = useState('');

  const filtered = invoices?.filter((inv: any) =>
    inv.guestName.toLowerCase().includes(filter.toLowerCase()) ||
    inv.id.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Invoices"
        description="Guest invoices and billing records."
        actions={
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">search</span>
            <input
              type="search"
              placeholder="Search invoices..."
              className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all w-52"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground text-sm">Loading invoices...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {['Invoice ID', 'Guest', 'Type', 'Amount', 'Status', ''].map((h, i) => (
                    <th key={h} className={`px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">#{inv.id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{inv.guestName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-muted rounded text-[10px] font-medium uppercase text-muted-foreground">{inv.type}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">RWF {inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium uppercase ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/invoice/${inv.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No invoices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
