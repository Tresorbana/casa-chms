'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

const CATEGORIES = ["Appetizers", "Main Course", "Wine & Spirits", "Cocktails", "Desserts", "Beverages"];

export default function MenuSettings() {
    const { data: menuItems, isLoading } = useSWR('/api/pos/menu?all=true', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', category: 'Main Course', price: '', description: '' });

    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', color: 'white' };
    const safeItems = Array.isArray(menuItems) ? menuItems : [];

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/pos/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (res.ok) { mutate('/api/pos/menu?all=true'); setIsModalOpen(false); setFormData({ name: '', category: 'Main Course', price: '', description: '' }); }
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this item?')) return;
        await fetch(`/api/pos/menu/${id}`, { method: 'DELETE' });
        mutate('/api/pos/menu?all=true');
    };

    const toggleAvailability = async (item: any) => {
        await fetch(`/api/pos/menu/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available: !item.available }) });
        mutate('/api/pos/menu?all=true');
    };

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Menu Management"
                description="Configure restaurant menu items, pricing, and availability."
                actions={
                    <button onClick={() => setIsModalOpen(true)} className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-gold-sm hover:bg-gold-light transition-all">
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Item
                    </button>
                }
            />

            <div className="rounded-[2rem] overflow-hidden relative" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                                {['Item Name', 'Category', 'Price', 'Status', 'Actions'].map((h, i) => (
                                    <th key={h} className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-10 text-center text-white/30 text-sm">Loading menu items...</td></tr>
                            ) : safeItems.length === 0 ? (
                                <tr><td colSpan={5} className="p-16 text-center">
                                    <span className="material-icons-outlined text-4xl text-white/15 block mb-3">restaurant_menu</span>
                                    <p className="text-white/25 font-bold text-sm">No menu items found.</p>
                                </td></tr>
                            ) : safeItems.map((item: any) => (
                                <tr key={item.id} className="transition-colors hover:bg-gold/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <td className="px-6 py-4 font-bold text-white/80">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-gold">RWF {item.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleAvailability(item)}
                                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${item.available ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-white/[0.04] text-white/30 border border-white/[0.08]'}`}>
                                            {item.available ? 'Available' : 'Sold Out'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(item.id)} className="text-white/15 hover:text-red-400 transition-colors p-1">
                                            <span className="material-icons-outlined text-[18px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
                    <div className="w-full max-w-md rounded-[2rem] overflow-hidden animate-slide-up" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black uppercase tracking-tighter text-gold">Add Menu Item</h2>
                                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <span className="material-icons-outlined text-sm">close</span>
                                </button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Item Name</label>
                                    <input required type="text" className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none" style={inputStyle} placeholder="e.g. Grilled Salmon" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Category</label>
                                        <select className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none" style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Price (RWF)</label>
                                        <input required type="number" className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none" style={inputStyle} placeholder="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Description</label>
                                    <textarea className="w-full rounded-xl px-4 py-3 text-sm font-bold outline-none resize-none" style={inputStyle} rows={3} placeholder="Brief description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-gold hover:bg-gold-light transition-all disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Create Item'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
