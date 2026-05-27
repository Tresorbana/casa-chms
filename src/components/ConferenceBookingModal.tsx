'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface ConferenceBookingModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialDate?: Date;
}

export default function ConferenceBookingModal({ onClose, onSuccess, initialDate }: ConferenceBookingModalProps) {
    const { data: rooms } = useSWR('/api/conference', fetcher);
    const [formData, setFormData] = useState({
        conferenceRoomId: '',
        guestName: '',
        guestContact: '',
        guestId: '',
        guestEmail: '',
        startTime: initialDate ? new Date(initialDate.setHours(9, 0, 0, 0)).toISOString().slice(0, 16) : '',
        endTime: initialDate ? new Date(initialDate.setHours(17, 0, 0, 0)).toISOString().slice(0, 16) : '',
        totalAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', color: 'white' };
    const inputClass = "w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/conference/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create booking'); }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-md rounded-[2rem] overflow-hidden animate-slide-up shadow-2xl" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.2)' }}>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                <div className="px-8 py-6 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-gold">Conference Booking</h2>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-0.5">Reserve a venue for your event</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                            <span className="material-symbols-outlined text-sm">error_outline</span>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Select Hall / Room</label>
                        <select required className={inputClass} style={inputStyle} value={formData.conferenceRoomId} onChange={e => setFormData({ ...formData, conferenceRoomId: e.target.value })}>
                            <option value="">Choose a room...</option>
                            {rooms?.map((room: any) => <option key={room.id} value={room.id}>{room.name} (Cap: {room.capacity}) — RWF {room.pricePerHour}/hr</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Start Time', key: 'startTime', type: 'datetime-local' },
                            { label: 'End Time', key: 'endTime', type: 'datetime-local' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">{f.label}</label>
                                <input required type={f.type} className={inputClass} style={inputStyle} value={(formData as any)[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Guest Name</label>
                        <input required type="text" className={inputClass} style={inputStyle} placeholder="Who is booking?" value={formData.guestName} onChange={e => setFormData({ ...formData, guestName: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Contact Phone</label>
                            <input required type="text" className={inputClass} style={inputStyle} placeholder="+250..." value={formData.guestContact} onChange={e => setFormData({ ...formData, guestContact: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">ID / Passport</label>
                            <input type="text" className={inputClass} style={inputStyle} placeholder="Optional" value={formData.guestId} onChange={e => setFormData({ ...formData, guestId: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2">Total Amount (RWF)</label>
                        <input required type="number" className={inputClass} style={inputStyle} placeholder="Enter pricing" value={formData.totalAmount} onChange={e => setFormData({ ...formData, totalAmount: e.target.value })} />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl shadow-gold hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 mt-2">
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
