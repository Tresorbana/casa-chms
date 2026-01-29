'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function OccupancyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

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

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Calendar...</div>;

    const bookings = reportData?.records || [];

    // Calculate stats
    // We can use summary from API or calc local
    const totalRooms = rooms?.length || 1;
    let totalOccupiedDays = 0; // simplified
    // Real calculation would iterate days and sum active bookings

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/50"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(currentYear, currentMonth, d);
        const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

        // Find bookings active on this day
        const activeBookings = bookings.filter((b: any) => {
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            // Normalize to YYYY-MM-DD for comparison or just use timestamps
            // Check if dateObj is between checkIn (inclusive) and checkOut (exclusive usually, but lets say inclusive for occupancy visualization)
            return dateObj >= new Date(checkIn.setHours(0, 0, 0, 0)) && dateObj <= new Date(checkOut.setHours(0, 0, 0, 0));
        });

        days.push(
            <div key={d} className={`min-h-[120px] p-2 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/20 ${isToday ? 'ring-2 ring-olive-leaf ring-inset z-10 bg-olive-leaf/5' : 'bg-white dark:bg-slate-900'}`}>
                <span className={`text-sm font-bold ${isToday ? 'text-olive-leaf' : 'text-slate-500'}`}>{d}</span>
                <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide max-h-[100px]">
                    {activeBookings.map((booking: any) => (
                        <div key={booking.id} className="text-[9px] p-1 rounded font-black truncate border-l-2 shadow-sm bg-copper/10 border-copper text-copper" title={`${booking.guestName} (${booking.roomType})`}>
                            {booking.guestName}
                        </div>
                    ))}
                    {activeBookings.length === 0 && (
                        <div className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-2 text-center">Available</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cornsilk/20 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Occupancy Calendar"
                description="Monitor monthly room allocations and availability."
                actions={
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300">
                            <span className="material-icons-outlined">chevron_left</span>
                        </button>
                        <span className="px-4 font-black text-xs min-w-[150px] text-center uppercase tracking-widest text-slate-700 dark:text-slate-200">
                            {monthNames[currentMonth]} {currentYear}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300">
                            <span className="material-icons-outlined">chevron_right</span>
                        </button>
                    </div>
                }
            />

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex-1">
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-cornsilk/50 dark:bg-slate-800/50">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] uppercase font-black text-olive-leaf tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-1">
                    {days}
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
        </div>
    );
}

