'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function PosRestaurant3() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="flex-1 flex overflow-hidden ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/pos/restaurant/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-4">View 4</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Pos Restaurant 3</h2>
<p className="text-slate-500 mt-1">Manage your pos here.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-64 transition-all" placeholder="Search..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative transition-colors">
<span className="material-icons-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</div>
</header>
<section className="flex-1 flex flex-col p-6 overflow-hidden">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
<div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl flex flex-col gap-2">
<label className="text-xs font-bold text-primary uppercase tracking-wider">Resident Room Link</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">person_search</span>
<input className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-primary/20 rounded-xl focus:ring-primary focus:border-primary text-lg font-bold" placeholder="Room # or Guest Name" type="text" value="Room 402 - Mr. Smith"/>
</div>
</div>
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Search</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-secondary focus:border-secondary" placeholder="Search menu..." type="text"/>
</div>
</div>
</div>
<div className="flex gap-4 mb-6">
<button className="flex-1 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold flex flex-col items-center justify-center gap-1 transition-all">
<span className="material-symbols-outlined">restaurant_menu</span>
<span>APPETIZERS</span>
</button>
<button className="flex-1 py-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-bold flex flex-col items-center justify-center gap-1 hover:border-primary transition-all">
<span className="material-symbols-outlined">skillet</span>
<span>MAINS</span>
</button>
<button className="flex-1 py-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 font-bold flex flex-col items-center justify-center gap-1 hover:border-primary transition-all">
<span className="material-symbols-outlined">local_bar</span>
<span>DRINKS</span>
</button>
</div>
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 hover:border-primary hover:shadow-xl transition-all text-left">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-black bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter">APPETIZER</span>
<span className="text-base font-bold text-primary">$14.00</span>
</div>
<h3 className="font-bold text-lg leading-tight mb-2">Buffalo Wings (x12)</h3>
<div className="mt-auto pt-4 flex justify-between items-center">
<span className="text-xs text-gray-400">Kitchen Ready</span>
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 hover:border-primary hover:shadow-xl transition-all text-left">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-black bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter">APPETIZER</span>
<span className="text-base font-bold text-primary">$16.00</span>
</div>
<h3 className="font-bold text-lg leading-tight mb-2">Calamari Fritti</h3>
<div className="mt-auto pt-4 flex justify-between items-center">
<span className="text-xs text-gray-400">Kitchen Ready</span>
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 hover:border-primary hover:shadow-xl transition-all text-left">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-black bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter">APPETIZER</span>
<span className="text-base font-bold text-primary">$12.00</span>
</div>
<h3 className="font-bold text-lg leading-tight mb-2">Truffle Fries</h3>
<div className="mt-auto pt-4 flex justify-between items-center">
<span className="text-xs text-gray-400">Kitchen Ready</span>
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 hover:border-primary hover:shadow-xl transition-all text-left">
<div className="flex justify-between items-start mb-3">
<span className="text-[10px] font-black bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-500 uppercase tracking-tighter">APPETIZER</span>
<span className="text-base font-bold text-primary">$18.00</span>
</div>
<h3 className="font-bold text-lg leading-tight mb-2">Beef Carpaccio</h3>
<div className="mt-auto pt-4 flex justify-between items-center">
<span className="text-xs text-gray-400">Kitchen Ready</span>
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">add_circle</span>
</div>
</button>
</div>
</section>
</main>
<div className="fixed bottom-4 left-6 flex gap-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-2xl border border-gray-100 dark:border-slate-800 z-50">
<div className="flex items-center gap-1.5"><kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">F1</kbd> NEW TICKET</div>
<div className="flex items-center gap-1.5"><kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">F2</kbd> TABLE MAP</div>
<div className="flex items-center gap-1.5"><kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700">CTRL+S</kbd> SEND TO ROOM</div>
</div>

<div className="fixed bottom-8 right-8 z-50">
<button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => {}) }}>
<span className="material-icons-outlined text-2xl">add</span>
</button>
</div>

    </div>
  );
}
