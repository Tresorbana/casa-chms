'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Inventory() {
    const { data: items, error, isLoading } = useSWR('/api/inventory', fetcher);
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="p-8">Loading inventory...</div>;

    const filteredItems = items ? items.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const stats = {
        total: items?.length || 0,
        lowStock: items?.filter((i: any) => i.stock <= i.minStock).length || 0,
        totalValue: items?.reduce((acc: number, i: any) => acc + (i.stock * i.price), 0) || 0
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
            <TopBar
                title="Stock & Inventory"
                description="Manage hotel supplies, linen, and housekeeping essentials."
                actions={
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Item
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Items</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Low Stock Alerts</p>
                    <p className="text-3xl font-bold text-amber-500">{stats.lowStock}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Inventory Value</p>
                    <p className="text-3xl font-bold">RWF {stats.totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold">Item List</h3>
                    <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input
                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-64 focus:ring-primary"
                            placeholder="Filter items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">In Stock</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4 text-right">Unit Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredItems.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">{item.stock}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{item.unit}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">RWF {item.price.toFixed(0)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.stock <= item.minStock ? (
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 text-[10px] font-black uppercase">Low Stock</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 text-[10px] font-black uppercase">Good</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-primary">
                                            <span className="material-icons-outlined text-sm">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
