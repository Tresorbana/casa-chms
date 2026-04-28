'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomSettings() {
    const { data: floorsData, isLoading } = useSWR('/api/floors', fetcher);
    const floors = Array.isArray(floorsData) ? floorsData : [];
    const [isAddingFloor, setIsAddingFloor] = useState(false);
    const [newFloorNumber, setNewFloorNumber] = useState('');
    const [addingRoomToFloor, setAddingRoomToFloor] = useState<string | null>(null);
    const [newRoomData, setNewRoomData] = useState({ number: '', type: 'Standard', price: '' });

    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', color: 'white' };

    const handleAddFloor = async () => {
        if (!newFloorNumber) return;
        await fetch('/api/floors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number: newFloorNumber }) });
        setIsAddingFloor(false);
        setNewFloorNumber('');
        mutate('/api/floors');
    };

    const handleDeleteFloor = async (id: string) => {
        if (!confirm('Delete this floor and all its rooms?')) return;
        await fetch(`/api/floors/${id}`, { method: 'DELETE' });
        mutate('/api/floors');
    };

    const handleAddRoom = async (floorId: string) => {
        if (!newRoomData.number || !newRoomData.price) return;
        await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newRoomData, floorId }) });
        setAddingRoomToFloor(null);
        setNewRoomData({ number: '', type: 'Standard', price: '' });
        mutate('/api/floors');
    };

    const handleDeleteRoom = async (id: string) => {
        if (!confirm('Delete this room?')) return;
        await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
        mutate('/api/floors');
    };

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gold/40">Loading Configuration...</div>;

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Rooms & Floors"
                description="Configure floors and rooms for your property."
                actions={
                    <button
                        onClick={() => setIsAddingFloor(true)}
                        className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-gold-sm hover:bg-gold-light transition-all"
                    >
                        <span className="material-icons-outlined text-sm">add</span>
                        Add Floor
                    </button>
                }
            />

            {isAddingFloor && (
                <div className="rounded-2xl p-6 animate-fade-in" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <h3 className="text-sm font-black text-gold uppercase tracking-widest mb-4">New Floor</h3>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            placeholder="Floor Number (e.g. 1)"
                            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                            style={inputStyle}
                            value={newFloorNumber}
                            onChange={e => setNewFloorNumber(e.target.value)}
                        />
                        <button onClick={handleAddFloor} className="bg-gold text-black px-5 py-2.5 rounded-xl text-sm font-black">Save</button>
                        <button onClick={() => setIsAddingFloor(false)} className="px-5 py-2.5 rounded-xl text-sm font-black text-white/40 hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {floors.map((floor: any) => (
                    <div key={floor.id} className="rounded-3xl overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gold/10 text-gold rounded-xl flex items-center justify-center font-black text-sm border border-gold/20">
                                    {floor.number}
                                </div>
                                <h3 className="font-black text-white uppercase tracking-tighter">Floor {floor.number}</h3>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    {floor.rooms?.length || 0} rooms
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setAddingRoomToFloor(floor.id)} className="p-2 rounded-lg text-gold/50 hover:text-gold hover:bg-gold/10 transition-all" title="Add Room">
                                    <span className="material-icons-outlined text-[18px]">add_box</span>
                                </button>
                                <button onClick={() => handleDeleteFloor(floor.id)} className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Delete Floor">
                                    <span className="material-icons-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>

                        {addingRoomToFloor === floor.id && (
                            <div className="px-6 py-4 flex flex-wrap gap-3 items-end" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(212,175,55,0.03)' }}>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Number</label>
                                    <input className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none" style={inputStyle} placeholder="101" value={newRoomData.number} onChange={e => setNewRoomData({ ...newRoomData, number: e.target.value })} />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Type</label>
                                    <select className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none" style={inputStyle} value={newRoomData.type} onChange={e => setNewRoomData({ ...newRoomData, type: e.target.value })}>
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 block">Price (RWF)</label>
                                    <input type="number" className="w-full rounded-lg px-3 py-2 text-sm font-bold outline-none" style={inputStyle} placeholder="45000" value={newRoomData.price} onChange={e => setNewRoomData({ ...newRoomData, price: e.target.value })} />
                                </div>
                                <button onClick={() => handleAddRoom(floor.id)} className="bg-gold text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">Add Room</button>
                                <button onClick={() => setAddingRoomToFloor(null)} className="text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-colors">Cancel</button>
                            </div>
                        )}

                        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {floor.rooms?.map((room: any) => (
                                <div key={room.id} className="relative group rounded-xl p-4 text-center cursor-pointer transition-all hover:border-gold/30" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <button onClick={() => handleDeleteRoom(room.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400">
                                        <span className="material-icons-outlined text-sm">close</span>
                                    </button>
                                    <span className="text-[9px] font-black text-white/25 uppercase tracking-widest block mb-1">{room.type}</span>
                                    <span className="text-xl font-black text-gold block">{room.number}</span>
                                    <span className="text-[9px] font-bold text-white/40 block mt-1">RWF {room.price?.toLocaleString()}</span>
                                </div>
                            ))}
                            {(!floor.rooms || floor.rooms.length === 0) && (
                                <div className="col-span-full py-8 text-center text-white/20 text-xs italic">No rooms on this floor yet.</div>
                            )}
                        </div>
                    </div>
                ))}

                {floors.length === 0 && (
                    <div className="py-24 text-center rounded-3xl" style={{ border: '1px dashed rgba(212,175,55,0.15)' }}>
                        <span className="material-icons-outlined text-5xl text-white/15 mb-4 block">layers</span>
                        <p className="font-black text-white/25 uppercase tracking-widest text-sm">No floors defined</p>
                    </div>
                )}
            </div>
        </div>
    );
}
