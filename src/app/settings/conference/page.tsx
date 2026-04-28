'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function ConferenceSettings() {
    const { data: roomsData, isLoading } = useSWR('/api/conference', fetcher);
    const rooms = Array.isArray(roomsData) ? roomsData : [];
    const [isAdding, setIsAdding] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', capacity: '', pricePerHour: '' });

    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', color: 'white' };

    const handleSave = async () => {
        if (!formData.name || !formData.capacity || !formData.pricePerHour) return;
        const method = editingRoom ? 'PUT' : 'POST';
        const url = editingRoom ? `/api/conference/${editingRoom.id}` : '/api/conference';
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, capacity: parseInt(formData.capacity), pricePerHour: parseFloat(formData.pricePerHour) }) });
        setIsAdding(false);
        setEditingRoom(null);
        setFormData({ name: '', capacity: '', pricePerHour: '' });
        mutate('/api/conference');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this conference room?')) return;
        await fetch(`/api/conference/${id}`, { method: 'DELETE' });
        mutate('/api/conference');
    };

    const startEdit = (room: any) => {
        setEditingRoom(room);
        setFormData({ name: room.name, capacity: room.capacity.toString(), pricePerHour: room.pricePerHour.toString() });
        setIsAdding(true);
    };

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gold/40">Loading...</div>;

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Conference Rooms"
                description="Manage conference halls and meeting spaces."
                actions={
                    <button onClick={() => { setEditingRoom(null); setFormData({ name: '', capacity: '', pricePerHour: '' }); setIsAdding(true); }}
                        className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-gold-sm hover:bg-gold-light transition-all">
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Room
                    </button>
                }
            />

            {isAdding && (
                <div className="rounded-2xl p-6 animate-fade-in" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h3 className="text-sm font-black text-gold uppercase tracking-widest mb-5">{editingRoom ? 'Edit Conference Room' : 'New Conference Room'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        {[
                            { label: 'Room Name', key: 'name', type: 'text', placeholder: 'Grand Ballroom' },
                            { label: 'Capacity (Pax)', key: 'capacity', type: 'number', placeholder: '100' },
                            { label: 'Price per Hour (RWF)', key: 'pricePerHour', type: 'number', placeholder: '50000' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-2">{field.label}</label>
                                <input type={field.type} className="w-full rounded-xl px-4 py-2.5 text-sm font-bold outline-none" style={inputStyle}
                                    placeholder={field.placeholder} value={(formData as any)[field.key]}
                                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="bg-gold text-black px-6 py-2.5 rounded-xl text-sm font-black">{editingRoom ? 'Update' : 'Save'}</button>
                        <button onClick={() => { setIsAdding(false); setEditingRoom(null); }} className="text-white/40 hover:text-white px-6 py-2.5 rounded-xl text-sm font-black transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rooms.map((room: any) => (
                    <div key={room.id} className="rounded-2xl p-6 transition-all hover:border-gold/25 group" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex justify-between items-start mb-5">
                            <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center ring-1 ring-gold/20">
                                <span className="material-icons-outlined">meeting_room</span>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => startEdit(room)} className="p-1.5 rounded-lg text-white/20 hover:text-gold hover:bg-gold/10 transition-all">
                                    <span className="material-icons-outlined text-[18px]">edit</span>
                                </button>
                                <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                    <span className="material-icons-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <h3 className="font-black text-white text-xl mb-4">{room.name}</h3>
                        <div className="space-y-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/35 font-bold">Capacity</span>
                                <span className="font-black text-white">{room.capacity} Pax</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/35 font-bold">Rate</span>
                                <span className="font-black text-gold">RWF {room.pricePerHour?.toLocaleString()}/hr</span>
                            </div>
                        </div>
                        {room.bookings && room.bookings.length > 0 && (
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <span className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-2">Recent Bookings</span>
                                {room.bookings.slice(0, 2).map((b: any) => (
                                    <div key={b.id} className="flex justify-between text-xs text-white/40">
                                        <span>{new Date(b.startTime).toLocaleDateString()}</span>
                                        <span className="font-bold">{b.guestName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {rooms.length === 0 && (
                    <div className="col-span-full py-24 text-center rounded-3xl" style={{ border: '1px dashed rgba(212,175,55,0.15)' }}>
                        <span className="material-icons-outlined text-5xl text-white/15 mb-4 block">meeting_room</span>
                        <p className="font-black text-white/25 uppercase tracking-widest text-sm">No conference rooms</p>
                    </div>
                )}
            </div>
        </div>
    );
}
