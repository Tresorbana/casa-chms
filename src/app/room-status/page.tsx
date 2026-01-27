'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomStatus() {
    const { data: rooms, error, isLoading } = useSWR('/api/rooms', fetcher);
    const [filter, setFilter] = useState('ALL');

    const stats = rooms ? {
        total: rooms.length,
        available: rooms.filter((r: any) => r.status === 'AVAILABLE').length,
        occupied: rooms.filter((r: any) => r.status === 'OCCUPIED').length,
        cleaning: rooms.filter((r: any) => r.status === 'CLEANING').length,
        maintenance: rooms.filter((r: any) => r.status === 'MAINTENANCE').length,
    } : { total: 0, available: 0, occupied: 0, cleaning: 0, maintenance: 0 };

    const filteredRooms = rooms ? rooms.filter((r: any) => filter === 'ALL' || r.status === filter) : [];

    if (isLoading) return <div className="p-8">Loading room status...</div>;

    return (
        <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
            <TopBar
                title="Room Inventory & Status"
                description="Real-time floor-wise status of all hotel units."
            />

            <div className="flex flex-wrap gap-2 mb-8">
                {['ALL', 'AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === s
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary'
                            }`}
                    >
                        {s} {s !== 'ALL' && `(${stats[s.toLowerCase() as keyof typeof stats]})`}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredRooms.map((room: any) => (
                    <div
                        key={room.id}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-xl ${room.status === 'AVAILABLE' ? 'bg-secondary/5 border-secondary hover:bg-secondary/10' :
                            room.status === 'OCCUPIED' ? 'bg-primary/5 border-primary hover:bg-primary/10' :
                                room.status === 'CLEANING' ? 'bg-blue-400/5 border-blue-400 hover:bg-blue-400/10' :
                                    'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-2xl font-black ${room.status === 'AVAILABLE' ? 'text-secondary' :
                                room.status === 'OCCUPIED' ? 'text-primary' :
                                    room.status === 'CLEANING' ? 'text-blue-500' :
                                        'text-slate-400'
                                }`}>{room.number}</span>
                            <span className="material-icons-outlined text-sm opacity-50">
                                {room.status === 'AVAILABLE' ? 'check_circle' :
                                    room.status === 'OCCUPIED' ? 'person' :
                                        room.status === 'CLEANING' ? 'cleaning_services' :
                                            'build'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{room.type}</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                {room.status === 'OCCUPIED' ? 'Guest In-Room' : room.status.charAt(0) + room.status.slice(1).toLowerCase()}
                            </p>
                            <button className="mt-4 w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors">
                                Manage Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {
                filteredRooms.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-icons-outlined text-4xl text-slate-300 mb-2">hotel</span>
                        <p className="text-slate-500">No rooms found with this status.</p>
                    </div>
                )
            }
        </div >
    );
}
