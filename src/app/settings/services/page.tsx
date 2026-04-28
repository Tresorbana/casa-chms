'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function ServicesSettings() {
    const { data: servicesData, isLoading } = useSWR('/api/services', fetcher);
    const services = Array.isArray(servicesData) ? servicesData : [];
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', unit: 'session', type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });

    const inputClass = "w-full rounded-xl px-4 py-3 text-sm font-bold text-white outline-none transition-all";
    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)' };

    const handleCharge = async () => {
        if (!formData.serviceId) return;
        await fetch('/api/services/charge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
        setIsAdding(false);
        setFormData({ ...formData, serviceId: '', bookingId: '', guestName: '', guestContact: '' });
        alert('Service charged successfully');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        try {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            mutate('/api/services');
        } catch (error) {
            alert('Failed to delete service');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gold/40">Loading Services...</div>;

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Service Configuration"
                description="Manage extra charges, spa services, and add-ons."
                actions={
                    <button onClick={() => setIsAdding(true)} className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-gold-sm hover:bg-gold-light transition-all">
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Service
                    </button>
                }
            />

            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
                    <div className="w-full max-w-lg rounded-[2rem] overflow-hidden animate-slide-up" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-gold">Assign Service</h3>
                                <button onClick={() => setIsAdding(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <span className="material-icons-outlined text-sm">close</span>
                                </button>
                            </div>
                            <div className="space-y-5">
                                <div className="flex p-1 rounded-xl gap-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['RESIDENT', 'WALKIN'].map(t => (
                                        <button key={t} onClick={() => setFormData({ ...formData, type: t })}
                                            className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t ? 'bg-gold text-black shadow-sm' : 'text-white/40 hover:text-white'}`}>
                                            {t === 'RESIDENT' ? 'Resident' : 'Walk-in'}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Select Service</label>
                                    <select className={inputClass} style={inputStyle} value={formData.serviceId} onChange={e => setFormData({ ...formData, serviceId: e.target.value })}>
                                        <option value="">Choose a service...</option>
                                        {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — RWF {s.price.toLocaleString()}</option>)}
                                    </select>
                                </div>
                                {formData.type === 'RESIDENT' ? (
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Room / Guest</label>
                                        <select className={inputClass} style={inputStyle} value={formData.bookingId} onChange={e => setFormData({ ...formData, bookingId: e.target.value })}>
                                            <option value="">Select active room...</option>
                                            <option value="mock-booking-id">Room 101 - John Doe</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Guest Name</label>
                                            <input type="text" className={inputClass} style={inputStyle} placeholder="Full Name" value={formData.guestName} onChange={e => setFormData({ ...formData, guestName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Contact</label>
                                            <input type="text" className={inputClass} style={inputStyle} placeholder="Phone" value={formData.guestContact} onChange={e => setFormData({ ...formData, guestContact: e.target.value })} />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Quantity</label>
                                    <input type="number" min="1" className={inputClass} style={inputStyle} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
                                </div>
                                <button onClick={handleCharge} className="w-full bg-gold text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-gold hover:bg-gold-light hover:scale-[1.01] transition-all">
                                    Confirm Charge
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service: any) => (
                    <div key={service.id} className="rounded-2xl p-6 transition-all hover:border-gold/25 group" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex justify-between items-start mb-5">
                            <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center ring-1 ring-gold/20">
                                <span className="material-icons-outlined">spa</span>
                            </div>
                            <button onClick={() => handleDelete(service.id)} className="text-white/15 hover:text-red-400 transition-colors">
                                <span className="material-icons-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                        <h3 className="font-black text-white text-lg mb-1">{service.name}</h3>
                        <p className="text-sm font-bold text-gold">RWF {service.price.toLocaleString()} <span className="text-white/30">/ {service.unit}</span></p>
                    </div>
                ))}
                {services.length === 0 && (
                    <div className="col-span-full py-20 rounded-3xl text-center" style={{ border: '1px dashed rgba(212,175,55,0.15)' }}>
                        <span className="material-icons-outlined text-5xl text-white/15 mb-4 block">spa</span>
                        <p className="font-black text-white/25 uppercase tracking-widest text-sm">No Services Registered</p>
                    </div>
                )}
            </div>
        </div>
    );
}
