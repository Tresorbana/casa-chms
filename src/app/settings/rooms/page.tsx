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

    // Room creation state
    const [addingRoomToFloor, setAddingRoomToFloor] = useState<string | null>(null);
    const [newRoomData, setNewRoomData] = useState({ number: '', type: 'Standard', price: '' });

    const handleAddFloor = async () => {
        if (!newFloorNumber) return;
        await fetch('/api/floors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: newFloorNumber })
        });
        setIsAddingFloor(false);
        setNewFloorNumber('');
        mutate('/api/floors');
    };

    const handleDeleteFloor = async (id: string) => {
        if (!confirm('Are you sure? This will delete the floor.')) return;
        await fetch(`/api/floors/${id}`, { method: 'DELETE' });
        mutate('/api/floors');
    };

    const handleAddRoom = async (floorId: string) => {
        if (!newRoomData.number || !newRoomData.price) return;
        await fetch('/api/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...newRoomData,
                floorId
            })
        });
        setAddingRoomToFloor(null);
        setNewRoomData({ number: '', type: 'Standard', price: '' });
        mutate('/api/floors');
    };

    const handleDeleteRoom = async (id: string) => {
        if (!confirm('Delete this room?')) return;
        await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
        mutate('/api/floors');
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Rooms Configuration...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Room Management"
                description="Configure floors and rooms for your property."
                actions={
                    <button
                        onClick={() => setIsAddingFloor(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
                    >
                        <span className="material-icons-outlined text-lg">add</span>
                        Add Floor
                    </button>
                }
            />

            {isAddingFloor && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">New Floor</h3>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Floor Number"
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                            value={newFloorNumber}
                            onChange={e => setNewFloorNumber(e.target.value)}
                        />
                        <button onClick={handleAddFloor} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">Save</button>
                        <button onClick={() => setIsAddingFloor(false)} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-2 rounded-xl font-bold">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid gap-6">
                {floors?.map((floor: any) => (
                    <div key={floor.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-black">
                                    {floor.number}
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Floor {floor.number}</h3>
                                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                                    {floor.rooms?.length || 0} Rooms
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setAddingRoomToFloor(floor.id)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-primary transition-colors"
                                    title="Add Room"
                                >
                                    <span className="material-icons-outlined">add_box</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteFloor(floor.id)}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                                    title="Delete Floor"
                                >
                                    <span className="material-icons-outlined">delete</span>
                                </button>
                            </div>
                        </div>

                        {addingRoomToFloor === floor.id && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-wrap gap-4 items-end animate-in fade-in">
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Number</label>
                                    <input
                                        className="w-full bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g. 101"
                                        value={newRoomData.number}
                                        onChange={e => setNewRoomData({ ...newRoomData, number: e.target.value })}
                                    />
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Type</label>
                                    <select
                                        className="w-full bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        value={newRoomData.type}
                                        onChange={e => setNewRoomData({ ...newRoomData, type: e.target.value })}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[120px]">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">Price</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="0.00"
                                        value={newRoomData.price}
                                        onChange={e => setNewRoomData({ ...newRoomData, price: e.target.value })}
                                    />
                                </div>
                                <button onClick={() => handleAddRoom(floor.id)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
                                <button onClick={() => setAddingRoomToFloor(null)} className="text-slate-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {floor.rooms?.map((room: any) => (
                                <div key={room.id} className="relative group bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDeleteRoom(room.id)} className="text-red-400 hover:text-red-600">
                                            <span className="material-icons-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{room.type}</span>
                                        <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">{room.number}</span>
                                        <span className="text-sm font-bold text-primary block mt-1">${room.price}</span>
                                    </div>
                                </div>
                            ))}
                            {(!floor.rooms || floor.rooms.length === 0) && (
                                <div className="col-span-full py-8 text-center text-slate-400 text-sm italic">
                                    No rooms on this floor yet.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {(!floors || floors.length === 0) && (
                    <div className="text-center py-20 opacity-50">
                        <span className="material-icons-outlined text-6xl text-slate-300 mb-4">layers</span>
                        <p className="text-lg font-bold text-slate-400">No floors defined.</p>
                        <p className="text-sm text-slate-400">Add a floor to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
