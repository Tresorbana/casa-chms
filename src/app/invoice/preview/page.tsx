'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function InvoicePreview() {
  return (
    <div className="flex-1 min-h-screen relative">
      <main className="ml-64 min-h-screen p-8">
{/* ToolBar Component */}
<div className="no-print sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
<div className="max-w-[960px] mx-auto flex justify-between gap-2 px-4 py-3 items-center">
<div className="flex gap-2">
<button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
<span className="material-symbols-outlined">arrow_back</span>
<span className="text-sm font-semibold">Back to POS</span>
</button>
</div>
<div className="flex items-center gap-3">
<span className="hidden md:inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
<span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    Pending Signature
                </span>
<button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary text-background-dark dark:text-background-dark gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:opacity-90 transition-opacity" onClick={() => { window.print() }}>
<span className="material-symbols-outlined">picture_as_pdf</span>
<span className="truncate">Export to PDF</span>
</button>
</div>
</div>
</div>
<div className="layout-container flex h-full grow flex-col items-center py-8 px-4">
<div className="layout-content-container flex flex-col w-full max-w-[960px] bg-white dark:bg-slate-900 shadow-xl print-shadow-none rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800">
{/* Header Section with Brand */}
<div className="flex flex-col items-center justify-center pt-10 pb-6 px-8 border-b border-slate-50 dark:border-slate-800">
<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-primary text-4xl">restaurant</span>
</div>
<h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">Casa Hotel</h1>
<p className="text-sm text-slate-500 dark:text-slate-400">Luxury Restaurant &amp; Lounge</p>
<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em]">Billing Department</p>
</div>
{/* HeadlineText Component */}
<div className="bg-slate-50 dark:bg-slate-800/50 py-4">
<h2 className="text-slate-900 dark:text-white tracking-tight text-xl md:text-2xl font-bold leading-tight px-4 text-center">Pre-final Restaurant Invoice</h2>
<p className="text-center text-xs text-slate-500 mt-1">Invoice #: CH-RES-99421 • Oct 24, 2023 08:45 PM</p>
</div>
{/* DescriptionList Component (Guest Info) */}
<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="flex flex-col gap-1 border-t border-solid border-slate-200 dark:border-slate-700 pt-4">
<p className="text-primary text-xs font-bold uppercase tracking-wider leading-normal">Guest Name</p>
<p className="text-slate-900 dark:text-white text-lg font-semibold leading-normal">John Doe</p>
</div>
<div className="flex flex-col gap-1 border-t border-solid border-slate-200 dark:border-slate-700 pt-4">
<p className="text-primary text-xs font-bold uppercase tracking-wider leading-normal">Room Number</p>
<p className="text-slate-900 dark:text-white text-lg font-semibold leading-normal">Suite 402</p>
</div>
</div>
{/* Table Component (Bill Items) */}
<div className="px-6 py-4">
<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800">
<th className="px-4 py-3 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">Item Name</th>
<th className="px-4 py-3 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider text-center">Qty</th>
<th className="px-4 py-3 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider text-right">Unit Price</th>
<th className="px-4 py-3 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider text-right">Total</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr>
<td className="px-4 py-4 text-slate-800 dark:text-slate-200 text-sm font-medium">Draft Beer (Premium)</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-center">2</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-right">$5.00</td>
<td className="px-4 py-4 text-slate-900 dark:text-white text-sm font-semibold text-right">$10.00</td>
</tr>
<tr>
<td className="px-4 py-4 text-slate-800 dark:text-slate-200 text-sm font-medium">Grilled Tilapia w/ Lemon Butter</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-center">1</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-right">$25.00</td>
<td className="px-4 py-4 text-slate-900 dark:text-white text-sm font-semibold text-right">$25.00</td>
</tr>
<tr>
<td className="px-4 py-4 text-slate-800 dark:text-slate-200 text-sm font-medium">Sparkling Water 500ml</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-center">1</td>
<td className="px-4 py-4 text-slate-500 dark:text-slate-400 text-sm text-right">$4.50</td>
<td className="px-4 py-4 text-slate-900 dark:text-white text-sm font-semibold text-right">$4.50</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Totals Section */}
<div className="px-6 py-4 flex flex-col items-end gap-2 border-b border-slate-100 dark:border-slate-800">
<div className="flex justify-between w-full max-w-[240px]">
<span className="text-slate-500 dark:text-slate-400 text-sm">Subtotal</span>
<span className="text-slate-900 dark:text-white text-sm font-medium">$39.50</span>
</div>
<div className="flex justify-between w-full max-w-[240px]">
<span className="text-slate-500 dark:text-slate-400 text-sm">Service Charge (10%)</span>
<span className="text-slate-900 dark:text-white text-sm font-medium">$3.95</span>
</div>
<div className="flex justify-between w-full max-w-[240px] pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
<span className="text-slate-900 dark:text-white text-lg font-bold">Grand Total</span>
<span className="text-primary text-xl font-extrabold">$43.45</span>
</div>
</div>
{/* Signature Area */}
<div className="p-8 mt-4">
<p className="text-center text-slate-500 dark:text-slate-400 text-xs mb-12 italic leading-relaxed">
                    "I, the undersigned, agree that the total amount above will be charged to my room account and I am responsible for payment in full upon checkout."
                </p>
<div className="flex flex-col items-center justify-center">
<div className="w-full max-w-[400px] border-b-2 border-slate-300 dark:border-slate-600 mb-2 h-16">
{/* Space for physical signature */}
</div>
<span className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Guest Signature</span>
<span className="text-slate-400 text-[10px] mt-1">Date: ____________________</span>
</div>
</div>
{/* Footer Logo/Pattern */}
<div className="h-2 bg-primary w-full"></div>
</div>
{/* Extra Info Footer */}
<div className="mt-8 text-center text-slate-400 dark:text-slate-500 text-xs max-w-[960px] flex flex-col gap-2">
<p>Generated by Casa Hotel Management System v4.2.0</p>
<div className="flex justify-center gap-4">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">call</span>
                    +1 (555) CASA-HOTEL
                </span>
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">language</span>
                    www.casahotel.example
                </span>
</div>
</div>
</div>
</main>
    </div>
  );
}
