'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function ServicesSettings() {
    const { data: servicesData, isLoading } = useSWR('/api/services', fetcher);
    const services = Array.isArray(servicesData) ? servicesData : [];
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', unit: 'session' });

    const handleAdd = async () => {
        if (!formData.name || !formData.price) return;

        await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                price: parseFloat(formData.price),
                unit: formData.unit
            })
        });

        setIsAdding(false);
        setFormData({ name: '', price: '', unit: 'session' });
        mutate('/api/services');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            mutate('/api/services');
        } catch (error) {
            console.error(error);
            alert('Failed to delete service');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Services...</div>;

    return (
        <div className="flex-1 min-h-screen relative p-4 lg:p-8 flex flex-col gap-8 bg-slate-50 dark:bg-slate-950">
            <TopBar
                title="Service Configuration"
                description="Manage extraneous charges, spa services, and add-ons."
                actions={
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-lg">add</span>
                        Add Service
                    </button>
                }
            />

            {isAdding && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">New Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Service Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Airport Shuttle"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Price</label>
                            <input
                                type="number"
                                placeholder="RWF"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Unit</label>
                            <select
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option value="session">Per Session</option>
                                <option value="hour">Per Hour</option>
                                <option value="day">Per Day</option>
                                <option value="item">Per Item</option>
                                <option value="km">Per Km</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleAdd} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">Save Service</button>
                        <button onClick={() => setIsAdding(false)} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-2 rounded-xl font-bold">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                    <div key={service.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                <span className="material-icons-outlined">spa</span>
                            </div>
                            <button onClick={() => handleDelete(service.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <span className="material-icons-outlined">delete</span>
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{service.name}</h3>
                        <p className="text-slate-500 text-sm font-bold">RWF {service.price.toLocaleString()} / {service.unit}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
