'use client';
import React, { useState } from 'react';
import Link from 'next/link';

interface RoomDetailsModalProps {
    room: any;
    onClose: () => void;
    onUpdate: () => void;
}

export default function RoomDetailsModal({ room, onClose, onUpdate }: RoomDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        number: room.number,
        type: room.type,
        price: room.price,
    });
    const [isSaving, setIsSaving] = useState(false);

    const activeBooking = room.activeBooking;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/rooms', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: room.id, ...formData }),
            });
            if (res.ok) {
                onUpdate();
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update room:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="rounded-[2rem] shadow-2xl shadow-black/60 w-full max-w-2xl overflow-hidden animate-fade-in" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.15)' }}>
                {/* Gold top accent */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

                {/* Header */}
                <div className="p-8 border-b border-gold/[0.12] flex justify-between items-center bg-black/20">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase text-gold">Room {room.number} Manager</h3>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Room Details</p>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-gold transition-colors p-1 rounded-lg hover:bg-gold/10">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gold/[0.1]">
                    {/* Left: Management */}
                    <div className="p-10 flex-1 space-y-8">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Specifications</h4>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-gold text-[10px] font-black uppercase tracking-widest hover:underline"
                            >
                                {isEditing ? 'Cancel' : 'Edit Specs'}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Category</p>
                                {isEditing ? (
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-[#0a0a0a] border border-gold/25 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none text-white"
                                    >
                                        <option value="STANDARD">STANDARD</option>
                                        <option value="DELUXE">DELUXE</option>
                                        <option value="EXECUTIVE">EXECUTIVE</option>
                                        <option value="SUITE">SUITE</option>
                                    </select>
                                ) : (
                                    <p className="font-bold text-white">{room.type}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Daily Rate (RWF)</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full bg-[#0a0a0a] border border-gold/25 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none text-white"
                                    />
                                ) : (
                                    <p className="font-bold text-white">RWF {room.price?.toLocaleString() || '---'}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Floor Location</p>
                                <p className="font-bold text-white">{room.floor?.name || `Floor ${room.floor?.number}`}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl hover:bg-gold-light transition-all disabled:opacity-50 shadow-lg shadow-gold/20"
                            >
                                {isSaving ? 'Updating Room...' : 'Apply Changes'}
                            </button>
                        )}
                    </div>

                    {/* Right: Occupancy */}
                    <div className="p-10 flex-1 bg-black/10">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8">Active Occupancy</h4>

                        {activeBooking ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold border border-gold/20">
                                        <span className="material-icons-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Guest Name</p>
                                        <p className="font-bold text-white">{activeBooking.guest.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Stay Period</p>
                                    <p className="text-sm font-bold text-white/70">
                                        {new Date(activeBooking.checkIn).toLocaleDateString()} — {new Date(activeBooking.checkOut).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Link
                                        href={`/invoice/${activeBooking.id}`}
                                        className="flex-1 bg-white/5 border border-gold/20 text-white/70 font-black uppercase text-[9px] tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gold/10 hover:text-gold transition-all"
                                    >
                                        <span className="material-icons-outlined text-sm">receipt_long</span>
                                        Billing
                                    </Link>
                                    <Link
                                        href={`/checkout?roomId=${room.id}`}
                                        className="flex-1 bg-gold text-black font-black uppercase text-[9px] tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:bg-gold-light transition-all"
                                    >
                                        <span className="material-icons-outlined text-sm">logout</span>
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto border border-dashed border-gold/20">
                                    <span className="material-icons-outlined text-gold/30 text-2xl">event_available</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Room is Vacant</p>
                                    <Link
                                        href={`/bookings?roomNumber=${room.number}`}
                                        className="mt-4 inline-flex items-center gap-2 text-gold font-black uppercase text-[10px] tracking-widest hover:underline"
                                    >
                                        <span className="material-icons-outlined text-sm">add_circle</span>
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
