'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function RoomTimeline() {
    const { data: rooms, error, isLoading } = useSWR('/api/rooms', fetcher);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading timeline...</div>;

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-6">
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

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <div className="w-48 p-4 font-bold text-slate-400 text-[10px] uppercase tracking-widest border-r border-slate-100">Room Info</div>
                    <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            return (
                                <div key={i} className="flex-1 min-w-[150px] p-4 text-center border-r border-slate-100">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                    <p className="text-sm font-black text-slate-800">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto">
                    {rooms?.map((room: any) => (
                        <div key={room.id} className="flex hover:bg-slate-50 transition-colors">
                            <div className="w-48 p-6 border-r border-slate-100 bg-slate-50/10">
                                <p className="font-black text-slate-800 italic tracking-tighter uppercase">Room {room.number}</p>
                                <p className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">{room.type}</p>
                            </div>
                            <div className="flex-1 flex overflow-x-auto scrollbar-hide">
                                {Array.from({ length: 7 }).map((_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + i);
                                    date.setHours(0, 0, 0, 0);

                                    const nextDay = new Date(date);
                                    nextDay.setDate(date.getDate() + 1);

                                    const bookingOnThisDay = room.bookings?.find((b: any) => {
                                        const checkIn = new Date(b.checkIn);
                                        const checkOut = new Date(b.checkOut);
                                        return checkIn < nextDay && checkOut > date;
                                    });

                                    return (
                                        <div key={i} className="flex-1 min-w-[150px] p-2 border-r border-slate-50 flex items-center justify-center min-h-[80px]">
                                            {bookingOnThisDay ? (
                                                <div className="w-full h-12 bg-primary/10 border-l-4 border-primary rounded-xl p-2 flex flex-col justify-center overflow-hidden">
                                                    <p className="text-[10px] font-black text-primary truncate uppercase">{bookingOnThisDay.guest?.name}</p>
                                                    <p className="text-[8px] font-bold text-primary/60 uppercase">{bookingOnThisDay.status}</p>
                                                </div>
                                            ) : (
                                                <div className="w-full h-8 border border-dashed border-slate-100 rounded-xl flex items-center justify-center bg-slate-50/30 opacity-40">
                                                    <span className="material-icons-outlined text-slate-200 text-sm">add</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
