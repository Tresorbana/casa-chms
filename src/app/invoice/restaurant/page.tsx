'use client';
import React, { Suspense } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const HOTEL = {
  name: 'Casa Hotel',
  tagline: 'Restaurant & Dining',
  address: 'KG 11 Ave, Kiyovu · Kigali, Rwanda',
  phone: '+250 788 000 000',
  website: 'www.casahotel.rw',
  tin: 'TIN: 123456789',
};

function RestaurantInvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');

  const { data: apiInvoice, isLoading } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  if (!invoiceId) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="font-bold text-slate-400">No invoice ID specified.</p>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Loading Invoice...</p>
      </div>
    </div>
  );

  if (!apiInvoice) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <span className="material-icons-outlined text-5xl text-red-300 block mb-4">receipt_long</span>
        <p className="font-bold text-red-500 text-xl">Invoice not found</p>
        <button onClick={() => router.back()} className="mt-4 text-primary text-sm font-bold hover:underline">← Go back</button>
      </div>
    </div>
  );

  const subtotal = apiInvoice.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) ?? apiInvoice.amount;
  const grandTotal = apiInvoice.amount;
  const invoiceRef = `INV-${apiInvoice.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(apiInvoice.date);

  return (
    <div className="min-h-screen bg-black print:bg-white">
      <style>{`
        @media print {
          @page { margin: 10mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .inv-card { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-50 px-6 py-3 flex items-center justify-between gap-4" style={{ background: '#111111', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors">
          <span className="material-icons-outlined text-base">arrow_back</span>
          Back to POS
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${apiInvoice.status === 'PAID' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'}`}>
            {apiInvoice.status}
          </span>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-gold text-black px-5 py-2 rounded-xl text-sm font-bold hover:bg-gold-light transition-all shadow-gold-sm">
            <span className="material-icons-outlined text-base">picture_as_pdf</span>
            Print / PDF
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div className="p-6 md:p-10 flex justify-center">
        <div className="inv-card bg-white w-full max-w-[720px] shadow-2xl shadow-slate-300/50 rounded-2xl overflow-hidden border border-slate-200">
          {/* Top accent */}
          <div className="h-2 bg-primary" />

          {/* Receipt-style header */}
          <div className="flex flex-col items-center pt-10 pb-8 px-10 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mb-4 overflow-hidden">
              <Image src="/logo.png" alt="Casa Hotel Logo" width={52} height={52} className="object-contain" onError={(e: any) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{HOTEL.name}</h1>
            <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mt-1">{HOTEL.tagline}</p>
            <p className="text-xs text-slate-400 font-medium mt-2 text-center">{HOTEL.address}</p>
            <p className="text-xs text-slate-400 font-medium">{HOTEL.phone} · {HOTEL.website}</p>
            <p className="text-xs text-slate-400 font-medium">{HOTEL.tin}</p>
          </div>

          {/* Invoice meta */}
          <div className="bg-primary/5 px-10 py-5 flex justify-between items-center border-b border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice No.</p>
              <p className="text-base font-black text-primary">{invoiceRef}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
              <p className="text-sm font-black text-slate-700">
                {invoiceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-slate-500 font-medium">{invoiceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Billed to */}
          <div className="px-10 py-5 border-b border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Guest</p>
                <p className="text-lg font-black text-slate-800">{apiInvoice.guestName}</p>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-1 ${apiInvoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {apiInvoice.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="px-10 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                  <th className="text-center pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-12">Qty</th>
                  <th className="text-right pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">Price</th>
                  <th className="text-right pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {apiInvoice.items?.map((item: any, i: number) => (
                  <tr key={item.id || i} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-700">{item.description}</td>
                    <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-500">RWF {item.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-black text-slate-800">RWF {(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="px-10 pb-8 flex flex-col items-end gap-2 border-t border-slate-100 pt-6">
            <div className="flex justify-between w-full max-w-[260px] text-sm text-slate-500 font-medium">
              <span>Subtotal</span>
              <span>RWF {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-[260px] pt-3 mt-1 border-t-2 border-primary/30">
              <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total</span>
              <span className="text-2xl font-black text-primary">RWF {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Thank you footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-10 py-8 text-center">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Thank you for dining at Casa Hotel</p>
            <p className="text-xs text-slate-300 font-medium">{HOTEL.website} · {HOTEL.phone}</p>
          </div>

          {/* Bottom bar */}
          <div className="h-2 bg-primary/20" />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantInvoicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <RestaurantInvoiceContent />
    </Suspense>
  );
}
