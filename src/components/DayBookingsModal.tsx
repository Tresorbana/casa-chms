'use client';
import React from 'react';

interface Booking {
    id: string;
    type?: 'ROOM' | 'CONFERENCE';
    guestName: string;
    roomNumber: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    revenue: number;
    status: string;
}

interface DayBookingsModalProps {
    date: Date;
    bookings: Booking[];
    onClose: () => void;
}

export default function DayBookingsModal({ date, bookings, onClose }: DayBookingsModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-slate-800">
                            Daily Bookings
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                            Booking List for {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group"
                    >
                        <span className="material-icons-outlined text-xl group-hover:rotate-90 transition-transform">close</span>
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {bookings.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons-outlined text-3xl">event_busy</span>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No rooms reserved for this date.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter italic ${booking.type === 'CONFERENCE' ? 'bg-purple-500' : 'bg-primary'}`}>
                                                    {booking.type === 'CONFERENCE' ? booking.roomNumber : `Room ${booking.roomNumber}`}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                    {booking.roomType}
                                                </span>
                                            </div>
                                            <h4 className={`text-xl font-black italic tracking-tighter uppercase group-hover:transition-colors ${booking.type === 'CONFERENCE' ? 'text-purple-900 group-hover:text-purple-600' : 'text-slate-800 group-hover:text-primary'}`}>
                                                {booking.guestName}
                                            </h4>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Revenue</p>
                                            <p className="text-lg font-black text-olive-leaf italic tracking-tighter">
                                                RWF {booking.revenue.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-6 pt-4 border-t border-slate-50 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-sm text-slate-300">calendar_today</span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${booking.status === 'CHECKED_IN' ? 'bg-secondary' : booking.type === 'CONFERENCE' ? 'bg-purple-500' : 'bg-primary'}`}></span>
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Bookings</p>
                        <p className="text-xl font-black text-slate-800 italic tracking-tighter uppercase">
                            {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'} Found
                        </p>
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                        Casa Management System v3.0
                    </p>
                </div>
            </div>
        </div>
    );
}
