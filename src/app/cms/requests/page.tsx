'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function CmsRequests() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<div className="flex h-screen overflow-hidden">
<main className="flex-1 flex flex-col overflow-hidden ml-64 min-h-screen">
<header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
<div className="relative w-96">
<span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
<input className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search by guest name or email..." type="text"/>
</div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-icons-round">dark_mode</span>
</button>
<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
<button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary/90 transition-colors">
<span className="material-icons-round text-base">add</span>
                        New Reservation
                    </button>
</div>
</header>
<div className="flex-1 overflow-y-auto p-8 space-y-8">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h2 className="text-2xl font-display font-bold">Website Booking Requests</h2>
<p className="text-slate-500 dark:text-slate-400">Manage incoming inquiries from the hotel's official website.</p>
</div>
<div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
<button className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-lg shadow-sm">All Requests</button>
<button className="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Follow-up</button>
<button className="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Archived</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Requests</p>
<div className="flex items-end justify-between">
<h3 className="text-2xl font-bold font-display">124</h3>
<span className="text-secondary text-xs font-medium flex items-center bg-secondary/10 px-2 py-0.5 rounded-md">
<span className="material-icons-round text-sm mr-1">trending_up</span> +12%
                            </span>
</div>
</div>
<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 border-l-4 border-l-yellow-400">
<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Action</p>
<div className="flex items-end justify-between">
<h3 className="text-2xl font-bold font-display">12</h3>
<span className="text-yellow-600 text-[10px] font-bold px-2 py-0.5 bg-yellow-100 rounded-full uppercase">Immediate</span>
</div>
</div>
<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-400">
<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contacted</p>
<div className="flex items-end justify-between">
<h3 className="text-2xl font-bold font-display">48</h3>
<span className="text-slate-400 text-xs">Waiting Reply</span>
</div>
</div>
<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 border-l-4 border-l-secondary">
<p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmed</p>
<div className="flex items-end justify-between">
<h3 className="text-2xl font-bold font-display">64</h3>
<span className="text-secondary text-xs">This Month</span>
</div>
</div>
</div>
<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Name</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Dates</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Room Type</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
<th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => { openDetails('Elena Rodriguez') }}>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center font-bold text-xs">ER</div>
<div>
<p className="font-semibold text-sm">Elena Rodriguez</p>
<p className="text-xs text-slate-500">elena.rod@example.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-sm">
<span className="material-icons-round text-slate-400 text-base">calendar_today</span>
<span>Oct 24 - Oct 28</span>
<span className="text-xs text-slate-400">(4 nights)</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">Deluxe Suite</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">2 hours ago</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
<span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                                            Pending
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors">Review</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => { openDetails('Marcus Chen') }}>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-bold text-xs">MC</div>
<div>
<p className="font-semibold text-sm">Marcus Chen</p>
<p className="text-xs text-slate-500">chen.marcus@globex.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-sm">
<span className="material-icons-round text-slate-400 text-base">calendar_today</span>
<span>Nov 02 - Nov 05</span>
<span className="text-xs text-slate-400">(3 nights)</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">Standard King</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">5 hours ago</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
<span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                            Contacted
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors">Review</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => { openDetails('Sarah Jenkins') }}>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center font-bold text-xs">SJ</div>
<div>
<p className="font-semibold text-sm">Sarah Jenkins</p>
<p className="text-xs text-slate-500">s.jenkins@webmail.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-sm">
<span className="material-icons-round text-slate-400 text-base">calendar_today</span>
<span>Oct 28 - Nov 01</span>
<span className="text-xs text-slate-400">(4 nights)</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">Ocean View Room</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">1 day ago</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
<span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                            Confirmed
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors">Review</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group" onClick={() => { openDetails('Liam Wilson') }}>
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center font-bold text-xs">LW</div>
<div>
<p className="font-semibold text-sm">Liam Wilson</p>
<p className="text-xs text-slate-500">liam.w@outlook.com</p>
</div>
</div>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2 text-sm">
<span className="material-icons-round text-slate-400 text-base">calendar_today</span>
<span>Dec 15 - Dec 20</span>
<span className="text-xs text-slate-400">(5 nights)</span>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">Standard King</span>
</td>
<td className="px-6 py-4 text-sm text-slate-500">1 day ago</td>
<td className="px-6 py-4">
<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
<span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                                            Pending
                                        </span>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors">Review</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500">
<p>Showing 1 to 4 of 124 requests</p>
<div className="flex gap-2">
<button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled={true}>
<span className="material-icons-round text-base">chevron_left</span>
</button>
<button className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
<span className="material-icons-round text-base">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
</div>
<div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 hidden" id="side-panel-backdrop" onClick={() => { closeDetails() }}></div>
<div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl z-50 translate-x-full transition-transform duration-300 ease-in-out" id="side-panel">
<div className="h-full flex flex-col">
<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
<h3 className="text-xl font-display font-bold">Request Details</h3>
<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600" onClick={() => { closeDetails() }}>
<span className="material-icons-round">close</span>
</button>
</div>
<div className="flex-1 overflow-y-auto p-6 space-y-8">
<div className="flex items-start gap-4">
<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
<span className="material-icons-round text-3xl">person</span>
</div>
<div>
<h4 className="text-2xl font-display font-bold" id="detail-name">Elena Rodriguez</h4>
<div className="flex flex-col gap-1 mt-1">
<span className="flex items-center gap-2 text-sm text-slate-500">
<span className="material-icons-round text-base">email</span>
                                elena.rod@example.com
                            </span>
<span className="flex items-center gap-2 text-sm text-slate-500">
<span className="material-icons-round text-base">phone</span>
                                +34 612 345 678
                            </span>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-in</p>
<p className="font-semibold">Thursday, Oct 24, 2024</p>
</div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-out</p>
<p className="font-semibold">Monday, Oct 28, 2024</p>
</div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room Preference</p>
<p className="font-semibold">Deluxe Suite</p>
</div>
<div>
<p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Guests</p>
<p className="font-semibold">2 Adults, 1 Child</p>
</div>
</div>
<div className="space-y-3">
<h5 className="font-bold text-sm uppercase tracking-wide text-slate-400">Additional Inquiry</h5>
<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl italic text-slate-600 dark:text-slate-300">
                        "Hello, we are celebrating our anniversary and would appreciate it if we could get a room on a higher floor with a better view. Also, do you provide airport pickup?"
                    </div>
</div>
<div className="space-y-4">
<h5 className="font-bold text-sm uppercase tracking-wide text-slate-400">Administrative Actions</h5>
<div className="flex gap-2">
<button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
<span className="material-icons-round text-blue-500">reply</span>
<span className="font-semibold">Reply to Email</span>
</button>
<button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
<span className="material-icons-round text-slate-400">archive</span>
</button>
</div>
</div>
</div>
<div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
<button className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 hover:bg-secondary/90 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
<span className="material-icons-round">how_to_reg</span>
                    Confirm &amp; Register
                </button>
<p className="text-center text-xs text-slate-500 mt-4">Confirming will automatically create a booking record and send a notification to the guest.</p>
</div>
</div>
</div>


    </div>
  );
}
