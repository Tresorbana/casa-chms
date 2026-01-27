'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard2() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="ml-64 min-h-screen p-8">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/dashboard/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/dashboard/view-3">View 3</a></div><header className="flex justify-between items-center mb-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Receptionist Command Center</h2>
<p className="text-slate-500 mt-1">Live overview for today, October 24th.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-72" placeholder="Search guests, rooms, or confirmation..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</div>
</header>
<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<button className="flex items-center justify-between p-6 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform group">
<div className="text-left">
<p className="text-sm font-medium opacity-90">Guest Arrival</p>
<h3 className="text-2xl font-bold">Check-in</h3>
</div>
<span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">login</span>
</button>
<button className="flex items-center justify-between p-6 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl shadow-lg hover:scale-[1.02] transition-transform group">
<div className="text-left">
<p className="text-sm font-medium opacity-80">Guest Departure</p>
<h3 className="text-2xl font-bold">Check-out</h3>
</div>
<span className="material-symbols-outlined text-4xl group-hover:-rotate-12 transition-transform">logout</span>
</button>
<button className="flex items-center justify-between p-6 bg-secondary text-white rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform group">
<div className="text-left">
<p className="text-sm font-medium opacity-90">Walk-in or Call</p>
<h3 className="text-2xl font-bold">New Booking</h3>
</div>
<span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">add_circle</span>
</button>
</section>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
<div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
<span className="material-symbols-outlined">cleaning_services</span>
</div>
<div>
<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Rooms to Clean</p>
<p className="text-2xl font-bold">12</p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="p-3 bg-secondary/10 text-secondary rounded-xl">
<span className="material-symbols-outlined">flight_land</span>
</div>
<div>
<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Expected Arrivals</p>
<p className="text-2xl font-bold">18</p>
</div>
</div>
<div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
<div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
<span className="material-symbols-outlined">schedule</span>
</div>
<div>
<p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Late Check-outs</p>
<p className="text-2xl font-bold">4</p>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
<h3 className="text-lg font-bold">Arrivals &amp; Departures</h3>
<div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
<button className="px-4 py-1.5 bg-white dark:bg-slate-700 rounded-md shadow-sm text-sm font-medium">Today</button>
<button className="px-4 py-1.5 text-slate-500 text-sm font-medium">Tomorrow</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
<tr>
<th className="px-6 py-4">Guest</th>
<th className="px-6 py-4">Status</th>
<th className="px-6 py-4">Room</th>
<th className="px-6 py-4">Time</th>
<th className="px-6 py-4">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="font-semibold text-sm">Marcus Aurelius</div>
<div className="text-xs text-slate-400">#RES-4492</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">Arrival</span>
</td>
<td className="px-6 py-4 text-sm">Deluxe 204</td>
<td className="px-6 py-4 text-sm text-slate-500">14:30</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-xs font-bold uppercase tracking-tight">Check-in</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="font-semibold text-sm">Elena Gilbert</div>
<div className="text-xs text-slate-400">#RES-4510</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Departure</span>
</td>
<td className="px-6 py-4 text-sm">Suite 102</td>
<td className="px-6 py-4 text-sm text-slate-500">11:00</td>
<td className="px-6 py-4">
<button className="text-slate-800 dark:text-white hover:underline text-xs font-bold uppercase tracking-tight">Checkout</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="font-semibold text-sm">Robert Baratheon</div>
<div className="text-xs text-slate-400">#RES-4521</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold rounded uppercase">Arrival</span>
</td>
<td className="px-6 py-4 text-sm">King 305</td>
<td className="px-6 py-4 text-sm text-slate-500">16:00</td>
<td className="px-6 py-4">
<button className="text-primary hover:underline text-xs font-bold uppercase tracking-tight">Check-in</button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
<td className="px-6 py-4">
<div className="font-semibold text-sm">Sansa Stark</div>
<div className="text-xs text-slate-400">#RES-4533</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Late Checkout</span>
</td>
<td className="px-6 py-4 text-sm">Standard 411</td>
<td className="px-6 py-4 text-sm text-slate-500">12:30</td>
<td className="px-6 py-4">
<button className="text-slate-800 dark:text-white hover:underline text-xs font-bold uppercase tracking-tight">Checkout</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center">
<button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">View Full Schedule</button>
</div>
</section>
<section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
<div className="flex justify-between items-center mb-6">
<h3 className="text-lg font-bold">Room Grid</h3>
<span className="text-xs font-medium text-slate-400">Floor 1</span>
</div>
<div className="grid grid-cols-4 gap-3">
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer hover:bg-secondary/20 transition-all">
<span className="text-xs font-bold">101</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary cursor-pointer hover:bg-primary/20 transition-all">
<span className="text-xs font-bold">102</span>
<span className="text-[8px] uppercase font-black">OCCUP</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 cursor-pointer hover:bg-blue-500/20 transition-all">
<span className="text-xs font-bold">103</span>
<span className="text-[8px] uppercase font-black">CLEAN</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary cursor-pointer">
<span className="text-xs font-bold">104</span>
<span className="text-[8px] uppercase font-black">OCCUP</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-pointer">
<span className="text-xs font-bold">105</span>
<span className="text-[8px] uppercase font-black">O.O.O</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer">
<span className="text-xs font-bold">106</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer">
<span className="text-xs font-bold">107</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer">
<span className="text-xs font-bold">108</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary cursor-pointer">
<span className="text-xs font-bold">109</span>
<span className="text-[8px] uppercase font-black">OCCUP</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 cursor-pointer">
<span className="text-xs font-bold">110</span>
<span className="text-[8px] uppercase font-black">CLEAN</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer">
<span className="text-xs font-bold">111</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
<div className="h-14 flex flex-col items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 text-secondary cursor-pointer">
<span className="text-xs font-bold">112</span>
<span className="text-[8px] uppercase font-black">AVAIL</span>
</div>
</div>
<div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
<div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Avail
                </div>
<div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
<span className="w-2 h-2 rounded-full bg-primary"></span> Occup
                </div>
<div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
<span className="w-2 h-2 rounded-full bg-blue-500"></span> Clean
                </div>
<div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
<span className="w-2 h-2 rounded-full bg-slate-300"></span> OOO
                </div>
</div>
<button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest">
                Full Floor Map
            </button>
</section>
</div>
<footer className="mt-auto pt-12 flex justify-between items-center text-slate-400 text-xs">
<p>© 2024 Casa Hotel Management System. Reception Terminal 04.</p>
<div className="flex gap-6 font-medium">
<a className="hover:text-primary transition-colors" href="#">Quick Guide</a>
<a className="hover:text-primary transition-colors" href="#">IT Helpdesk</a>
</div>
</footer>
</main>

    </div>
  );
}
