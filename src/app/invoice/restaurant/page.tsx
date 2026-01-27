'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams } from 'next/navigation';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');
  
  const { data: apiInvoice, error, isLoading } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  const [invoiceData, setInvoiceData] = useState({
      id: 'INV-2023-0842',
      date: 'Oct 24, 2023',
      time: '14:30 PM',
      cashier: 'John Doe',
      customer: 'Walk-in Guest',
      table: 'Table #12 - Terrace View',
      guests: '2 Adults',
      paymentMethod: 'Mobile Money (M-Pesa)',
      paymentRef: 'QXJ92841LS',
      items: [
          { name: 'Grilled Salmon Steak', qty: 2, price: 24.50 },
          { name: 'Espresso Martini', qty: 2, price: 12.00 },
          { name: 'Truffle Mushroom Pizza', qty: 1, price: 18.00 },
          { name: 'Sparkling Water (L)', qty: 1, price: 4.50 }
      ],
      subtotal: 95.50,
      tax: 9.55,
      serviceCharge: 4.78,
      total: 109.83
  });

  useEffect(() => {
    if (apiInvoice) {
      // Map API data to UI state
      const subtotal = apiInvoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
      const tax = subtotal * 0.1;
      const serviceCharge = subtotal * 0.05;
      const total = subtotal + tax + serviceCharge;
      
      const dateObj = new Date(apiInvoice.date);

      setInvoiceData({
        id: apiInvoice.id,
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        cashier: 'System', // Placeholder
        customer: apiInvoice.guestName,
        table: 'N/A', // Placeholder
        guests: 'N/A', // Placeholder
        paymentMethod: apiInvoice.status === 'PAID' ? 'Paid' : 'Pending',
        paymentRef: 'N/A',
        items: apiInvoice.items.map((item: any) => ({
          name: item.description,
          qty: item.quantity,
          price: item.price
        })),
        subtotal,
        tax,
        serviceCharge,
        total
      });
    }
  }, [apiInvoice]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen ml-64">Loading invoice...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen ml-64 text-red-500">Error loading invoice</div>;
  }

  return (
    <div className="flex-1 min-h-screen relative">
      
<div className="layout-container flex h-full grow flex-col">
{/* Top Navigation Bar */}
<main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-10 lg:px-40 ml-64"><div className="flex justify-end gap-4 mb-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">
<span className="truncate">Download PDF</span>
</button><button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#e7f3eb] dark:bg-[#1e3224] text-[#0e1b12] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-80 transition-all" onClick={() => { window.print() }}>
<span className="material-symbols-outlined mr-2 text-lg">print</span>
<span className="truncate">Print</span>
</button></div>
{/* Breadcrumbs */}
<div className="w-full max-w-[960px] flex flex-wrap gap-2 py-4 no-print">
<a className="text-[#4e9767] text-sm font-medium leading-normal hover:underline" href="#">Management</a>
<span className="text-[#4e9767] text-sm font-medium leading-normal">/</span>
<a className="text-[#4e9767] text-sm font-medium leading-normal hover:underline" href="#">Restaurant</a>
<span className="text-[#4e9767] text-sm font-medium leading-normal">/</span>
<span className="text-[#0e1b12] dark:text-white text-sm font-medium leading-normal">Final Invoice</span>
</div>
{/* Page Heading */}
<div className="w-full max-w-[960px] flex flex-wrap justify-between items-end gap-3 pb-8 no-print">
<div className="flex min-w-72 flex-col gap-1">
<h1 className="text-[#0e1b12] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Final Restaurant Invoice</h1>
<p className="text-[#4e9767] text-sm font-normal leading-normal">Generate and settle bills for walk-in or table service.</p>
</div>
<div className="flex items-center gap-2">
<span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">Status: {invoiceData.paymentMethod === 'Pending' ? 'Unpaid' : 'Settled'}</span>
</div>
</div>
{/* Invoice Card (The Printable Area) */}
<div className="invoice-card w-full max-w-[800px] bg-white dark:bg-[#1a2e20] shadow-xl rounded-xl overflow-hidden flex flex-col border border-[#e7f3eb] dark:border-[#1e3224]">
{/* Decorative Top Bar */}
<div className="h-2 w-full bg-primary"></div>
<div className="p-8 md:p-12">
{/* Invoice Header Section */}
<div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
<div className="flex flex-col gap-4">
<div className="flex items-center gap-2">
<div className="size-8 text-primary">
<svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"></path>
</svg>
</div>
<h2 className="text-xl font-bold tracking-tight">Casa Hotel Restaurant</h2>
</div>
<div className="text-sm text-[#4e9767] leading-relaxed">
<p>123 Luxury Avenue, City Center</p>
<p>Phone: +254 700 123 456</p>
<p>Email: dining@casahotel.com</p>
<p>KRA PIN: P051234567X</p>
</div>
</div>
<div className="text-left md:text-right">
<h3 className="text-3xl font-black text-[#0e1b12] dark:text-white mb-2">INVOICE</h3>
<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
<span className="text-[#4e9767]">Invoice No:</span>
<span className="font-bold">#{invoiceData.id.substring(0, 8)}</span>
<span className="text-[#4e9767]">Date:</span>
<span>{invoiceData.date}</span>
<span className="text-[#4e9767]">Time:</span>
<span>{invoiceData.time}</span>
<span className="text-[#4e9767]">Cashier:</span>
<span>{invoiceData.cashier}</span>
</div>
</div>
</div>
{/* Customer Info & Payment Method */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
<div className="p-4 rounded-lg bg-background-light dark:bg-[#112116] border border-[#e7f3eb] dark:border-[#1e3224]">
<p className="text-xs font-bold text-[#4e9767] uppercase tracking-widest mb-2">Billed To</p>
<p className="text-lg font-bold">{invoiceData.customer}</p>
<p className="text-sm text-[#4e9767]">{invoiceData.table}</p>
<p className="text-sm text-[#4e9767]">Guest Count: {invoiceData.guests}</p>
</div>
<div className="p-4 rounded-lg bg-background-light dark:bg-[#112116] border border-[#e7f3eb] dark:border-[#1e3224]">
<p className="text-xs font-bold text-[#4e9767] uppercase tracking-widest mb-2">Payment Details</p>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">contactless</span>
<div>
<p className="text-sm font-bold">{invoiceData.paymentMethod}</p>
<p className="text-sm text-[#4e9767]">Ref: {invoiceData.paymentRef}</p>
</div>
</div>
</div>
</div>
{/* Itemized Charges Table */}
<div className="mb-12 overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b-2 border-[#e7f3eb] dark:border-[#1e3224]">
<th className="py-4 font-bold text-sm uppercase tracking-wider">Item Description</th>
<th className="py-4 font-bold text-sm uppercase tracking-wider text-center">Qty</th>
<th className="py-4 font-bold text-sm uppercase tracking-wider text-right">Unit Price</th>
<th className="py-4 font-bold text-sm uppercase tracking-wider text-right">Total</th>
</tr>
</thead>
<tbody>
{invoiceData.items.map((item, index) => (
    <tr key={index} className="border-b border-[#e7f3eb] dark:border-[#1e3224]">
        <td className="py-4 font-medium">{item.name}</td>
        <td className="py-4 text-center">{item.qty}</td>
        <td className="py-4 text-right">${item.price.toFixed(2)}</td>
        <td className="py-4 text-right font-bold">${(item.qty * item.price).toFixed(2)}</td>
    </tr>
))}
</tbody>
</table>
</div>
{/* Totals Section */}
<div className="flex justify-end mb-12">
<div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-3">
<div className="flex justify-between text-sm">
<span className="font-medium text-[#4e9767]">Subtotal</span>
<span className="font-bold">${invoiceData.subtotal.toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="font-medium text-[#4e9767]">Tax (10%)</span>
<span className="font-bold">${invoiceData.tax.toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="font-medium text-[#4e9767]">Service Charge (5%)</span>
<span className="font-bold">${invoiceData.serviceCharge.toFixed(2)}</span>
</div>
<div className="h-px w-full bg-[#e7f3eb] dark:border-[#1e3224] my-2"></div>
<div className="flex justify-between text-xl font-black text-primary">
<span className="text-[#4e9767] mr-2 text-base font-medium self-center">Total Paid</span>
<span>${invoiceData.total.toFixed(2)}</span>
</div>
</div>
</div>
{/* Footer Note */}
<div className="mt-16 text-center border-t border-dashed border-gray-200 dark:border-gray-700 pt-8">
<p className="text-sm font-medium italic text-[#4e9767]">"Thank you for dining at Casa Hotel. We hope to see you again soon!"</p>
<div className="mt-4 flex justify-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest">
<span>Quality Service</span>
<span>•</span>
<span>Authentic Taste</span>
<span>•</span>
<span>Luxury Stay</span>
</div>
</div>
</div>
{/* Print Specific Footer */}
<div className="hidden print:block text-[10px] text-center text-gray-400 py-4 italic">
                    This is a computer-generated receipt and does not require a physical signature.
                </div>
</div>
{/* Additional Help/Support Links (No-Print) */}
<div className="w-full max-w-[800px] flex justify-center gap-6 mt-8 no-print">
<button className="flex items-center gap-2 text-sm text-[#4e9767] hover:text-primary transition-colors">
<span className="material-symbols-outlined text-base">mail</span>
                    Email Copy to Guest
                </button>
<button className="flex items-center gap-2 text-sm text-[#4e9767] hover:text-primary transition-colors">
<span className="material-symbols-outlined text-base">history</span>
                    Void Invoice
                </button>
<button className="flex items-center gap-2 text-sm text-[#4e9767] hover:text-primary transition-colors">
<span className="material-symbols-outlined text-base">help</span>
                    Support
                </button>
</div>
</main>
</div>

    </div>
  );
}

export default function InvoiceRestaurant() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen ml-64">Loading...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
