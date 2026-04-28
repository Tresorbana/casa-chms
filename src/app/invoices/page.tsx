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
        <div className="flex-1 min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Invoice Management"
                description="View and manage guest invoices and billing records."
                actions={
                    <input
                        type="search"
                        placeholder="Search invoices..."
                        className="bg-navy-surface border border-gold/20 rounded-xl px-4 py-2 text-sm font-bold text-white placeholder:text-white/25 shadow-sm outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition-all"
                        onChange={(e) => setFilter(e.target.value)}
                    />
                }
            />

            {isLoading ? (
                <div className="py-20 text-center font-bold text-white/30">Loading Invoices...</div>
            ) : (
                <div className="bg-navy-surface rounded-3xl border border-gold/15 overflow-hidden shadow-xl shadow-black/30 relative">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-xs text-white/30 font-bold uppercase tracking-widest border-b border-gold/[0.1]">
                            <tr>
                                <th className="p-6">Invoice ID</th>
                                <th className="p-6">Guest</th>
                                <th className="p-6">Type</th>
                                <th className="p-6">Amount</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {filtered.map((inv: any) => (
                                <tr key={inv.id} className="hover:bg-gold/[0.03] transition-colors">
                                    <td className="p-6 font-mono text-xs font-bold text-white/30">#{inv.id.slice(-6).toUpperCase()}</td>
                                    <td className="p-6 font-bold text-white">{inv.guestName}</td>
                                    <td className="p-6">
                                        <span className="px-2 py-1 bg-gold/10 rounded text-[10px] font-black uppercase text-gold/80 border border-gold/15">
                                            {inv.type}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-white/80">RWF {inv.amount.toLocaleString()}</td>
                                    <td className="p-6">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-black uppercase ${inv.status === 'PAID' ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-400/20' : 'bg-amber-900/30 text-amber-400 border border-amber-400/20'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <Link href={`/invoice/${inv.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-xl text-xs font-bold hover:bg-gold-light transition-all shadow-sm shadow-gold/20">
                                            <span className="material-icons-outlined text-sm">visibility</span>
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-white/30 font-bold">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
