'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Reports2() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="lg:ml-64 p-4 lg:p-8 ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/reports/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-4">View 4</a></div><header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
<div>
<h2 className="text-2xl font-bold dark:text-white">Advanced Reports with Multi-Filters</h2>
<p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Casa Hotel Business Intelligence &amp; Data Analytics</p>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-symbols-outlined dark:hidden">dark_mode</span>
<span className="material-symbols-outlined hidden dark:block text-primary">light_mode</span>
</button>
<div className="flex items-center gap-2">
<button className="bg-primary hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-xl">picture_as_pdf</span>
<span>Export to PDF</span>
</button>
<button className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-xl">file_download</span>
<span>Export to CSV</span>
</button>
</div>
</div>
</header>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary">filter_alt</span>
<h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Global Filters</h3>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
<div className="space-y-1">
<label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nationality</label>
<select className="w-full py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Nationalities</option>
<option>United Kingdom</option>
<option>USA</option>
<option>Germany</option>
<option>China</option>
<option>Local (Domestic)</option>
</select>
</div>
<div className="space-y-1">
<label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Room Type</label>
<select className="w-full py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Room Types</option>
<option>Standard Twin</option>
<option>Executive King</option>
<option>Deluxe Suite</option>
<option>Penthouse</option>
</select>
</div>
<div className="space-y-1">
<label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Revenue Source</label>
<select className="w-full py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Sources</option>
<option>Hotel (Rooms)</option>
<option>F&amp;B (Restaurant)</option>
<option>Services (Spa/Gym)</option>
<option>Conference (Events)</option>
</select>
</div>
<div className="space-y-1">
<label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">User/Staff</label>
<select className="w-full py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Personnel</option>
<option>Admin User</option>
<option>Front Desk 1</option>
<option>Restaurant Manager</option>
<option>Events Team</option>
</select>
</div>
<div className="space-y-1">
<label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date Range</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">calendar_today</span>
<input className="w-full pl-9 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary" type="text" value="Jan 01 - Dec 31, 2023"/>
</div>
</div>
<div className="flex items-end">
<button className="w-full py-2.5 bg-primary hover:bg-orange-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-lg">sync</span>
                    Apply
                </button>
</div>
</div>
</section>
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="font-bold text-lg">Occupancy Trends</h3>
<p className="text-xs text-slate-400">Monthly percentage by Room Type</p>
</div>
<div className="flex gap-4">
<span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Deluxe
                    </span>
<span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Standard
                    </span>
</div>
</div>
<div className="h-64 flex items-end justify-between gap-4 px-2 relative">
<div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
<div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
</div>
<div className="relative w-full h-full flex items-end justify-around">
<div className="flex flex-col items-center w-8">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm" style={{ height: "60%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm" style={{ height: "45%" }}></div>
</div>
<span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Jan</span>
</div>
<div className="flex flex-col items-center w-8">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm" style={{ height: "75%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm" style={{ height: "55%" }}></div>
</div>
<span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Feb</span>
</div>
<div className="flex flex-col items-center w-8">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm" style={{ height: "90%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm" style={{ height: "70%" }}></div>
</div>
<span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Mar</span>
</div>
<div className="flex flex-col items-center w-8">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm" style={{ height: "85%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm" style={{ height: "80%" }}></div>
</div>
<span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Apr</span>
</div>
<div className="flex flex-col items-center w-8">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm" style={{ height: "65%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm" style={{ height: "40%" }}></div>
</div>
<span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">May</span>
</div>
</div>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-8">
<div>
<h3 className="font-bold text-lg">Revenue Breakdown</h3>
<p className="text-xs text-slate-400">Category-wise contribution</p>
</div>
<span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 material-symbols-outlined">pie_chart</span>
</div>
<div className="flex flex-col sm:flex-row items-center justify-around gap-8 h-64">
<div className="relative w-44 h-44">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="50, 100" strokeWidth="4"></path>
<path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="20, 100" stroke-dashoffset="-50" strokeWidth="4"></path>
<path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="15, 100" stroke-dashoffset="-70" strokeWidth="4"></path>
<path className="text-purple-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="15, 100" stroke-dashoffset="-85" strokeWidth="4"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-[10px] text-slate-400 font-bold uppercase">Total Yield</span>
<span className="text-xl font-extrabold">$482k</span>
</div>
</div>
<div className="grid grid-cols-2 gap-x-6 gap-y-3">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Hotel</p>
<p className="font-bold text-sm">50%</p>
</div>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">F&amp;B</p>
<p className="font-bold text-sm">20%</p>
</div>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-blue-500"></div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Services</p>
<p className="font-bold text-sm">15%</p>
</div>
</div>
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-purple-500"></div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase">Conf.</p>
<p className="font-bold text-sm">15%</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h3 className="font-bold text-lg">Customer History &amp; Transaction Detail</h3>
<p className="text-xs text-slate-400">Individual booking records filtered by global criteria</p>
</div>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
<input className="pl-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary w-full md:w-72" placeholder="Search by name or ID..." type="text"/>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50">
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nationality</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Staff</th>
<th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">Oct 12, 2023</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-primary">JS</div>
<span className="text-sm font-bold">Jonathan Smith</span>
</div>
</td>
<td className="px-6 py-4 text-sm">United Kingdom</td>
<td className="px-6 py-4 text-sm">Deluxe Suite</td>
<td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase">Hotel</span></td>
<td className="px-6 py-4 text-sm">Admin User</td>
<td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">$1,250.00</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">Oct 14, 2023</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-secondary">MG</div>
<span className="text-sm font-bold">Maria Garcia</span>
</div>
</td>
<td className="px-6 py-4 text-sm">Spain</td>
<td className="px-6 py-4 text-sm">Executive King</td>
<td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">F&amp;B</span></td>
<td className="px-6 py-4 text-sm">Front Desk 1</td>
<td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">$320.00</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">Oct 15, 2023</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-500">YT</div>
<span className="text-sm font-bold">Yuki Tanaka</span>
</div>
</td>
<td className="px-6 py-4 text-sm">Japan</td>
<td className="px-6 py-4 text-sm">Standard Twin</td>
<td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase">Services</span></td>
<td className="px-6 py-4 text-sm">Admin User</td>
<td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">$150.00</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">Oct 16, 2023</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-purple-500">CM</div>
<span className="text-sm font-bold">Carlos Mendez</span>
</div>
</td>
<td className="px-6 py-4 text-sm">Mexico</td>
<td className="px-6 py-4 text-sm">Conference Room</td>
<td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase">Conference</span></td>
<td className="px-6 py-4 text-sm">Events Team</td>
<td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">$2,400.00</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
<p className="text-xs text-slate-500 font-medium">Showing entries based on global filters applied.</p>
<div className="flex gap-1">
<button className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled={true}>
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="px-3 py-1 rounded bg-primary text-white text-xs font-bold">1</button>
<button className="px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50">2</button>
<button className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</section>
</main>
<footer className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-30">
<div className="flex justify-around">
<a className="flex flex-col items-center p-2 text-primary" href="#">
<span className="material-symbols-outlined">analytics</span>
<span className="text-[10px] font-bold uppercase">Reports</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-symbols-outlined">calendar_today</span>
<span className="text-[10px] font-bold uppercase">Booking</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-symbols-outlined">restaurant</span>
<span className="text-[10px] font-bold uppercase">Dine</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-[10px] font-bold uppercase">Profile</span>
</a>
</div>
</footer>

    </div>
  );
}
