'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function ConferenceSettings() {
    const { data: roomsData, isLoading } = useSWR('/api/conference', fetcher);
    const rooms = Array.isArray(roomsData) ? roomsData : [];
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', capacity: '', pricePerHour: '' });

    const [editingRoom, setEditingRoom] = useState<any>(null);

    const handleSave = async () => {
        if (!formData.name || !formData.capacity || !formData.pricePerHour) return;

        const method = editingRoom ? 'PUT' : 'POST';
        const url = editingRoom ? `/api/conference/${editingRoom.id}` : '/api/conference';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.name,
                capacity: parseInt(formData.capacity),
                pricePerHour: parseFloat(formData.pricePerHour)
            })
        });

        setIsAdding(false);
        setEditingRoom(null);
        setFormData({ name: '', capacity: '', pricePerHour: '' });
        mutate('/api/conference');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete the conference room.')) return;
        try {
            await fetch(`/api/conference/${id}`, { method: 'DELETE' });
            mutate('/api/conference');
        } catch (error) {
            alert('Failed to delete room');
        }
    };

    const startEdit = (room: any) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            capacity: room.capacity.toString(),
            pricePerHour: room.pricePerHour.toString()
        });
        setIsAdding(true);
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Conference Configuration...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Conference Rooms"
                description="Manage conference halls and meeting spaces."
                actions={
                    <button
                        onClick={() => {
                            setEditingRoom(null);
                            setFormData({ name: '', capacity: '', pricePerHour: '' });
                            setIsAdding(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-lg">add</span>
                        Add Room
                    </button>
                }
            />

            {isAdding && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{editingRoom ? 'Edit Conference Room' : 'New Conference Room'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Room Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Grand Ballroom"
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Capacity (Pax)</label>
                            <input
                                type="number"
                                placeholder="e.g. 100"
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.capacity}
                                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Price per Hour</label>
                            <input
                                type="number"
                                placeholder="e.g. 50000"
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                                value={formData.pricePerHour}
                                onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleSave} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">{editingRoom ? 'Update Room' : 'Save Room'}</button>
                        <button onClick={() => { setIsAdding(false); setEditingRoom(null); }} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-xl font-bold">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms?.map((room: any) => (
                    <div key={room.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                                <span className="material-icons-outlined">meeting_room</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(room)} className="text-slate-300 hover:text-primary transition-colors">
                                    <span className="material-icons-outlined">edit</span>
                                </button>
                                <button onClick={() => handleDelete(room.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <span className="material-icons-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{room.name}</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-bold">Capacity</span>
                                <span className="font-bold text-slate-800">{room.capacity} Pax</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-bold">Rate</span>
                                <span className="font-black text-primary">RWF {room.pricePerHour?.toLocaleString()}/hr</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Recent Bookings</span>
                            {room.bookings && room.bookings.length > 0 ? (
                                <ul className="space-y-2">
                                    {room.bookings.slice(0, 2).map((b: any) => (
                                        <li key={b.id} className="text-xs text-slate-600 flex justify-between">
                                            <span>{new Date(b.startTime).toLocaleDateString()}</span>
                                            <span className="font-bold">{b.guestName}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-slate-300 italic">No recent bookings</p>
                            )}
                        </div>
                    </div>
                ))}

                {(!rooms || rooms.length === 0) && !isLoading && (
                    <div className="col-span-full py-20 text-center opacity-50">
                        <span className="material-icons-outlined text-6xl text-slate-300 mb-4">meeting_room</span>
                        <p className="text-xl font-bold text-slate-400">No conference rooms.</p>
                        <p className="text-sm text-slate-400">Create one to start taking bookings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
