'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomTimeline() {
    const { data: rooms, isLoading } = useSWR('/api/rooms', fetcher);

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gold/40">Loading timeline...</div>;

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Room Timeline"
                description="Live 7-day view of room allocations and bookings."
            />

            <div className="rounded-[2rem] overflow-hidden relative" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* Header row */}
                <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                    <div className="w-44 flex-shrink-0 p-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/25" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        Room
                    </div>
                    <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                        {days.map((date, i) => {
                            const isToday = i === 0;
                            return (
                                <div key={i} className="flex-1 min-w-[140px] p-4 text-center" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-gold' : 'text-white/25'}`}>
                                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className={`text-sm font-black mt-0.5 ${isToday ? 'text-gold' : 'text-white/50'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Room rows */}
                <div className="overflow-y-auto max-h-[70vh]">
                    {rooms?.map((room: any) => (
                        <div key={room.id} className="flex transition-colors hover:bg-gold/[0.02]" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className="w-44 flex-shrink-0 p-4" style={{ borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                                <p className="font-black text-white/70 uppercase tracking-tighter text-sm">Room {room.number}</p>
                                <p className="text-[9px] uppercase text-white/25 font-black tracking-widest mt-0.5">{room.type}</p>
                            </div>
                            <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                                {days.map((date, i) => {
                                    const nextDay = new Date(date);
                                    nextDay.setDate(date.getDate() + 1);
                                    const booking = room.bookings?.find((b: any) => {
                                        const ci = new Date(b.checkIn);
                                        const co = new Date(b.checkOut);
                                        return ci < nextDay && co > date;
                                    });
                                    return (
                                        <div key={i} className="flex-1 min-w-[140px] p-2 flex items-center justify-center min-h-[72px]" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                                            {booking ? (
                                                <div className="w-full rounded-xl p-2 flex flex-col justify-center overflow-hidden" style={{ background: 'rgba(212,175,55,0.08)', borderLeft: '3px solid rgba(212,175,55,0.5)' }}>
                                                    <p className="text-[9px] font-black text-gold truncate uppercase">{booking.guest?.name}</p>
                                                    <p className="text-[8px] font-bold text-gold/40 uppercase">{booking.status}</p>
                                                </div>
                                            ) : (
                                                <div className="w-full h-8 flex items-center justify-center rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.06)' }}>
                                                    <span className="material-icons-outlined text-white/10 text-sm">add</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {(!rooms || rooms.length === 0) && (
                        <div className="py-20 text-center text-white/20">
                            <span className="material-icons-outlined text-4xl block mb-3">hotel</span>
                            <p className="font-bold text-sm">No rooms found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
