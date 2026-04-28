'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const HOTEL = {
    name: 'Casa Hotel',
    tagline: 'Hospitality & Excellence',
    address: 'KG 11 Ave, Kiyovu',
    city: 'Kigali, Rwanda',
    phone: '+250 788 000 000',
    email: 'info@casahotel.rw',
    website: 'www.casahotel.rw',
    tin: 'TIN: 123456789',
};

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const { data: invoice, isLoading } = useSWR(
        params.id ? `/api/invoices/${params.id}` : null,
        fetcher
    );

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-gold/30 border-t-gold animate-spin mx-auto mb-4" />
                <p className="font-bold text-white/30 uppercase tracking-widest text-sm">Loading Invoice...</p>
            </div>
        </div>
    );

    if (!invoice) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <span className="material-icons-outlined text-5xl text-red-400/50 block mb-4">receipt_long</span>
                <p className="font-bold text-red-400 text-xl">Invoice not found</p>
                <button onClick={() => router.back()} className="mt-4 text-gold text-sm font-bold hover:underline">← Go back</button>
            </div>
        </div>
    );

    const subtotal = invoice.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) ?? invoice.amount;
    const subInvoicesTotal = invoice.subInvoices?.reduce((s: number, i: any) => s + i.amount, 0) ?? 0;
    const grandTotal = invoice.amount;
    const invoiceRef = `INV-${invoice.id.slice(-8).toUpperCase()}`;

    return (
        <div className="min-h-screen bg-black print:bg-white">
            <style>{`
        @media print {
          @page { margin: 12mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .invoice-wrap { padding: 0 !important; background: white !important; }
          .invoice-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

            {/* Toolbar */}
            <div className="no-print sticky top-0 z-50 px-6 py-3 flex items-center justify-between gap-4" style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
                    <span className="material-icons-outlined text-base">arrow_back</span>
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${invoice.status === 'PAID' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
                        {invoice.status}
                    </span>
                    <button onClick={() => window.print()} className="flex items-center gap-2 bg-gold text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-gold-light transition-all shadow-gold-sm">
                        <span className="material-icons-outlined text-base">print</span>
                        Print / PDF
                    </button>
                </div>
            </div>

            {/* Invoice Body */}
            <div className="invoice-wrap p-6 md:p-10 flex justify-center">
                <div className="invoice-card bg-white w-full max-w-[860px] shadow-2xl shadow-slate-300/50 rounded-2xl overflow-hidden border border-slate-200 print:rounded-none">

                    {/* Colour top bar */}
                    <div className="h-2 bg-primary print:bg-primary" />

                    <div className="p-10 md:p-14">
                        {/* ── HEADER: Hotel info + Invoice meta ── */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-14">
                            {/* Hotel identity */}
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 overflow-hidden">
                                    <Image src="/logo.png" alt="Casa Hotel Logo" width={56} height={56} className="object-contain" onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
                                    {/* Fallback initials if logo fails */}
                                    <span className="text-white font-black text-xl hidden">CH</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{HOTEL.name}</h1>
                                    <p className="text-xs font-bold text-primary/70 uppercase tracking-widest mt-0.5">{HOTEL.tagline}</p>
                                    <div className="mt-3 space-y-0.5 text-xs text-slate-500 font-medium">
                                        <p>{HOTEL.address}</p>
                                        <p>{HOTEL.city}</p>
                                        <p>{HOTEL.phone} · {HOTEL.email}</p>
                                        <p>{HOTEL.tin}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice title + ref */}
                            <div className="text-left sm:text-right flex-shrink-0">
                                <h2 className="text-5xl font-black text-slate-100 uppercase tracking-tight leading-none select-none">INVOICE</h2>
                                <p className="text-base font-black text-primary mt-2 tracking-widest">{invoiceRef}</p>
                                <div className="mt-4 space-y-1 text-xs font-medium text-slate-500">
                                    <p><span className="font-bold text-slate-700">Date:</span> {new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    <p><span className="font-bold text-slate-700">Type:</span> {invoice.type || 'ROOM'}</p>
                                    <p><span className="font-bold text-slate-700">Status:</span>{' '}
                                        <span className={invoice.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>{invoice.status}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── BILLED TO ── */}
                        <div className="bg-slate-50 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row justify-between gap-6">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Billed To</p>
                                <h3 className="text-xl font-black text-slate-800">{invoice.guestName}</h3>
                                <p className="text-sm text-slate-500 mt-1">Guest · {invoice.guestSignature ? 'Signed' : 'Pending signature'}</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">From</p>
                                <h3 className="text-base font-black text-slate-800">{HOTEL.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{HOTEL.website}</p>
                            </div>
                        </div>

                        {/* ── LINE ITEMS ── */}
                        <div className="mb-10 overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-left text-sm min-w-[560px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] w-10">#</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Description</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center w-16">Qty</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right w-32">Unit Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right w-32">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {/* Direct line items */}
                                    {invoice.items?.map((item: any, i: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-bold text-xs">{i + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{item.description}</td>
                                            <td className="px-6 py-4 text-center text-slate-500">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-slate-600">RWF {item.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800">RWF {(item.quantity * item.price).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    {/* Sub-invoices (master invoice) */}
                                    {invoice.subInvoices?.map((sub: any) => (
                                        <tr key={sub.id} className="bg-slate-50/30 hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-bold text-xs">—</td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-800">Invoice #{sub.id.slice(-6).toUpperCase()}</span>
                                                <span className="ml-2 text-[10px] font-black text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full uppercase">{sub.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">1</td>
                                            <td className="px-6 py-4 text-right text-slate-600">RWF {sub.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-800">RWF {sub.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── TOTALS ── */}
                        <div className="flex justify-end mb-14">
                            <div className="w-72 space-y-3">
                                {invoice.items && invoice.items.length > 0 && (
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Subtotal</span>
                                        <span>RWF {subtotal.toLocaleString()}</span>
                                    </div>
                                )}
                                {subInvoicesTotal > 0 && (
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Linked Invoices</span>
                                        <span>RWF {subInvoicesTotal.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg pt-4 border-t-2 border-primary/30">
                                    <span className="font-black text-slate-900 uppercase tracking-tight">Grand Total</span>
                                    <span className="font-black text-primary text-2xl">RWF {grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── SIGNATURE ── */}
                        <div className="grid grid-cols-2 gap-12 border-t border-slate-100 pt-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">Guest Signature</p>
                                <div className="h-px bg-slate-200 w-full mb-3" />
                                <p className="text-xs text-slate-400">By signing, I confirm the above charges are correct.</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-12">Authorized By</p>
                                <div className="h-px bg-slate-200 w-full mb-3" />
                                <p className="text-xs text-slate-400">{HOTEL.name} · Front Desk</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer strip */}
                    <div className="bg-primary/5 border-t border-primary/10 px-14 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 font-medium">
                        <span>{HOTEL.name} — {HOTEL.city}</span>
                        <div className="flex gap-6">
                            <span className="flex items-center gap-1.5"><span className="material-icons-outlined text-sm text-primary/60">call</span>{HOTEL.phone}</span>
                            <span className="flex items-center gap-1.5"><span className="material-icons-outlined text-sm text-primary/60">language</span>{HOTEL.website}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
