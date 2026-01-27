'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomTimeline() {
    const { data: rooms, error, isLoading } = useSWR('/api/rooms', fetcher);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading timeline...</div>;

    return (
        <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-6">
            <TopBar
                title="Room Availability Timeline"
                description="Live view of room allocations, bookings, and housekeeping status."
                actions={
                    <div className="flex gap-2">
                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">add</span>
                            New Booking
                        </button>
                    </div>
                }
            />

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="w-48 p-4 font-bold text-slate-400 text-[10px] uppercase tracking-widest border-r border-slate-100 dark:border-slate-800">Room Info</div>
                    <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="flex-1 min-w-[120px] p-4 text-center border-r border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Oct {15 + i}</p>
                                <p className="text-sm font-black">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto">
                    {rooms?.map((room: any) => (
                        <div key={room.id} className="flex hover:bg-slate-50 transition-colors">
                            <div className="w-48 p-4 border-r border-slate-100 dark:border-slate-800">
                                <p className="font-bold text-slate-800 dark:text-white">Room {room.number}</p>
                                <p className="text-[10px] uppercase text-slate-400 font-bold">{room.type}</p>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block ${room.status === 'AVAILABLE' ? 'bg-secondary/10 text-secondary' :
                                        room.status === 'OCCUPIED' ? 'bg-primary/10 text-primary' :
                                            'bg-slate-100 text-slate-500'
                                    }`}>{room.status}</span>
                            </div>
                            <div className="flex-1 flex overflow-x-auto scrollbar-hide relative min-h-[80px]">
                                {room.status === 'OCCUPIED' && (
                                    <div className="absolute top-4 left-4 right-10 h-10 bg-primary/20 border-l-4 border-primary rounded flex items-center px-4">
                                        <p className="text-xs font-bold text-primary truncate">Guest In-Room - RWF {room.price?.toLocaleString() || '0'}/night</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
