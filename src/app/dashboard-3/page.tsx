'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard3() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="ml-72 min-h-screen p-10 ml-64">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/dashboard/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/dashboard/view-3">View 3</a></div><header className="flex justify-between items-center mb-10">
<div>
<h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Receptionist Dashboard</h2>
<div className="flex items-center gap-2 mt-1 text-slate-500">
<span className="material-symbols-outlined text-base">calendar_month</span>
<span className="text-sm">Monday, October 24th, 2024</span>
<span className="mx-2 text-slate-300">|</span>
<span className="text-sm font-medium text-forest-green">Front Desk Terminal A</span>
</div>
</div>
<div className="flex items-center gap-4">
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-casa-orange transition-colors">search</span>
<input className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-casa-orange/20 focus:border-casa-orange text-sm w-80 shadow-soft outline-none transition-all" placeholder="Search guests, room or ID..." type="text"/>
</div>
<button className="p-3 bg-white text-slate-500 hover:text-casa-orange border border-slate-200 rounded-2xl shadow-soft relative transition-colors">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-3 right-3 w-2 h-2 bg-casa-orange rounded-full border-2 border-white"></span>
</button>
</div>
</header>
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
<button className="btn-primary">
<span className="material-symbols-outlined">how_to_reg</span>
                Check-in Guest
            </button>
<button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-all shadow-sm">
<span className="material-symbols-outlined">logout</span>
                Check-out
            </button>
<button className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all shadow-soft">
<span className="material-symbols-outlined text-casa-orange">add_circle</span>
                New Booking
            </button>
</section>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
<div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between">
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Expected Arrivals</p>
<p className="text-4xl font-extrabold text-slate-900 tracking-tight">18</p>
</div>
<div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-3xl">flight_land</span>
</div>
</div>
<div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between">
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Late Check-outs</p>
<p className="text-4xl font-extrabold text-slate-900 tracking-tight">04</p>
</div>
<div className="w-14 h-14 bg-orange-50 text-casa-orange rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-3xl">history</span>
</div>
</div>
<div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center justify-between">
<div>
<p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Rooms to Clean</p>
<p className="text-4xl font-extrabold text-slate-900 tracking-tight">12</p>
</div>
<div className="w-14 h-14 bg-green-50 text-emerald-500 rounded-2xl flex items-center justify-center">
<span className="material-symbols-outlined text-3xl">cleaning_services</span>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
<section className="lg:col-span-8 bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
<div className="p-8 border-b border-slate-50 flex justify-between items-center">
<h3 className="text-xl font-bold text-slate-900">Arrivals &amp; Departures</h3>
<div className="flex bg-slate-100 p-1.5 rounded-xl">
<button className="px-5 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-slate-900">Today</button>
<button className="px-5 py-2 text-slate-500 text-sm font-medium hover:text-slate-900">Tomorrow</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-slate-50/50 text-[11px] uppercase font-bold text-slate-400 tracking-widest">
<tr>
<th className="px-8 py-5">Guest Information</th>
<th className="px-8 py-5">Event</th>
<th className="px-8 py-5">Room</th>
<th className="px-8 py-5">Schedule</th>
<th className="px-8 py-5 text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-50">
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-5">
<div className="font-bold text-slate-900">Marcus Aurelius</div>
<div className="text-xs text-slate-400">Res ID: #RES-4492</div>
</td>
<td className="px-8 py-5">
<span className="status-pill bg-status-available text-status-available-text">Arrival</span>
</td>
<td className="px-8 py-5">
<span className="text-sm font-semibold text-slate-700">Deluxe 204</span>
</td>
<td className="px-8 py-5 text-sm text-slate-600 font-medium">14:30</td>
<td className="px-8 py-5 text-right">
<button className="text-casa-orange hover:text-casa-orange-hover text-xs font-extrabold uppercase tracking-tight">Check-in</button>
</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-5">
<div className="font-bold text-slate-900">Elena Gilbert</div>
<div className="text-xs text-slate-400">Res ID: #RES-4510</div>
</td>
<td className="px-8 py-5">
<span className="status-pill bg-slate-100 text-slate-500">Departure</span>
</td>
<td className="px-8 py-5">
<span className="text-sm font-semibold text-slate-700">Suite 102</span>
</td>
<td className="px-8 py-5 text-sm text-slate-600 font-medium">11:00</td>
<td className="px-8 py-5 text-right">
<button className="text-slate-400 hover:text-slate-900 text-xs font-extrabold uppercase tracking-tight">Checkout</button>
</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-5">
<div className="font-bold text-slate-900">Robert Baratheon</div>
<div className="text-xs text-slate-400">Res ID: #RES-4521</div>
</td>
<td className="px-8 py-5">
<span className="status-pill bg-status-available text-status-available-text">Arrival</span>
</td>
<td className="px-8 py-5">
<span className="text-sm font-semibold text-slate-700">King 305</span>
</td>
<td className="px-8 py-5 text-sm text-slate-600 font-medium">16:00</td>
<td className="px-8 py-5 text-right">
<button className="text-casa-orange hover:text-casa-orange-hover text-xs font-extrabold uppercase tracking-tight">Check-in</button>
</td>
</tr>
<tr className="hover:bg-slate-50/50 transition-colors">
<td className="px-8 py-5">
<div className="font-bold text-slate-900">Sansa Stark</div>
<div className="text-xs text-slate-400">Res ID: #RES-4533</div>
</td>
<td className="px-8 py-5">
<span className="status-pill bg-status-occupied text-status-occupied-text">Late Checkout</span>
</td>
<td className="px-8 py-5">
<span className="text-sm font-semibold text-slate-700">Standard 411</span>
</td>
<td className="px-8 py-5 text-sm text-slate-600 font-medium">12:30</td>
<td className="px-8 py-5 text-right">
<button className="text-slate-900 hover:text-slate-600 text-xs font-extrabold uppercase tracking-tight underline underline-offset-4">Process</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-6 bg-slate-50/50 text-center">
<button className="text-xs font-extrabold text-slate-500 hover:text-forest-green transition-colors uppercase tracking-[0.2em]">View All Arrivals</button>
</div>
</section>
<section className="lg:col-span-4 space-y-8">
<div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
<div className="flex justify-between items-center mb-8">
<h3 className="text-lg font-bold text-slate-900">Room Status</h3>
<div className="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-tighter">
<span>Floor 1</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</div>
</div>
<div className="grid grid-cols-4 gap-3">
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer group">
<span className="text-sm font-extrabold text-status-available-text">101</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-occupied hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-occupied-text">102</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-occupied-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-cleaning hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-cleaning-text">103</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-cleaning-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-occupied hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-occupied-text">104</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-occupied-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-slate-100 hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-slate-500">105</span>
<span className="text-[8px] font-bold text-slate-400">O.O.O</span>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-available-text">106</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-available-text">107</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-available-text">108</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-occupied hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-occupied-text">109</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-occupied-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-cleaning hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-cleaning-text">110</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-cleaning-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-available-text">111</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
<div className="aspect-square flex flex-col items-center justify-center rounded-2xl bg-status-available hover:scale-105 transition-transform cursor-pointer">
<span className="text-sm font-extrabold text-status-available-text">112</span>
<div className="w-1.5 h-1.5 rounded-full bg-status-available-text mt-1"></div>
</div>
</div>
<div className="mt-8 pt-8 border-t border-slate-50 flex flex-wrap gap-4">
<div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span className="w-2.5 h-2.5 rounded-full bg-status-available"></span> Available
                        </div>
<div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span className="w-2.5 h-2.5 rounded-full bg-status-occupied"></span> Occupied
                        </div>
<div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
<span className="w-2.5 h-2.5 rounded-full bg-status-cleaning"></span> Cleaning
                        </div>
</div>
</div>
<div className="bg-forest-green p-8 rounded-3xl shadow-soft text-white relative overflow-hidden">
<div className="relative z-10">
<h4 className="text-sm font-bold opacity-80 mb-1">Reception Performance</h4>
<div className="text-3xl font-extrabold mb-4">98%</div>
<p className="text-xs text-slate-400 leading-relaxed">Check-in time average: 3m 45s. Keep it up, Sarah!</p>
</div>
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl">award_star</span>
</div>
</section>
</div>
<footer className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center text-slate-400 text-xs font-medium">
<p>© 2024 Casa Hotel Management System. Reception Terminal A-04.</p>
<div className="flex gap-8">
<a className="hover:text-forest-green transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-sm">help</span>
                    Help Center
                </a>
<a className="hover:text-forest-green transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-sm">support_agent</span>
                    IT Support
                </a>
</div>
</footer>
</main>

    </div>
  );
}
