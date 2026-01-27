'use client';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '@/components/TopBar';

export default function Checkout() {
  return (
    <div className="flex-1 min-h-screen relative">


      <main className="flex-1 overflow-y-auto p-4 md:p-8 min-h-screen">
        <TopBar
          title="Guest Checkout"
          description="Finalize billing and payment for departing guests."
        />
        <div className="invoice-container w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
            <div>
              <h1 className="text-2xl font-bold">Guest Checkout</h1>
              <p className="text-slate-500 dark:text-slate-400">Finalize billing for <span className="font-semibold text-slate-800 dark:text-white">Room 304 - James Anderson</span></p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium" onClick={() => { window.print() }}>
                <span className="material-icons-outlined text-xl">print</span> Print PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium">
                <span className="material-icons-outlined text-xl">email</span> Email Invoice
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="p-8 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <img alt="Casa Hotel" className="h-20 w-auto mb-4 h-10 object-contain" src="logo.png" />
                <h2 className="text-xl font-bold text-secondary">CASA HOTEL</h2>
                <p className="text-sm text-slate-500">123 Horizon Blvd, Seaside City<br />T: +1 234 567 890 | E: billing@casahotel.com</p>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-light text-slate-400 mb-2 uppercase tracking-widest">Invoice</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Invoice No:</span> #CH-2023-8842</p>
                  <p><span className="font-medium">Date:</span> Oct 24, 2023</p>
                  <p><span className="font-medium">Due Date:</span> Upon Checkout</p>
                </div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Guest Details</p>
                <p className="font-semibold text-lg">James Anderson</p>
                <p className="text-slate-600 dark:text-slate-400">james.anderson@email.com</p>
                <p className="text-slate-600 dark:text-slate-400">+1 (555) 012-3456</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Check-in</p>
                  <p className="font-medium">Oct 20, 2023</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Check-out</p>
                  <p className="font-medium">Oct 24, 2023</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Room Type</p>
                  <p className="font-medium text-primary">Deluxe Suite - 304</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</p>
                  <p className="font-medium">4 Nights</p>
                </div>
              </div>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-8 py-4">Description</th>
                    <th className="px-4 py-4 text-center">Qty/Days</th>
                    <th className="px-4 py-4 text-right">Price</th>
                    <th className="px-4 py-4 text-right">VAT (12%)</th>
                    <th className="px-8 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  <tr>
                    <td className="px-8 py-4">
                      <div className="font-semibold">Room Stay (Oct 20 - Oct 24)</div>
                      <div className="text-xs text-slate-500 italic">Standard Nightly Rate</div>
                    </td>
                    <td className="px-4 py-4 text-center">4</td>
                    <td className="px-4 py-4 text-right">RWF 310,000</td>
                    <td className="px-4 py-4 text-right">RWF 148,000</td>
                    <td className="px-8 py-4 text-right font-medium">RWF 1,395,000</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">
                      <div className="font-semibold text-secondary flex items-center gap-1">
                        <span className="material-icons-outlined text-base">restaurant</span>
                        Azure Bar &amp; Grill
                      </div>
                      <div className="text-xs text-slate-500">Dinner Service (Bill #4421)</div>
                    </td>
                    <td className="px-4 py-4 text-center">1</td>
                    <td className="px-4 py-4 text-right">RWF 105,000</td>
                    <td className="px-4 py-4 text-right">RWF 15,000</td>
                    <td className="px-8 py-4 text-right font-medium">RWF 118,000</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">
                      <div className="font-semibold text-secondary flex items-center gap-1">
                        <span className="material-icons-outlined text-base">local_bar</span>
                        Sky Lounge
                      </div>
                      <div className="text-xs text-slate-500">Drinks &amp; Snacks (Bill #4450)</div>
                    </td>
                    <td className="px-4 py-4 text-center">1</td>
                    <td className="px-4 py-4 text-right">RWF 55,000</td>
                    <td className="px-4 py-4 text-right">RWF 8,000</td>
                    <td className="px-8 py-4 text-right font-medium">RWF 62,000</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">
                      <div className="font-semibold">Laundry Services</div>
                      <div className="text-xs text-slate-500 italic">Express Dry Cleaning - 5 Items</div>
                    </td>
                    <td className="px-4 py-4 text-center">1</td>
                    <td className="px-4 py-4 text-right">RWF 42,000</td>
                    <td className="px-4 py-4 text-right">RWF 12,000</td>
                    <td className="px-8 py-4 text-right font-medium">RWF 48,000</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">
                      <div className="font-semibold">Wellness &amp; Spa</div>
                      <div className="text-xs text-slate-500 italic">60m Deep Tissue Massage</div>
                    </td>
                    <td className="px-4 py-4 text-center">1</td>
                    <td className="px-4 py-4 text-right">RWF 135,000</td>
                    <td className="px-4 py-4 text-right">RWF 21,000</td>
                    <td className="px-8 py-4 text-right font-medium">RWF 145,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 no-print">Apply Discount Code or Manual Reduction</label>
                <div className="flex gap-2 no-print">
                  <input className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary" placeholder="e.g. EARLYBIRD10" type="text" />
                  <button className="bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700">Apply</button>
                </div>
                <div className="mt-4 p-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-xs text-slate-500">
                  <span className="material-icons-outlined text-base align-middle mr-1">info</span>
                  Managers can apply a maximum of 15% discount without additional authorization.
                </div>
              </div>
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-medium">RWF 1,590,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">VAT (12%):</span>
                  <span className="font-medium">RWF 195,000</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-slate-500">Discount (10%):</span>
                  <span className="font-medium text-red-500">-RWF 159,000</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="text-lg font-bold">Grand Total:</span>
                  <span className="text-2xl font-bold text-primary">RWF 1,625,000</span>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 no-print">
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-secondary">verified_user</span>
                <span className="text-sm text-slate-500">Secure Payment Guaranteed</span>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-lg transition-colors">
                  Cancel
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-primary hover:bg-orange-500 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02]">
                  <span className="material-icons-outlined">done_all</span>
                  Finalize Check-out
                </button>
              </div>
            </div>
            <div className="hidden print:block p-8 pt-12 text-center text-xs text-slate-400">
              <p className="mb-2">Thank you for staying at Casa Hotel! We hope to see you again soon.</p>
              <p>© 2023 Casa Hotel. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </main>
      <button className="fixed bottom-6 right-6 p-3 bg-white dark:bg-slate-800 shadow-xl rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:scale-110 transition-all no-print" onClick={() => { document.documentElement.classList.toggle('dark') }}>
        <span className="material-icons-outlined block dark:hidden">dark_mode</span>
        <span className="material-icons-outlined hidden dark:block">light_mode</span>
      </button>

    </div>
  );
}
