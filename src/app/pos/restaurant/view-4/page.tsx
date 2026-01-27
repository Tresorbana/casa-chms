'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function PosRestaurant4() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="flex-1 flex overflow-hidden ml-64 min-h-screen"><div className="flex justify-end gap-4 mb-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><button className="w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all">
<span className="material-symbols-outlined text-white">notifications</span>
</button><div className="text-right">
<div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Server</div>
<div className="text-lg font-bold text-white">Marcus J.</div>
</div></div>
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/pos/restaurant/view-4">View 4</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Pos Restaurant 4</h2>
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
<section className="flex-1 flex flex-col p-6 overflow-hidden bg-dark">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
<div className="bg-primary/10 border-2 border-primary/40 p-4 rounded-xl flex flex-col gap-2">
<label className="text-[10px] font-black text-primary uppercase tracking-widest">Guest Resident Link</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">person_pin</span>
<input className="w-full pl-12 pr-4 py-4 bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-primary text-xl font-bold text-white placeholder-slate-600" placeholder="Room # or Guest Name" type="text" value="Room 402 - Mr. Smith"/>
</div>
</div>
<div className="bg-surface border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
<label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Menu Search</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
<input className="w-full pl-12 pr-4 py-4 bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-secondary text-xl font-bold text-white placeholder-slate-600" placeholder="Search menu..." type="text"/>
</div>
</div>
</div>
<div className="grid grid-cols-3 gap-6 mb-8 h-48">
<button className="relative group overflow-hidden rounded-2xl border-2 border-white ring-offset-4 ring-offset-dark ring-white/20 transition-all hover:scale-[1.02]">
<img alt="Appetizers" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity h-10 object-contain" src="logo.png"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div className="absolute bottom-4 left-6">
<span className="text-3xl font-black text-white tracking-tighter uppercase">Appetizers</span>
<p className="text-xs font-bold text-white/60 uppercase">12 Items Available</p>
</div>
</button>
<button className="relative group overflow-hidden rounded-2xl border-2 border-transparent transition-all hover:border-slate-400 hover:scale-[1.02]">
<img alt="Mains" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity h-10 object-contain" src="logo.png"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div className="absolute bottom-4 left-6">
<span className="text-3xl font-black text-white tracking-tighter uppercase">Mains</span>
<p className="text-xs font-bold text-white/60 uppercase">24 Items Available</p>
</div>
</button>
<button className="relative group overflow-hidden rounded-2xl border-2 border-transparent transition-all hover:border-slate-400 hover:scale-[1.02]">
<img alt="Drinks" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity h-10 object-contain" src="logo.png"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div className="absolute bottom-4 left-6">
<span className="text-3xl font-black text-white tracking-tighter uppercase">Drinks</span>
<p className="text-xs font-bold text-white/60 uppercase">45 Items Available</p>
</div>
</button>
</div>
<div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12 hide-scrollbar">
<button className="high-contrast-card group rounded-2xl p-6 flex flex-col gap-4 text-left transition-all hover:bg-slate-800 active:scale-95 border border-slate-800">
<div className="flex justify-between items-start">
<span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-xl">restaurant</span>
</span>
<span className="text-2xl font-black text-primary">$14.00</span>
</div>
<div>
<h3 className="text-xl font-bold text-white leading-tight">Buffalo Wings (x12)</h3>
<p className="text-sm text-slate-500 font-medium">Spicy or Honey BBQ</p>
</div>
<div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-800">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitchen Ready</span>
</div>
</button>
<button className="high-contrast-card group rounded-2xl p-6 flex flex-col gap-4 text-left transition-all hover:bg-slate-800 active:scale-95 border border-slate-800">
<div className="flex justify-between items-start">
<span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-xl">restaurant</span>
</span>
<span className="text-2xl font-black text-primary">$16.00</span>
</div>
<div>
<h3 className="text-xl font-bold text-white leading-tight">Calamari Fritti</h3>
<p className="text-sm text-slate-500 font-medium">With Garlic Aioli</p>
</div>
<div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-800">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitchen Ready</span>
</div>
</button>
<button className="high-contrast-card group rounded-2xl p-6 flex flex-col gap-4 text-left transition-all hover:bg-slate-800 active:scale-95 border border-slate-800">
<div className="flex justify-between items-start">
<span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-xl">restaurant</span>
</span>
<span className="text-2xl font-black text-primary">$12.00</span>
</div>
<div>
<h3 className="text-xl font-bold text-white leading-tight">Truffle Fries</h3>
<p className="text-sm text-slate-500 font-medium">Parmesan Crust</p>
</div>
<div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-800">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitchen Ready</span>
</div>
</button>
<button className="high-contrast-card group rounded-2xl p-6 flex flex-col gap-4 text-left transition-all hover:bg-slate-800 active:scale-95 border border-slate-800">
<div className="flex justify-between items-start">
<span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-xl">restaurant</span>
</span>
<span className="text-2xl font-black text-primary">$18.00</span>
</div>
<div>
<h3 className="text-xl font-bold text-white leading-tight">Beef Carpaccio</h3>
<p className="text-sm text-slate-500 font-medium">Thin-sliced Wagyu</p>
</div>
<div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-800">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitchen Ready</span>
</div>
</button>
</div>
</section>
</main>
<div className="hidden lg:flex fixed bottom-6 left-8 gap-8 text-[10px] uppercase font-black text-slate-500 tracking-widest bg-surface/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-800 z-50 shadow-2xl">
<div className="flex items-center gap-3">
<kbd className="px-2 py-1 rounded-md bg-slate-800 text-white border border-slate-700 shadow-sm">F1</kbd>
<span>New Bill</span>
</div>
<div className="flex items-center gap-3">
<kbd className="px-2 py-1 rounded-md bg-slate-800 text-white border border-slate-700 shadow-sm">F2</kbd>
<span>Table Layout</span>
</div>
<div className="flex items-center gap-3">
<kbd className="px-2 py-1 rounded-md bg-slate-800 text-white border border-slate-700 shadow-sm">CTRL+S</kbd>
<span>Post to Room</span>
</div>
</div>

<div className="fixed bottom-8 right-8 z-50">
<button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => {}) }}>
<span className="material-icons-outlined text-2xl">add</span>
</button>
</div>

    </div>
  );
}
