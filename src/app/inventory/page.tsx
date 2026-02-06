'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Inventory() {
    const { data: items, error, isLoading, mutate } = useSWR('/api/inventory', fetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'Housekeeping',
        stock: '0',
        unit: 'pcs',
        price: '0'
    });

    if (isLoading) return <div className="p-8">Loading inventory...</div>;

    const filteredItems = items ? items.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const stats = {
        total: items?.length || 0,
        lowStock: items?.filter((i: any) => i.stock <= (i.minStock || 5)).length || 0,
        totalValue: items?.reduce((acc: number, i: any) => acc + (i.stock * i.price), 0) || 0
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                mutate();
                setIsModalOpen(false);
                setNewItem({ name: '', category: 'Housekeeping', stock: '0', unit: 'pcs', price: '0' });
            } else {
                alert('Failed to add item');
            }
        } catch (err) {
            alert('Error adding item');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-4 lg:p-8">
            <TopBar
                title="Stock & Inventory"
                description="Manage hotel supplies, linen, and housekeeping essentials."
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Item
                    </button>
                }
            />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-lg">Add New Inventory Item</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Item Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                                    placeholder="e.g. Bed Sheets"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option>Housekeeping</option>
                                        <option>Linen</option>
                                        <option>Food & Bev</option>
                                        <option>Maintenance</option>
                                        <option>Office</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unit</label>
                                    <input
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                                        placeholder="pcs, kg, etc"
                                        value={newItem.unit}
                                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initial Stock</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                                        value={newItem.stock}
                                        onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unit Price (RWF)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/30 uppercase tracking-widest text-xs disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Items</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Low Stock Alerts</p>
                    <p className="text-3xl font-bold text-amber-500">{stats.lowStock}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Inventory Value</p>
                    <p className="text-3xl font-bold">RWF {stats.totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold">Item List</h3>
                    <div className="relative">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input
                            className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-primary"
                            placeholder="Filter items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">In Stock</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4 text-right">Unit Price</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold">{item.stock}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{item.unit}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">RWF {item.price.toFixed(0)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {item.stock <= (item.minStock || 5) ? (
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase">Low Stock</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase">Good</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-primary">
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
