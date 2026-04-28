'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomStatus() {
    const { data: rooms, error, isLoading } = useSWR('/api/rooms', fetcher);
    const [filter, setFilter] = useState('ALL');

    const safelyRooms = Array.isArray(rooms) ? rooms : [];

    const stats = {
        total: safelyRooms.length,
        available: safelyRooms.filter((r: any) => r.status === 'AVAILABLE').length,
        occupied: safelyRooms.filter((r: any) => r.status === 'OCCUPIED').length,
        cleaning: safelyRooms.filter((r: any) => r.status === 'CLEANING').length,
        maintenance: safelyRooms.filter((r: any) => r.status === 'MAINTENANCE').length,
    };

    const filteredRooms = safelyRooms.filter((r: any) => filter === 'ALL' || r.status === filter);

    if (isLoading) return <div className="p-8 text-white/40 font-bold">Loading room status...</div>;

    return (
        <div className="flex-1 min-h-screen p-4 lg:p-8" style={{ background: '#000000' }}>
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
                            ? 'bg-gold text-black shadow-lg shadow-gold/20'
                            : 'bg-navy-surface text-white/50 border border-gold/15 hover:border-gold/35 hover:text-white'
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
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-xl relative overflow-hidden ${room.status === 'AVAILABLE' ? 'bg-gold/[0.06] border-gold/30 hover:bg-gold/[0.1]' :
                            room.status === 'OCCUPIED' ? 'bg-gold/[0.04] border-gold/20 hover:bg-gold/[0.07]' :
                                room.status === 'CLEANING' ? 'bg-blue-900/20 border-blue-400/25 hover:bg-blue-900/30' :
                                    'bg-white/[0.03] border-white/10'
                            }`}
                    >
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-2xl font-black ${room.status === 'AVAILABLE' ? 'text-gold' :
                                room.status === 'OCCUPIED' ? 'text-gold-light' :
                                    room.status === 'CLEANING' ? 'text-blue-400' :
                                        'text-white/40'
                                }`}>{room.number}</span>
                            <span className="material-icons-outlined text-sm text-white/30">
                                {room.status === 'AVAILABLE' ? 'check_circle' :
                                    room.status === 'OCCUPIED' ? 'person' :
                                        room.status === 'CLEANING' ? 'cleaning_services' :
                                            'build'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{room.type}</p>
                            <p className="text-sm font-bold text-white/70">
                                {room.status === 'OCCUPIED' ? 'Guest In-Room' : room.status.charAt(0) + room.status.slice(1).toLowerCase()}
                            </p>
                            <button className="mt-4 w-full py-2 bg-white/[0.04] border border-gold/15 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/40 hover:border-gold/35 hover:text-gold transition-colors">
                                Manage Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRooms.length === 0 && (
                <div className="text-center py-20 bg-navy-surface rounded-3xl border border-dashed border-gold/15 mt-4">
                    <span className="material-icons-outlined text-4xl text-white/20 mb-2 block">hotel</span>
                    <p className="text-white/40 font-bold">No rooms found with this status.</p>
                </div>
            )}
        </div>
    );
}
