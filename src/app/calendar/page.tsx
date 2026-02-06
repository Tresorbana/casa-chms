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

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Calendar...</div>;

    const bookings = reportData?.records || [];

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50 border border-slate-100"></div>);
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
                className={`min-h-[120px] p-2 border border-slate-100 flex flex-col gap-1 transition-all hover:bg-slate-50 cursor-pointer group ${isToday ? 'ring-2 ring-olive-leaf ring-inset z-10 bg-olive-leaf/5' : 'bg-white'}`}
            >
                <div className="flex justify-between items-start">
                    <span className={`text-sm font-bold ${isToday ? 'text-olive-leaf' : 'text-slate-500'}`}>{d}</span>
                    {activeBookings.length > 2 && (
                        <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                            +{activeBookings.length - 2} More
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1 overflow-hidden max-h-[100px]">
                    {activeBookings.slice(0, 3).map((booking: any) => {
                        const isConference = booking.type === 'CONFERENCE';
                        return (
                            <div
                                key={booking.id}
                                className={`text-[9px] p-1 rounded font-black truncate border-l-2 shadow-sm ${isConference
                                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                                    : 'bg-copper/10 border-copper text-copper'
                                    }`}
                                title={`${booking.guestName} (${isConference ? 'Event' : 'Room ' + booking.roomNumber})`}
                            >
                                <span className="opacity-60 mr-1">{isConference ? '📅' : `#${booking.roomNumber}`}</span>
                                {booking.guestName}
                            </div>
                        );
                    })}
                    {activeBookings.length === 0 && (
                        <div className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2 text-center group-hover:text-primary/40 transition-colors">Available</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cornsilk/20 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Occupancy Calendar"
                description="Monitor monthly room stays and availability."
                actions={
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsConferenceModalOpen(true)}
                            className="bg-white border border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-[0.2em] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm hover:scale-[1.02] transition-all"
                        >
                            <span className="material-icons-outlined text-sm">event</span>
                            Book Event
                        </button>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                                <span className="material-icons-outlined">chevron_left</span>
                            </button>
                            <span className="px-4 font-black text-xs min-w-[150px] text-center uppercase tracking-widest text-slate-700">
                                {monthNames[currentMonth]} {currentYear}
                            </span>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                                <span className="material-icons-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                }
            />

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex-1 overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-7 border-b border-slate-200 bg-cornsilk/50">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="py-4 text-center text-[10px] uppercase font-black text-olive-leaf tracking-widest">{day}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 flex-1">
                        {days}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black-forest text-cornsilk p-6 rounded-[2rem] shadow-lg flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                        <span className="material-icons-outlined text-2xl">event_available</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Total Bookings</p>
                        <p className="text-2xl font-black">{bookings.length}</p>
                    </div>
                </div>
                {/* Add more stats if needed */}
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
                        window.location.reload(); // Simple reload to refresh data
                    }}
                />
            )}
        </div>
    );
}

