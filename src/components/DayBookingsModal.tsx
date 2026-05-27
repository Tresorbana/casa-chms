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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-2xl rounded-[2rem] overflow-hidden animate-slide-up shadow-2xl" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                {/* Header */}
                <div className="px-8 py-6 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-gold">Daily Bookings</h2>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-0.5">
                            {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                    {bookings.length === 0 ? (
                        <div className="py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-white/15 block mb-3">event_busy</span>
                            <p className="text-[10px] font-black text-white/25 uppercase tracking-widest">No bookings for this date</p>
                        </div>
                    ) : bookings.map((booking) => (
                        <div key={booking.id} className="p-5 rounded-2xl transition-all hover:border-gold/20"
                            style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-black ${booking.type === 'CONFERENCE' ? 'bg-purple-400' : 'bg-gold'}`}>
                                            {booking.type === 'CONFERENCE' ? booking.roomNumber : `Room ${booking.roomNumber}`}
                                        </span>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{booking.roomType}</span>
                                    </div>
                                    <h4 className={`text-lg font-black uppercase tracking-tighter ${booking.type === 'CONFERENCE' ? 'text-purple-400' : 'text-white/80'}`}>
                                        {booking.guestName}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-0.5">Revenue</p>
                                    <p className="font-black text-gold">RWF {booking.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-white/30 uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                    {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${booking.type === 'CONFERENCE' ? 'bg-purple-400' : 'bg-gold'}`} />
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{booking.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-8 py-4 flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
                    <p className="text-sm font-black text-white/50">{bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}</p>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest"> Hotel v3.0</p>
                </div>
            </div>
        </div>
    );
}
