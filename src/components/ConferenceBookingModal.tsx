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
    const { data: rooms, isLoading: roomsLoading } = useSWR('/api/conference', fetcher);
    const [formData, setFormData] = useState({
        conferenceRoomId: '',
        guestName: '',
        guestEmail: '',
        startTime: initialDate ? new Date(initialDate.setHours(9, 0, 0, 0)).toISOString().slice(0, 16) : '',
        endTime: initialDate ? new Date(initialDate.setHours(17, 0, 0, 0)).toISOString().slice(0, 16) : '',
        totalAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/conference/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create booking');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const selectedRoom = rooms?.find((r: any) => r.id === formData.conferenceRoomId);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800">
                            Conference Booking
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                            Secure a space for your next event.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                    >
                        <span className="material-icons-outlined text-xl">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic">
                            <span className="material-icons-outlined text-sm">error_outline</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Hall / Room</label>
                        <select
                            required
                            value={formData.conferenceRoomId}
                            onChange={(e) => setFormData({ ...formData, conferenceRoomId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                            <option value="">Choose a room...</option>
                            {rooms?.map((room: any) => (
                                <option key={room.id} value={room.id}>
                                    {room.name} (Cap: {room.capacity}) - RWF {room.pricePerHour}/hr
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Who is booking?"
                            value={formData.guestName}
                            onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount (RWF)</label>
                        <input
                            type="number"
                            required
                            placeholder="Enter pricing"
                            value={formData.totalAmount}
                            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-4"
                    >
                        {loading ? 'Processing...' : 'Confirm Room Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
