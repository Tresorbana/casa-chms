'use client';
import React from 'react';
import Link from 'next/link';

export default function InvoicePreview() {
  return (
    <div className="flex-1 min-h-screen bg-white p-4 lg:p-8">
      {/* ToolBar Component */}
      <div className="no-print sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md mb-8">
        <div className="w-full flex justify-between gap-2 px-4 py-3 items-center">
          <div className="flex gap-2">
            <Link href="/pos/restaurant" className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-black uppercase tracking-widest">Back to POS</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Pending Signature
            </span>
            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 bg-primary text-white gap-2 text-[10px] font-black uppercase tracking-widest px-6 hover:opacity-90 transition-opacity shadow-lg shadow-primary/30" onClick={() => { window.print() }}>
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-[800px] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden border border-slate-100">
          <div className="flex flex-col items-center justify-center pt-12 pb-8 px-8 border-b border-slate-50">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-primary text-4xl">restaurant</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Casa Hotel</h1>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.3em]">Billing Department</p>
          </div>

          <div className="bg-slate-50/50 py-6 border-b border-slate-100">
            <h2 className="text-slate-900 tracking-widest text-xs font-black uppercase text-center">Pre-final Restaurant Invoice</h2>
            <p className="text-center text-[10px] text-slate-500 mt-2 font-bold">INV #: CH-RES-000000 • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</p>
          </div>

          <div className="p-10 grid grid-cols-2 gap-10">
            <div className="space-y-1">
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">Guest Name</p>
              <p className="text-slate-800 text-xl font-black">Guest Name</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-primary text-[10px] font-black uppercase tracking-widest">Room Number</p>
              <p className="text-slate-800 text-xl font-black">Suite 402</p>
            </div>
          </div>

          <div className="px-10 pb-10">
            <div className="overflow-hidden rounded-3xl border border-slate-100 border-separate">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 uppercase">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest">Item Description</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest text-center">Qty</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-bold">
                  <tr>
                    <td className="px-6 py-5 text-slate-800">Draft Beer (Premium)</td>
                    <td className="px-6 py-5 text-slate-500 text-center">2</td>
                    <td className="px-6 py-5 text-slate-800 text-right">RWF 12,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-5 text-slate-800">Grilled Tilapia w/ Lemon</td>
                    <td className="px-6 py-5 text-slate-500 text-center">1</td>
                    <td className="px-6 py-5 text-slate-800 text-right">RWF 25,000</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-5 text-slate-800">Sparkling Water 500ml</td>
                    <td className="px-6 py-5 text-slate-500 text-center">1</td>
                    <td className="px-6 py-5 text-slate-800 text-right">RWF 4,500</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-10 flex flex-col items-end gap-3 px-6">
              <div className="flex justify-between w-full max-w-[280px] text-xs font-bold text-slate-500">
                <span>Subtotal</span>
                <span>RWF 41,500</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] text-xs font-bold text-slate-500">
                <span>Service Charge (10%)</span>
                <span>RWF 4,150</span>
              </div>
              <div className="flex justify-between w-full max-w-[280px] pt-4 mt-2 border-t border-slate-100">
                <span className="text-slate-900 text-lg font-black uppercase italic tracking-tighter">Grand Total</span>
                <span className="text-primary text-2xl font-black">RWF 45,650</span>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-dashed border-slate-200">
              <p className="text-center text-slate-400 text-[10px] font-bold italic mb-16 uppercase tracking-wider">
                I, the undersigned, agree that the total amount above will be charged to my room account.
              </p>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[320px] border-b-2 border-slate-200 mb-4 h-12"></div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Guest Signature</p>
              </div>
            </div>
          </div>
          <div className="h-3 bg-primary w-full"></div>
        </div>

        <div className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-3">
          <p>© 2024 Casa Hotel Management System v3.0</p>
          <div className="flex justify-center gap-6">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">call</span> +250 788 000 000</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">language</span> casahotel.rw</span>
          </div>
        </div>
      </div>
    </div>
  );
}
