'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Reports3() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="lg:ml-64 min-h-screen ml-64">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/reports/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-4">View 4</a></div><header className="glass-header px-8 py-4">
<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
<div className="flex flex-col gap-1">
<h2 className="text-xl font-bold tracking-tight">Analytical Admin Insights</h2>
<div className="flex flex-wrap items-center gap-2 mt-1">
<span className="text-[10px] font-bold uppercase text-slate-400 mr-2">Active Filters:</span>
<div className="filter-chip">Nationality: All <button className="hover:text-red-500">×</button></div>
<div className="filter-chip">Room: Executive King <button className="hover:text-red-500">×</button></div>
<div className="filter-chip text-primary border-primary/20 bg-primary/5">Revenue: F&amp;B <button className="hover:text-red-500">×</button></div>
</div>
</div>
<div className="flex flex-wrap items-center gap-3">
<div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
<button className="px-4 py-2 text-xs font-bold border-r border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 rounded-l-lg transition-colors">Nationality</button>
<button className="px-4 py-2 text-xs font-bold border-r border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors">Room Type</button>
<button className="px-4 py-2 text-xs font-bold border-r border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-colors">Date Range</button>
<button className="px-4 py-2 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 rounded-r-lg transition-colors">Staff</button>
</div>
<div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
<div className="group relative">
<button className="bg-primary hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-lg">ios_share</span>
<span>Export Data</span>
</button>
<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
<button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
<span className="material-symbols-outlined text-red-500">picture_as_pdf</span> PDF Document
                            </button>
<button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
<span className="material-symbols-outlined text-green-500">description</span> CSV Spreadsheet
                            </button>
</div>
</div>
<button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-symbols-outlined">contrast</span>
</button>
</div>
</div>
</div>
</header>
<div className="p-8 lg:p-12 space-y-12">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
<div className="chart-container !p-6 flex flex-col justify-between">
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Occupancy</p>
<h4 className="text-3xl font-extrabold mt-1">84.2%</h4>
</div>
<div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
<span className="material-symbols-outlined text-sm">trending_up</span> +5.4% vs LY
                </div>
</div>
<div className="chart-container !p-6 flex flex-col justify-between border-l-4 border-l-accent">
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Revenue</p>
<h4 className="text-3xl font-extrabold mt-1">$482,102</h4>
</div>
<div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
<span className="material-symbols-outlined text-sm">trending_up</span> +12.1% vs LY
                </div>
</div>
<div className="chart-container !p-6 flex flex-col justify-between">
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ADR (Daily Rate)</p>
<h4 className="text-3xl font-extrabold mt-1">$245.00</h4>
</div>
<div className="mt-4 flex items-center gap-1 text-accent text-xs font-bold">
<span className="material-symbols-outlined text-sm">trending_flat</span> Stable
                </div>
</div>
<div className="chart-container !p-6 flex flex-col justify-between">
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RevPAR</p>
<h4 className="text-3xl font-extrabold mt-1">$206.30</h4>
</div>
<div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
<span className="material-symbols-outlined text-sm">trending_up</span> +8.2%
                </div>
</div>
</div>
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
<div className="chart-container xl:col-span-2">
<div className="flex items-center justify-between mb-10">
<div>
<h3 className="text-lg font-bold">Occupancy Trend Analysis</h3>
<p className="text-xs text-slate-400">Monthly breakdown for the current fiscal year</p>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-[10px] font-bold uppercase text-slate-500">Current</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
<span className="text-[10px] font-bold uppercase text-slate-500">Projected</span>
</div>
</div>
</div>
<div className="h-80 w-full relative">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
<line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
<line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
<line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
<path d="M0 300 L0 200 C 100 150, 200 250, 300 180 C 400 110, 500 120, 600 80 C 700 40, 800 100, 900 60 L 1000 40 L 1000 300 Z" fill="url(#gradient-green)" opacity="0.1"></path>
<path d="M0 200 C 100 150, 200 250, 300 180 C 400 110, 500 120, 600 80 C 700 40, 800 100, 900 60 L 1000 40" fill="none" stroke="#166534" strokeLinecap="round" strokeWidth="4"></path>
<defs>
<linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#166534"></stop>
<stop offset="100%" stopColor="#166534" stopOpacity="0"></stop>
</linearGradient>
</defs>
<circle cx="300" cy="180" fill="#166534" r="6"></circle>
<circle cx="600" cy="80" fill="#166534" r="6"></circle>
</svg>
<div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase">
<span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
</div>
</div>
</div>
<div className="chart-container">
<div className="mb-10">
<h3 className="text-lg font-bold">Revenue Breakdown</h3>
<p className="text-xs text-slate-400">By Service Category</p>
</div>
<div className="relative flex justify-center">
<svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
<circle className="text-slate-100 dark:text-slate-800" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#166534" stroke-dasharray="138 251.2" stroke-dashoffset="0" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#F97316" stroke-dasharray="63 251.2" stroke-dashoffset="-138" strokeWidth="12"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#4ade80" stroke-dasharray="50.2 251.2" stroke-dashoffset="-201" strokeWidth="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
<span className="text-2xl font-black">$482k</span>
<span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
</div>
</div>
<div className="mt-10 space-y-3">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-primary"></span>
<span className="text-sm font-semibold">Rooms</span>
</div>
<span className="text-sm font-bold">55%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-accent"></span>
<span className="text-sm font-semibold">F&amp;B</span>
</div>
<span className="text-sm font-bold">25%</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="w-3 h-3 rounded-full bg-green-400"></span>
<span className="text-sm font-semibold">Conference</span>
</div>
<span className="text-sm font-bold">20%</span>
</div>
</div>
</div>
</div>
<section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
<div>
<h3 className="text-lg font-bold">Customer History &amp; Recent Yield</h3>
<p className="text-xs text-slate-400 mt-1">Granular reporting of individual stays and consumption patterns.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative group">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
<input className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-primary/20" placeholder="Search guests..." type="text"/>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50/50 dark:bg-slate-800/20">
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction Date</th>
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Identity</th>
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue Source</th>
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Yield Amount</th>
<th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-8 py-5 text-sm font-medium text-slate-500">Oct 12, 2023</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">JS</div>
<div>
<p className="text-sm font-bold">Jonathan Smith</p>
<p className="text-[10px] text-slate-400 font-bold uppercase">United Kingdom</p>
</div>
</div>
</td>
<td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">Deluxe Suite</td>
<td className="px-8 py-5">
<span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-extrabold uppercase tracking-wide">Hotel Room</span>
</td>
<td className="px-8 py-5 text-sm font-black text-right">$1,250.00</td>
<td className="px-8 py-5 text-center">
<span className="material-symbols-outlined text-primary">check_circle</span>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-8 py-5 text-sm font-medium text-slate-500">Oct 14, 2023</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">MG</div>
<div>
<p className="text-sm font-bold">Maria Garcia</p>
<p className="text-[10px] text-slate-400 font-bold uppercase">Spain</p>
</div>
</div>
</td>
<td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">Executive King</td>
<td className="px-8 py-5">
<span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-extrabold uppercase tracking-wide">Food &amp; Bev</span>
</td>
<td className="px-8 py-5 text-sm font-black text-right">$320.00</td>
<td className="px-8 py-5 text-center">
<span className="material-symbols-outlined text-primary">check_circle</span>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
<td className="px-8 py-5 text-sm font-medium text-slate-500">Oct 15, 2023</td>
<td className="px-8 py-5">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-bold">YT</div>
<div>
<p className="text-sm font-bold">Yuki Tanaka</p>
<p className="text-[10px] text-slate-400 font-bold uppercase">Japan</p>
</div>
</div>
</td>
<td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">Standard Twin</td>
<td className="px-8 py-5">
<span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px] font-extrabold uppercase tracking-wide">Services</span>
</td>
<td className="px-8 py-5 text-sm font-black text-right">$150.00</td>
<td className="px-8 py-5 text-center">
<span className="material-symbols-outlined text-primary">check_circle</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/30 flex items-center justify-between">
<p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Page 1 of 42 • Showing 50 records</p>
<div className="flex gap-2">
<button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold">1</button>
<button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold hover:bg-slate-50 transition-colors">2</button>
<button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</section>
</div>
</main>
<footer className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 z-50 flex justify-around">
<a className="flex flex-col items-center text-primary" href="#">
<span className="material-symbols-outlined">insights</span>
<span className="text-[10px] font-bold mt-1 uppercase">Insights</span>
</a>
<a className="flex flex-col items-center text-slate-400" href="#">
<span className="material-symbols-outlined">calendar_month</span>
<span className="text-[10px] font-bold mt-1 uppercase">Bookings</span>
</a>
<a className="flex flex-col items-center text-slate-400" href="#">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-[10px] font-bold mt-1 uppercase">Admin</span>
</a>
</footer>

    </div>
  );
}
