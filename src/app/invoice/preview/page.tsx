'use client';
import React, { Suspense } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const HOTEL = {
  name: 'Casa Hotel',
  address: 'KG 11 Ave, Kiyovu · Kigali, Rwanda',
  phone: '+250 788 000 000',
  website: 'www.casahotel.rw',
};

/**
 * /invoice/preview?id=<invoiceId>
 * Used for a quick pre-print view, primarily from the POS flow.
 */
function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');

  const { data: invoice, isLoading } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  if (!invoiceId) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400 font-bold">No invoice specified.</p>
    </div>
  );
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!invoice) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-red-400 font-bold">Invoice not found.</p>
    </div>
  );

  const grandTotal = invoice.amount;
  const invoiceRef = `INV-${invoice.id.slice(-8).toUpperCase()}`;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 print:bg-white">
      <style>{`
        @media print {
          @page { margin: 10mm; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur px-5 py-3 flex justify-between items-center gap-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
            {invoice.status}
          </span>
          <button
            className="flex items-center justify-center rounded-xl h-10 bg-primary text-white gap-2 text-[10px] font-black uppercase tracking-widest px-6 hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            Print / PDF
          </button>
        </div>
      </div>

      {/* Receipt card */}
      <div className="flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-[680px] bg-white shadow-2xl shadow-slate-300/40 rounded-[2rem] overflow-hidden border border-slate-100">
          {/* top bar */}
          <div className="h-2 bg-primary" />

          {/* Hotel Header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-10 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4 overflow-hidden">
              <Image src="/logo.png" alt="Casa Hotel" width={52} height={52} className="object-contain" onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">{HOTEL.name}</h1>
            <p className="text-xs text-slate-400 font-medium mt-1 text-center">{HOTEL.address}</p>
          </div>

          {/* Invoice info */}
          <div className="bg-primary/5 px-10 py-4 flex justify-between border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</p>
              <p className="font-black text-primary text-sm">{invoiceRef}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
              <p className="font-black text-sm text-slate-700">
                {new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Guest */}
          <div className="px-10 py-5 border-b border-slate-100">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Billed To</p>
            <p className="text-lg font-black text-slate-800">{invoice.guestName}</p>
          </div>

          {/* Line items */}
          <div className="px-10 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="text-center pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-12">Qty</th>
                  <th className="text-right pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoice.items?.map((item: any, i: number) => (
                  <tr key={item.id || i}>
                    <td className="py-3 font-semibold text-slate-700">{item.description}</td>
                    <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-3 text-right font-black text-slate-800">
                      RWF {(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {invoice.subInvoices?.map((sub: any) => (
                  <tr key={sub.id} className="bg-slate-50/40">
                    <td className="py-3 font-semibold text-slate-700">
                      Invoice #{sub.id.slice(-6).toUpperCase()}
                      <span className="ml-2 text-[10px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase">{sub.type}</span>
                    </td>
                    <td className="py-3 text-center text-slate-500">1</td>
                    <td className="py-3 text-right font-black text-slate-800">RWF {sub.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="px-10 pb-8 flex flex-col items-end border-t border-slate-100 pt-5">
            <div className="flex justify-between w-full max-w-[240px] mt-2 pt-3 border-t-2 border-primary/30">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
              <span className="text-2xl font-black text-primary">RWF {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Signature */}
          <div className="px-10 pb-10 pt-4 border-t border-dashed border-slate-200">
            <p className="text-center text-slate-400 text-[10px] font-bold italic mb-8 uppercase tracking-wider">
              I agree that the total amount above will be charged to my account.
            </p>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] border-b-2 border-slate-200 mb-3 h-12" />
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Guest Signature</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-primary/5 border-t border-primary/10 py-5 px-10 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              {HOTEL.name} · {HOTEL.phone} · {HOTEL.website}
            </p>
          </div>
          <div className="h-2 bg-primary/30" />
        </div>
      </div>
    </div>
  );
}

export default function InvoicePreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
