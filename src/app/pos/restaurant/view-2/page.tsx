'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function PosRestaurant2() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="flex-1 flex overflow-hidden ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/pos/restaurant/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-4">View 4</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Pos Restaurant 2</h2>
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
<label className="text-xs font-bold text-primary uppercase tracking-wider">Active Guest Selection</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">bed</span>
<input className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-primary/20 rounded-xl focus:ring-primary focus:border-primary text-lg font-bold" placeholder="Enter Room Number (e.g. 402)" type="text" value="Room 402 - Mr. Smith"/>
</div>
</div>
<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
<label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Find Menu Item</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border-transparent rounded-xl focus:ring-secondary focus:border-secondary" placeholder="Search beverages or snacks..." type="text"/>
</div>
</div>
</div>
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
<button className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold whitespace-nowrap">Favorites</button>
<button className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap">Coffee &amp; Tea</button>
<button className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap">Soft Drinks</button>
<button className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap">Spirits &amp; Wine</button>
<button className="px-5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap">Snacks</button>
</div>
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto pr-2">
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">BAR</span>
<span className="text-sm font-bold text-primary">$12.00</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Espresso Martini</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">BAR</span>
<span className="text-sm font-bold text-primary">$45.00</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Cabernet Sauvignon (Bottle)</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">SNACK</span>
<span className="text-sm font-bold text-primary">$14.00</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Buffalo Wings</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">CAFE</span>
<span className="text-sm font-bold text-primary">$4.50</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Double Espresso</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">BAR</span>
<span className="text-sm font-bold text-primary">$8.00</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Local Craft Beer</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
<button className="group flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3 hover:border-primary hover:shadow-lg transition-all text-left">
<div className="flex justify-between items-start mb-2">
<span className="text-xs font-bold text-gray-400">SNACK</span>
<span className="text-sm font-bold text-primary">$6.00</span>
</div>
<h3 className="font-bold text-sm leading-tight mb-1">Mixed Salted Nuts</h3>
<div className="mt-auto pt-2 flex justify-end">
<span className="material-symbols-outlined text-gray-300 group-hover:text-primary">add_circle</span>
</div>
</button>
</div>
</section>
</main>
<div className="fixed bottom-4 left-6 flex gap-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-slate-800">
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">F1</kbd> NEW ORDER</div>
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">F2</kbd> ROOM SEARCH</div>
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">CTRL+S</kbd> CHARGE TO ROOM</div>
</div>

<div className="fixed bottom-8 right-8 z-50">
<button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => {}) }}>
<span className="material-icons-outlined text-2xl">add</span>
</button>
</div>

    </div>
  );
}
