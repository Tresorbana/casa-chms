'use client';
import React, { useRef } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function InvoicePage() {
    const params = useParams();
    const { data: invoice, isLoading } = useSWR(params.id ? `/api/invoices/${params.id}` : null, fetcher);

    // Print functionality
    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Invoice...</div>;
    if (!invoice) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Invoice not found</div>;

    const total = invoice.amount;
    // Tax removed

    return (
        <div className="min-h-screen bg-slate-100 p-4 lg:p-8 flex justify-center">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                    nav, aside, button { display: none !important; }
                    .invoice-container { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
                }
            `}</style>

            <div className="invoice-container bg-white w-full max-w-4xl p-12 shadow-2xl relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-16 border-b-4 border-slate-900 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">INVOICE</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">#{invoice.id.slice(-8).toUpperCase()}</p>
                        <span className={`inline-block mt-4 px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full ${invoice.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {invoice.status}
                        </span>
                    </div>
                    <div className="text-right">
                        {/* Logo Placeholder */}
                        <div className="bg-slate-900 text-white w-16 h-16 flex items-center justify-center font-black text-2xl mb-4 ml-auto">
                            CH
                        </div>
                        <h2 className="font-bold text-xl text-slate-900">Casa Hotel</h2>
                        <p className="text-sm text-slate-500 w-48 ml-auto">
                            Property Address<br />
                            City, Country<br />
                            +000 000 000 000
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="flex justify-between mb-16">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Billed To</p>
                        <h3 className="text-xl font-bold text-slate-900">{invoice.guestName}</h3>
                        <p className="text-sm text-slate-500 max-w-xs mt-1">Guest ID: {invoice.guestId || 'Walk-in'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Date</p>
                        <h3 className="text-xl font-bold text-slate-900">{new Date(invoice.date).toLocaleDateString()}</h3>
                        <p className="text-sm text-slate-500 mt-1">Due on Receipt</p>
                    </div>
                </div>

                {/* Line Items */}
                <div className="mb-16">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest w-16">#</th>
                                <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest">Description</th>
                                <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right w-24">Qty</th>
                                <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right w-32">Price</th>
                                <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoice.items?.map((item: any, i: number) => (
                                <tr key={item.id} className="text-sm">
                                    <td className="py-4 text-slate-400 font-bold">{i + 1}</td>
                                    <td className="py-4 font-bold text-slate-800">{item.description}</td>
                                    <td className="py-4 text-right text-slate-500">{item.quantity}</td>
                                    <td className="py-4 text-right text-slate-500">{item.price.toLocaleString()}</td>
                                    <td className="py-4 text-right font-bold text-slate-900">{(item.quantity * item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                            {/* Master Invoice: Sub Invoices */}
                            {invoice.subInvoices?.map((sub: any, i: number) => (
                                <tr key={sub.id} className="text-sm bg-slate-50">
                                    <td className="py-4 text-slate-400 font-bold">Ref</td>
                                    <td className="py-4 font-bold text-slate-800">
                                        LINKED INVOICE #{sub.id.slice(-6).toUpperCase()}
                                        <span className="ml-2 text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                                            {sub.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right text-slate-500">1</td>
                                    <td className="py-4 text-right text-slate-500">{sub.amount.toLocaleString()}</td>
                                    <td className="py-4 text-right font-bold text-slate-900">{sub.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-16">
                    <div className="w-64 space-y-3">


                        <div className="flex justify-between text-xl border-t-2 border-slate-900 pt-3">
                            <span className="font-black text-slate-900">Total</span>
                            <span className="font-black text-primary">RWF {total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Signature */}
                <div className="grid grid-cols-2 gap-12 border-t border-slate-200 pt-8 mt-auto">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-16">Guest Signature</p>
                        <div className="h-px bg-slate-900 w-full mb-2"></div>
                        <p className="text-xs text-slate-400">By signing, I agree to the <span className="underline">Terms & Conditions</span>.</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-16">Authorized Signature</p>
                        <div className="h-px bg-slate-900 w-full mb-2"></div>
                        <p className="text-xs text-slate-400">Casa Hotel Management</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="absolute top-12 right-12 print:hidden flex gap-4">
                    <button
                        onClick={handlePrint}
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-2"
                    >
                        <span className="material-icons-outlined">print</span>
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
