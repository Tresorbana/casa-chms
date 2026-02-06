'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function ServicesSettings() {
    const { data: servicesData, isLoading } = useSWR('/api/services', fetcher);
    const services = Array.isArray(servicesData) ? servicesData : [];
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        unit: 'session',
        type: 'RESIDENT', // RESIDENT | WALKIN
        serviceId: '',
        bookingId: '',
        guestName: '',
        guestContact: '',
        quantity: 1
    });

    const handleCharge = async () => {
        if (!formData.serviceId) return;

        await fetch('/api/services/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        setIsAdding(false);
        setFormData({ ...formData, serviceId: '', bookingId: '', guestName: '', guestContact: '' });
        alert('Service Charged Successfully');
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
        <div className="flex-1 min-h-screen relative p-4 lg:p-8 flex flex-col gap-8 bg-slate-50">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-lg animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800">Assign Service</h3>
                            <button onClick={() => { setIsAdding(false); setFormData({ ...formData, type: 'RESIDENT' }); }} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                <span className="material-icons-outlined text-sm">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Toggle Type */}
                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                <button
                                    onClick={() => setFormData({ ...formData, type: 'RESIDENT' })}
                                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'RESIDENT' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Resident
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, type: 'WALKIN' })}
                                    className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${formData.type === 'WALKIN' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Walk-in Guest
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Service</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                    value={formData.serviceId}
                                    onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                                >
                                    <option value="">Choose a service...</option>
                                    {services.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.name} - RWF {s.price.toLocaleString()}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.type === 'RESIDENT' ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room / Guest</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                        value={formData.bookingId}
                                        onChange={e => setFormData({ ...formData, bookingId: e.target.value })}
                                    >
                                        <option value="">Select active room...</option>
                                        {/* Ideally we fetch active bookings here */}
                                        <option value="mock-booking-id">Room 101 - John Doe</option>
                                    </select>
                                    <p className="text-[10px] text-orange-400 font-bold italic">* Fetching active bookings logic needed</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                            placeholder="Full Name"
                                            value={formData.guestName}
                                            onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                            placeholder="Phone Number"
                                            value={formData.guestContact}
                                            onChange={e => setFormData({ ...formData, guestContact: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                />
                            </div>

                            <button onClick={handleCharge} className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Confirm Charge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length > 0 ? (
                    services.map((service: any) => (
                        <div key={service.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                    <span className="material-icons-outlined">spa</span>
                                </div>
                                <button onClick={() => handleDelete(service.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <span className="material-icons-outlined">delete</span>
                                </button>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-2">{service.name}</h3>
                            <p className="text-slate-500 text-sm font-bold">RWF {service.price.toLocaleString()} / {service.unit}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                            <span className="material-icons-outlined text-4xl text-slate-300">spa</span>
                        </div>
                        <div>
                            <p className="text-lg font-black italic tracking-tighter uppercase text-slate-400">No Services Registered</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add your first service to begin billing</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
