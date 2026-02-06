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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-200">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase">Room {room.number} Manager</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Details</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* Left: Management */}
                    <div className="p-10 flex-1 space-y-8">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Specifications</h4>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                            >
                                {isEditing ? 'Cancel' : 'Edit Specs'}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</p>
                                {isEditing ? (
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none text-slate-800"
                                    >
                                        <option value="STANDARD">STANDARD</option>
                                        <option value="DELUXE">DELUXE</option>
                                        <option value="EXECUTIVE">EXECUTIVE</option>
                                        <option value="SUITE">SUITE</option>
                                    </select>
                                ) : (
                                    <p className="font-bold text-slate-800">{room.type}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Daily Rate (RWF)</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none text-slate-800"
                                    />
                                ) : (
                                    <p className="font-bold text-slate-800">RWF {room.price?.toLocaleString() || '---'}</p>
                                )}
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Floor Location</p>
                                <p className="font-bold text-slate-800">{room.floor?.name || `Floor ${room.floor?.number}`}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Updating Room...' : 'Apply Changes'}
                            </button>
                        )}
                    </div>

                    {/* Right: Occupancy */}
                    <div className="p-10 flex-1 bg-slate-50/30">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Active Occupancy</h4>

                        {activeBooking ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <span className="material-icons-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest Name</p>
                                        <p className="font-bold text-slate-800">{activeBooking.guest.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Period</p>
                                    <p className="text-sm font-bold text-slate-600">
                                        {new Date(activeBooking.checkIn).toLocaleDateString()} — {new Date(activeBooking.checkOut).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Link
                                        href={`/invoice/${activeBooking.id}`}
                                        className="flex-1 bg-white border border-slate-200 text-slate-600 font-black uppercase text-[9px] tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                                    >
                                        <span className="material-icons-outlined text-sm">receipt_long</span>
                                        Billing
                                    </Link>
                                    <Link
                                        href={`/checkout?roomId=${room.id}`}
                                        className="flex-1 bg-primary text-white font-black uppercase text-[9px] tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                    >
                                        <span className="material-icons-outlined text-sm">logout</span>
                                        Checkout
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto border border-dashed border-slate-200">
                                    <span className="material-icons-outlined text-slate-200 text-2xl">event_available</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room is Vacant</p>
                                    <Link
                                        href={`/bookings?roomNumber=${room.number}`}
                                        className="mt-4 inline-flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
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
