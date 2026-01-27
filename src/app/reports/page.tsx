'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Reports1() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="lg:ml-64 p-4 lg:p-8 ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/reports">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/reports/view-4">View 4</a></div><header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
<div>
<h2 className="text-2xl font-bold dark:text-white">Business Intelligence Reports</h2>
<p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time occupancy and revenue analytics for Casa Hotel.</p>
</div>
<div className="flex items-center gap-3">
<button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-icons-outlined block dark:hidden">dark_mode</span>
<span className="material-icons-outlined hidden dark:block text-primary">light_mode</span>
</button>
<button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
<span className="material-icons-outlined text-sm">download</span>
                    Export Data
                </button>
</div>
</header>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-8 shadow-sm">
<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
<div className="space-y-1">
<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date Range</label>
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400 text-sm">calendar_month</span>
<input className="w-full pl-9 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary" type="text" value="Oct 01, 2023 - Oct 31, 2023"/>
</div>
</div>
<div className="space-y-1">
<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nationality</label>
<select className="w-full py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Nationalities</option>
<option>Local (Domestic)</option>
<option>International</option>
</select>
</div>
<div className="space-y-1">
<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Room Type</label>
<select className="w-full py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Types</option>
<option>Deluxe Suite</option>
<option>Executive King</option>
<option>Standard Twin</option>
</select>
</div>
<div className="space-y-1">
<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue Source</label>
<select className="w-full py-2 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary">
<option>All Sources</option>
<option>Room Booking</option>
<option>Restaurant</option>
<option>Spa &amp; Services</option>
</select>
</div>
<div className="flex items-end">
<button className="w-full py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                        Apply Filters
                    </button>
</div>
</div>
</section>
<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Revenue</span>
<span className="p-2 bg-primary/10 rounded-lg text-primary material-icons-outlined">payments</span>
</div>
<div className="text-2xl font-bold">$124,500</div>
<div className="flex items-center mt-2 text-secondary text-xs font-semibold">
<span className="material-icons-outlined text-xs">trending_up</span>
<span className="ml-1">+12% from last month</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Avg Occupancy</span>
<span className="p-2 bg-secondary/10 rounded-lg text-secondary material-icons-outlined">bed</span>
</div>
<div className="text-2xl font-bold">78.4%</div>
<div className="flex items-center mt-2 text-secondary text-xs font-semibold">
<span className="material-icons-outlined text-xs">trending_up</span>
<span className="ml-1">+5.2% from last month</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Total Bookings</span>
<span className="p-2 bg-blue-500/10 rounded-lg text-blue-500 material-icons-outlined">book_online</span>
</div>
<div className="text-2xl font-bold">1,240</div>
<div className="flex items-center mt-2 text-red-500 text-xs font-semibold">
<span className="material-icons-outlined text-xs">trending_down</span>
<span className="ml-1">-2.1% from last month</span>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-2">
<span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Restaurant Sales</span>
<span className="p-2 bg-orange-500/10 rounded-lg text-orange-500 material-icons-outlined">restaurant</span>
</div>
<div className="text-2xl font-bold">$32,840</div>
<div className="flex items-center mt-2 text-secondary text-xs font-semibold">
<span className="material-icons-outlined text-xs">trending_up</span>
<span className="ml-1">+8.4% from last month</span>
</div>
</div>
</section>
<section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-8">
<h3 className="font-bold text-lg">Occupancy Trends</h3>
<div className="flex gap-2">
<span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
<span className="w-2 h-2 rounded-full bg-primary"></span> Deluxe
                        </span>
<span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Standard
                        </span>
</div>
</div>
<div className="h-64 flex items-end justify-between gap-2 px-2 relative">
<div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
<div className="border-t border-slate-100 dark:border-slate-800 w-full h-0"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full h-0"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full h-0"></div>
<div className="border-t border-slate-100 dark:border-slate-800 w-full h-0"></div>
</div>
<div className="relative w-full h-full flex items-end justify-between">
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "80%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "60%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Mon</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "40%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "30%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Tue</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "90%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "75%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Wed</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "65%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "85%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Thu</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "75%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "55%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Fri</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "100%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "90%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Sat</span>
</div>
<div className="flex flex-col items-center gap-1 w-full">
<div className="flex gap-1 items-end h-48">
<div className="w-3 bg-primary rounded-t-sm chart-bar" style={{ height: "95%" }}></div>
<div className="w-3 bg-secondary rounded-t-sm chart-bar" style={{ height: "80%" }}></div>
</div>
<span className="text-[10px] text-slate-400 mt-2">Sun</span>
</div>
</div>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
<div className="flex items-center justify-between mb-8">
<h3 className="font-bold text-lg">Revenue Breakdown</h3>
<button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
<span className="material-icons-outlined">more_vert</span>
</button>
</div>
<div className="flex items-center justify-around h-64">
<div className="relative w-48 h-48">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
<path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4"></path>
<path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="60, 100" strokeWidth="4"></path>
<path className="text-secondary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="25, 100" stroke-dashoffset="-60" strokeWidth="4"></path>
<path className="text-slate-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="15, 100" stroke-dashoffset="-85" strokeWidth="4"></path>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-xs text-slate-400 font-medium uppercase">Total</span>
<span className="text-2xl font-bold">$124k</span>
</div>
</div>
<div className="space-y-4">
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-primary"></div>
<div>
<p className="text-xs font-semibold text-slate-400 uppercase">Room Revenue</p>
<p className="font-bold text-sm">60% ($74.7k)</p>
</div>
</div>
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-secondary"></div>
<div>
<p className="text-xs font-semibold text-slate-400 uppercase">Restaurant</p>
<p className="font-bold text-sm">25% ($31.1k)</p>
</div>
</div>
<div className="flex items-center gap-3">
<div className="w-3 h-3 rounded-full bg-slate-400"></div>
<div>
<p className="text-xs font-semibold text-slate-400 uppercase">Other Services</p>
<p className="font-bold text-sm">15% ($18.6k)</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
<h3 className="font-bold text-lg">Detailed Records</h3>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
<input className="pl-10 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary w-full md:w-64" placeholder="Search bookings..." type="text"/>
</div>
<div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
<button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 flex items-center gap-1">
<span className="material-icons-outlined text-sm">description</span> CSV
                        </button>
<button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1">
<span className="material-icons-outlined text-sm">picture_as_pdf</span> PDF
                        </button>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50">
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Booking ID</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Guest Name</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nationality</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Room Type</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stay Dates</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue</th>
<th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">#BK-8902</td>
<td className="px-6 py-4 text-sm font-semibold">Jonathan Smith</td>
<td className="px-6 py-4 text-sm">United Kingdom</td>
<td className="px-6 py-4 text-sm">Deluxe Suite</td>
<td className="px-6 py-4 text-sm">Oct 12 - Oct 15</td>
<td className="px-6 py-4 text-sm font-bold">$1,250.00</td>
<td className="px-6 py-4 text-sm">
<span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase">Completed</span>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">#BK-8903</td>
<td className="px-6 py-4 text-sm font-semibold">Maria Garcia</td>
<td className="px-6 py-4 text-sm">Spain</td>
<td className="px-6 py-4 text-sm">Executive King</td>
<td className="px-6 py-4 text-sm">Oct 14 - Oct 16</td>
<td className="px-6 py-4 text-sm font-bold">$980.00</td>
<td className="px-6 py-4 text-sm">
<span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">In-House</span>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">#BK-8904</td>
<td className="px-6 py-4 text-sm font-semibold">Yuki Tanaka</td>
<td className="px-6 py-4 text-sm">Japan</td>
<td className="px-6 py-4 text-sm">Standard Twin</td>
<td className="px-6 py-4 text-sm">Oct 15 - Oct 18</td>
<td className="px-6 py-4 text-sm font-bold">$720.00</td>
<td className="px-6 py-4 text-sm">
<span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase dark:bg-blue-900/40">Confirmed</span>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4 text-sm font-medium">#BK-8905</td>
<td className="px-6 py-4 text-sm font-semibold">Carlos Mendez</td>
<td className="px-6 py-4 text-sm">Mexico</td>
<td className="px-6 py-4 text-sm">Deluxe Suite</td>
<td className="px-6 py-4 text-sm">Oct 16 - Oct 20</td>
<td className="px-6 py-4 text-sm font-bold">$1,850.00</td>
<td className="px-6 py-4 text-sm">
<span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold uppercase dark:bg-blue-900/40">Confirmed</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
<p className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 48 entries</p>
<div className="flex gap-1">
<button className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled={true}>
<span className="material-icons-outlined text-sm">chevron_left</span>
</button>
<button className="px-3 py-1 rounded bg-primary text-white text-xs font-bold">1</button>
<button className="px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50">2</button>
<button className="px-3 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50">3</button>
<button className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50">
<span className="material-icons-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</section>
</main>
<footer className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-30">
<div className="flex justify-around">
<a className="flex flex-col items-center p-2 text-primary" href="#">
<span className="material-icons-outlined">analytics</span>
<span className="text-[10px] font-bold">Reports</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-icons-outlined">calendar_today</span>
<span className="text-[10px] font-bold">Booking</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-icons-outlined">restaurant</span>
<span className="text-[10px] font-bold">Dine</span>
</a>
<a className="flex flex-col items-center p-2 text-slate-400" href="#">
<span className="material-icons-outlined">account_circle</span>
<span className="text-[10px] font-bold">Profile</span>
</a>
</div>
</footer>

    </div>
  );
}
