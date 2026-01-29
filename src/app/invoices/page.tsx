'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

export default function InvoicesList() {
    const { data: invoices, isLoading } = useSWR('/api/invoices', fetcher);
    const [filter, setFilter] = useState('');

    const filtered = invoices?.filter((inv: any) =>
        inv.guestName.toLowerCase().includes(filter.toLowerCase()) ||
        inv.id.toLowerCase().includes(filter.toLowerCase())
    ) || [];

    return (
        <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Invoice Management"
                description="View and manage guest invoices and billing records."
                actions={
                    <input
                        type="search"
                        placeholder="Search invoices..."
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
            />

            {isLoading ? (
                <div className="py-20 text-center font-bold text-slate-400">Loading Invoices...</div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 font-bold uppercase tracking-widest">
                            <tr>
                                <th className="p-6">Invoice ID</th>
                                <th className="p-6">Guest</th>
                                <th className="p-6">Type</th>
                                <th className="p-6">Amount</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filtered.map((inv: any) => (
                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-6 font-mono text-xs font-bold text-slate-400">#{inv.id.slice(-6).toUpperCase()}</td>
                                    <td className="p-6 font-bold text-slate-800 dark:text-white">{inv.guestName}</td>
                                    <td className="p-6">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-black uppercase text-slate-500">
                                            {inv.type}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-slate-700 dark:text-slate-300">RWF {inv.amount.toLocaleString()}</td>
                                    <td className="p-6">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase ${inv.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <Link href={`/invoice/${inv.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                                            <span className="material-icons-outlined text-sm">visibility</span>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400 font-bold">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
