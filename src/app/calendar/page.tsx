'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import DayBookingsModal from '@/components/DayBookingsModal';

import ConferenceBookingModal from '@/components/ConferenceBookingModal';

export default function OccupancyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedBookings, setSelectedBookings] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);

    // Fetch bookings via reports API. We need start/end of month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const { data: reportData, isLoading } = useSWR(`/api/reports?start=${startOfMonth}&end=${endOfMonth}`, fetcher);
    // Also fetch rooms to calculate occupancy correctly if needed
    const { data: rooms } = useSWR('/api/rooms', fetcher);

    // Helpers
    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    const handleDateClick = (date: Date, dayBookings: any[]) => {
        setSelectedDate(date);
        setSelectedBookings(dayBookings);
        setIsModalOpen(true);
    };

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-gold/40">Loading Calendar...</div>;

    const bookings = reportData?.records || [];

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-black/50 border border-gold/[0.06]"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(currentYear, currentMonth, d);
        const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

        // Find bookings active on this day
        const activeBookings = bookings.filter((b: any) => {
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            return dateObj >= new Date(checkIn.setHours(0, 0, 0, 0)) && dateObj <= new Date(checkOut.setHours(0, 0, 0, 0));
        });

        days.push(
            <div
                key={d}
                onClick={() => handleDateClick(dateObj, activeBookings)}
                className={`min-h-[100px] p-2 border flex flex-col gap-1 transition-all hover:bg-gold/[0.04] cursor-pointer group ${isToday
                    ? 'ring-1 ring-gold/50 ring-inset z-10 bg-gold/[0.06] border-gold/25'
                    : 'bg-navy-surface border-gold/[0.07] hover:border-gold/20'
                    }`}
            >
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-bold ${isToday ? 'text-gold' : 'text-white/40'}`}>{d}</span>
                    {activeBookings.length > 2 && (
                        <span className="text-[8px] font-black bg-gold/10 text-gold px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                            +{activeBookings.length - 2}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden max-h-[80px]">
                    {activeBookings.slice(0, 3).map((booking: any) => {
                        const isConference = booking.type === 'CONFERENCE';
                        return (
                            <div
                                key={booking.id}
                                className={`text-[9px] p-1 rounded font-black truncate border-l-2 ${isConference
                                    ? 'bg-purple-900/30 border-purple-400/60 text-purple-300'
                                    : 'bg-gold/[0.08] border-gold/50 text-gold/80'
                                    }`}
                                title={`${booking.guestName} (${isConference ? 'Event' : 'Room ' + booking.roomNumber})`}
                            >
                                <span className="opacity-60 mr-1">{isConference ? '📅' : `#${booking.roomNumber}`}</span>
                                {booking.guestName}
                            </div>
                        );
                    })}
                    {activeBookings.length === 0 && (
                        <div className="text-[8px] text-white/15 font-bold uppercase tracking-widest mt-2 text-center group-hover:text-gold/30 transition-colors">Available</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Occupancy Calendar"
                description="Monitor monthly room stays and availability."
                actions={
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsConferenceModalOpen(true)}
                            className="bg-navy-surface border border-gold/25 text-white/70 font-black uppercase text-[10px] tracking-[0.2em] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:border-gold/50 hover:text-gold transition-all"
                        >
                            <span className="material-icons-outlined text-sm">event</span>
                            Book Event
                        </button>
                        <div className="flex items-center gap-2 bg-navy-surface border border-gold/20 p-1 rounded-xl shadow-sm">
                            <button onClick={prevMonth} className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-white/50 hover:text-gold">
                                <span className="material-icons-outlined">chevron_left</span>
                            </button>
                            <span className="px-4 font-black text-xs min-w-[150px] text-center uppercase tracking-widest text-white/70">
                                {monthNames[currentMonth]} {currentYear}
                            </span>
                            <button onClick={nextMonth} className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-white/50 hover:text-gold">
                                <span className="material-icons-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                }
            />

            <div className="bg-navy-surface rounded-[2rem] border border-gold/15 shadow-xl shadow-black/30 overflow-hidden flex-1 overflow-x-auto relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="min-w-[700px]">
                    <div className="grid grid-cols-7 border-b border-gold/[0.1] bg-black/20">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="py-4 text-center text-[10px] uppercase font-black text-gold/50 tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 flex-1">
                        {days}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-navy-surface p-6 rounded-[1.5rem] shadow-lg border border-gold/15 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/50 to-transparent" />
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold ring-1 ring-gold/20">
                        <span className="material-icons-outlined text-2xl">event_available</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Bookings</p>
                        <p className="text-2xl font-black text-white">{bookings.length}</p>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedDate && (
                <DayBookingsModal
                    date={selectedDate}
                    bookings={selectedBookings}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isConferenceModalOpen && (
                <ConferenceBookingModal
                    onClose={() => setIsConferenceModalOpen(false)}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
