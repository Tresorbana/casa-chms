'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function OccupancyCalendar() {
    const { data: rooms, error, isLoading } = useSWR('/api/rooms', fetcher);
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    if (isLoading) return <div className="p-8 text-center">Loading calendar...</div>;

    const days = [];
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/50"></div>);
    }
    for (let d = 1; d <= totalDays; d++) {
        const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
        days.push(
            <div key={d} className={`h-32 p-2 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/20 ${isToday ? 'ring-2 ring-primary ring-inset z-10 bg-primary/5' : 'bg-white dark:bg-slate-900'}`}>
                <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-slate-500'}`}>{d}</span>
                <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide">
                    {/* Visualizing multiple bookings/rooms per day */}
                    {rooms && rooms.slice(0, (d % 3) + 1).map((room: any, idx: number) => (
                        <div key={idx} className={`text-[9px] p-1 rounded font-black truncate border-l-2 shadow-sm ${room.status === 'AVAILABLE' ? 'bg-secondary/10 border-secondary text-secondary' :
                                'bg-primary/10 border-primary text-primary'
                            }`}>
                            Room {room.number} - {room.status === 'AVAILABLE' ? 'VACANT' : 'BOOKED'}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Occupancy Calendar"
                description="Monitor monthly room allocations and availability at a glance."
                actions={
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-icons-outlined">chevron_left</span>
                        </button>
                        <span className="px-4 font-bold text-sm min-w-[150px] text-center">{monthNames[currentMonth]} {currentYear}</span>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-icons-outlined">chevron_right</span>
                        </button>
                    </div>
                }
            />

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex-1">
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] uppercase font-black text-slate-400 tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-1">
                    {days}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                        <span className="material-icons-outlined">event_available</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available</p>
                        <p className="text-xl font-bold">45%</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <span className="material-icons-outlined">event_busy</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Occupied</p>
                        <p className="text-xl font-bold">55%</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                        <span className="material-icons-outlined">upcoming</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arrivals Today</p>
                        <p className="text-xl font-bold">8</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
