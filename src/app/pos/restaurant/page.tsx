'use client';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';

export default function PosRestaurant1() {
  const { data: menuItems, error } = useSWR('/api/pos/menu', fetcher);
  const [orderType, setOrderType] = useState('resident');
  const [cart, setCart] = useState<any[]>([]);

  const switchType = (type: string) => {
    setOrderType(type);
  };

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="flex-1 flex overflow-hidden ml-64 min-h-screen"><div className="flex justify-end gap-4 mb-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><div className="text-right hidden sm:block">
<p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Current Shift</p>
<p className="text-sm font-medium">Evening Bar - John Doe</p>
</div></div>
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/pos/restaurant">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-3">View 3</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/pos/restaurant/view-4">View 4</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Pos Restaurant 1</h2>
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
<div className="flex flex-col md:flex-row gap-4 mb-6">
<div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit">
<button className="px-6 py-2 rounded-lg text-sm font-semibold transition-all bg-primary text-white shadow-sm" id="btn-resident" onClick={() => { switchType('resident') }}>
                        Resident
                    </button>
<button className="px-6 py-2 rounded-lg text-sm font-semibold transition-all text-gray-600 dark:text-slate-400" id="btn-walkin" onClick={() => { switchType('walkin') }}>
                        Walk-in
                    </button>
</div>
<div className="relative flex-1 max-w-sm" id="resident-field">
<span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">meeting_room</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary dark:text-white" placeholder="Search Room Number (e.g. 402)..." type="text"/>
</div>
<div className="relative flex-1">
<span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
<input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary dark:text-white" placeholder="Search menu items..." type="text"/>
</div>
</div>
<div className="flex gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
<button className="px-5 py-2 rounded-full bg-secondary text-white text-sm font-semibold whitespace-nowrap">All Items</button>
<button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap hover:border-primary transition-colors">Appetizers</button>
<button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap hover:border-primary transition-colors">Main Course</button>
<button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap hover:border-primary transition-colors">Wine &amp; Spirits</button>
<button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap hover:border-primary transition-colors">Cocktails</button>
<button className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-semibold whitespace-nowrap hover:border-primary transition-colors">Desserts</button>
</div>
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pr-2">
{menuItems ? menuItems.map((item: any) => (
<button key={item.id} className="group relative flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all text-left" onClick={() => addToCart(item)}>
<div className="h-32 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
    <span className="material-icons text-4xl text-slate-300">restaurant_menu</span>
</div>
<div className="p-3">
<h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{item.name}</h3>
<p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{item.category}</p>
<div className="mt-2 flex items-center justify-between">
<span className="text-primary font-bold">${item.price.toFixed(2)}</span>
<div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-icons-round text-sm">add</span>
</div>
</div>
</div>
</button>
)) : (
    <div className="p-8 text-center col-span-4">Loading menu...</div>
)}
</div>
</section>
<div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 flex flex-col h-full shadow-2xl z-20">
<div className="p-6 border-b border-slate-100 dark:border-slate-800">
<div className="flex justify-between items-center mb-4">
<h3 className="font-bold text-lg">Current Order</h3>
<button className="text-sm text-red-500 hover:text-red-600 font-medium" onClick={() => setCart([])}>Clear All</button>
</div>
<div className="flex gap-2">
<div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
<p className="text-xs text-slate-500 mb-1">Order Type</p>
<p className="font-bold text-sm capitalize">{orderType}</p>
</div>
<div className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
<p className="text-xs text-slate-500 mb-1">Table / Room</p>
<p className="font-bold text-sm">--</p>
</div>
</div>
</div>
<div className="flex-1 overflow-y-auto p-6 space-y-4">
{cart.length === 0 ? (
    <div className="text-center text-slate-400 py-10">
        <span className="material-icons-outlined text-4xl mb-2">shopping_cart</span>
        <p>No items added yet</p>
    </div>
) : (
    cart.map((item, index) => (
        <div key={index} className="flex gap-3">
        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="material-icons text-slate-300">restaurant</span>
        </div>
        <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
        </div>
        <p className="text-xs text-slate-500 mb-2">{item.category}</p>
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
        <button className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm">
        <span className="material-icons-round text-xs">remove</span>
        </button>
        <span className="text-xs font-bold w-4 text-center">1</span>
        <button className="w-6 h-6 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors shadow-sm">
        <span className="material-icons-round text-xs">add</span>
        </button>
        </div>
        <button className="text-slate-400 hover:text-red-500 transition-colors">
        <span className="material-icons-round text-sm">delete</span>
        </button>
        </div>
        </div>
        </div>
    ))
)}
</div>
<div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
<div className="space-y-2 mb-4">
<div className="flex justify-between text-sm">
<span className="text-slate-500">Subtotal</span>
<span className="font-medium">${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
</div>
<div className="flex justify-between text-sm">
<span className="text-slate-500">Tax (10%)</span>
<span className="font-medium">${(cart.reduce((sum, item) => sum + item.price, 0) * 0.1).toFixed(2)}</span>
</div>
<div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
<span>Total</span>
<span>${(cart.reduce((sum, item) => sum + item.price, 0) * 1.1).toFixed(2)}</span>
</div>
</div>
<button className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
<span className="material-icons-round">payments</span>
                    Place Order
                </button>
</div>
</div>
</main>
<div className="fixed bottom-6 left-6 flex gap-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest pointer-events-none">
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300">F2</kbd> PAY</div>
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300">F4</kbd> PRINT</div>
<div className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-300">ESC</kbd> CLEAR</div>
</div>

<div className="fixed bottom-8 right-8 z-50">
<button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => {}) }}>
<span className="material-icons-outlined text-2xl">add</span>
</button>
</div>

    </div>
  );
}
