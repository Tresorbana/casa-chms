'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function MenuSettings() {
    const { data: menuItems, isLoading } = useSWR('/api/pos/menu?all=true', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: 'Main Course', price: '', description: '' });

    const categories = ["Appetizers", "Main Course", "Wine & Spirits", "Cocktails", "Desserts", "Beverages"];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/pos/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                mutate('/api/pos/menu?all=true');
                setIsModalOpen(false);
                setFormData({ name: '', category: 'Main Course', price: '', description: '' });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await fetch(`/api/pos/menu/${id}`, { method: 'DELETE' });
            mutate('/api/pos/menu?all=true');
        } catch (error) {
            console.error(error);
        }
    };

    const toggleAvailability = async (item: any) => {
        try {
            await fetch(`/api/pos/menu/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ available: !item.available }),
            });
            mutate('/api/pos/menu?all=true');
        } catch (error) {
            console.error(error);
        }
    };

    const safeItems = Array.isArray(menuItems) ? menuItems : [];

    return (
        <div className="flex-1 min-h-screen relative p-4 lg:p-8 flex flex-col gap-8 bg-slate-50 dark:bg-slate-950">
            <TopBar
                title="Menu Management"
                description="Configure restaurant menu items, pricing, and availability."
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-olive-leaf text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black-forest transition-all shadow-lg shadow-olive-leaf/20"
                    >
                        <span className="material-icons-outlined text-base">add</span>
                        Add Item
                    </button>
                }
            />

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Item Name</th>
                                <th className="px-8 py-4">Category</th>
                                <th className="px-8 py-4">Price</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-xs text-slate-400">Loading menu...</td></tr>
                            ) : safeItems.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-xs text-slate-400">No items found.</td></tr>
                            ) : (
                                safeItems.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-slate-800 dark:text-slate-200">{item.name}</td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{item.category}</td>
                                        <td className="px-8 py-5 font-black text-copper">RWF {item.price.toLocaleString()}</td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => toggleAvailability(item)}
                                                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.available
                                                        ? 'bg-olive-leaf/10 text-olive-leaf hover:bg-red-500/10 hover:text-red-500'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-olive-leaf/10 hover:text-olive-leaf'
                                                    }`}
                                            >
                                                {item.available ? 'Available' : 'Sold Out'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                                                <span className="material-icons-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <span className="material-icons-outlined">close</span>
                        </button>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-8">Add Menu Item</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Item Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-olive-leaf outline-none"
                                    placeholder="e.g. Grilled Salmon"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-4 text-sm font-bold shadow-inner outline-none appearance-none"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Price (RWF)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-olive-leaf outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner focus:ring-2 focus:ring-olive-leaf outline-none h-24 resize-none"
                                    placeholder="Brief description..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-olive-leaf text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-3xl shadow-xl shadow-olive-leaf/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
