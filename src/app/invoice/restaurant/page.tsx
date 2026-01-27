'use client';
import React, { useState, useEffect, Suspense } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams } from 'next/navigation';
import TopBar from '@/components/TopBar';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');

  const { data: apiInvoice, error, isLoading } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  const invoiceData = {
    id: invoiceId || 'INV-2024-8842',
    date: 'Oct 24, 2024',
    time: '14:30 PM',
    cashier: 'John Smith',
    customer: 'Walk-in Guest',
    items: [
      { name: 'Grilled Salmon Steak', qty: 2, price: 12500 },
      { name: 'Espresso Martini', qty: 2, price: 8000 },
      { name: 'Truffle Mushroom Pizza', qty: 1, price: 15000 }
    ],
    subtotal: 56000,
    tax: 8400,
    service: 2800,
    total: 67200
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading invoice...</div>;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
      <TopBar
        title="Restaurant Invoice Management"
        description="Review, print, and finalize restaurant billing sessions."
        actions={
          <div className="flex gap-3">
            <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm" onClick={() => window.print()}>
              <span className="material-symbols-outlined text-lg">print</span>
            </button>
            <button className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/30">
              Download PDF
            </button>
          </div>
        }
      />

      <div className="flex flex-col items-center">
        <div className="w-full max-w-[850px] bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="h-3 w-full bg-primary/80"></div>
          <div className="p-12">
            <div className="flex justify-between items-start mb-16">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">Casa Hotel</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Kigali, Rwanda</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black text-slate-100 dark:text-slate-800 uppercase tracking-tighter mb-2">Invoice</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{invoiceData.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-16">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Billing Details</p>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{invoiceData.customer}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Method: Cash/MOMo</p>
                </div>
              </div>
              <div className="space-y-4 text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Transaction Info</p>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-800 dark:text-white uppercase">{invoiceData.date}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cashier: {invoiceData.cashier}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-10">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {invoiceData.items.map((item, i) => (
                    <tr key={i} className="text-sm font-bold">
                      <td className="px-8 py-6 text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="px-8 py-6 text-center text-slate-500">{item.qty}</td>
                      <td className="px-8 py-6 text-right text-slate-500">RWF {item.price.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right text-slate-900 dark:text-white font-black">RWF {(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end gap-3 px-8">
              <div className="flex justify-between w-full max-w-[320px] text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>RWF {invoiceData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[320px] text-xs font-black text-slate-400 uppercase tracking-widest">
                <span>Tax (15%)</span>
                <span>RWF {invoiceData.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[320px] pt-6 mt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-900 dark:text-white text-xl font-black uppercase italic tracking-tighter">Grand Total</span>
                <span className="text-primary text-3xl font-black">RWF {invoiceData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50/50 dark:bg-slate-800/50 p-12 text-center border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Thank you for dining with us</p>
            <div className="w-32 h-32 mx-auto bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-4xl">qr_code_2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantInvoice() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Initializing invoice...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
