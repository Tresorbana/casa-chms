'use client';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';

export default function RoomTimeline() {
  const { data: rooms, error } = useSWR('/api/rooms', fetcher);
  
  // Helper to render bookings would be complex here without a full calendar library,
  // so we'll just list the rooms for now to prove connectivity.

  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="flex h-[calc(100vh-73px)] overflow-hidden ml-64 min-h-screen"><div className="flex justify-end gap-4 mb-4 p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"><button className="px-3 py-1 text-sm font-medium rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all">Day</button><button className="px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-slate-700 shadow-sm">Week</button><button className="px-3 py-1 text-sm font-medium rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all">Month</button><button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => { openManageRoomModal() }}>
<span className="material-icons-outlined text-sm">edit</span>
Manage Room
</button><button className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
<span className="material-icons-outlined text-sm">add</span>
New Booking
</button></div>
<header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">October 15 - October 21, 2023</h2>
<p className="text-slate-500 mt-1">Manage your room_timeline here.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-64 transition-all" placeholder="Search..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative transition-colors">
<span className="material-icons-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</div>
</header>
<div className="flex-1 flex flex-col overflow-hidden">
<div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
<div className="flex items-center gap-4">
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-icons-outlined">chevron_left</span>
</button>
<h2 className="text-lg font-bold">October 15 - October 21, 2023</h2>
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
<span className="material-icons-outlined">chevron_right</span>
</button>
<button className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">Today</button>
</div>
</div>
<div className="flex-1 overflow-x-auto timeline-scroll overflow-y-auto">
<div className="min-w-[1200px]">
<div className="flex sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
<div className="w-48 flex-shrink-0 px-4 py-3 font-semibold text-slate-500 border-r border-slate-200 dark:border-slate-800 flex items-center">
                            Rooms
                        </div>
<div className="flex flex-1">
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Sun</div>
<div className="text-sm font-bold">15</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3 bg-slate-50 dark:bg-slate-800/30">
<div className="text-xs uppercase text-primary">Mon</div>
<div className="text-sm font-bold text-primary">16</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Tue</div>
<div className="text-sm font-bold">17</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Wed</div>
<div className="text-sm font-bold">18</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Thu</div>
<div className="text-sm font-bold">19</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Fri</div>
<div className="text-sm font-bold">20</div>
</div>
<div className="flex-1 text-center border-r border-slate-200 dark:border-slate-800 py-3">
<div className="text-xs uppercase text-slate-400">Sat</div>
<div className="text-sm font-bold">21</div>
</div>
</div>
</div>
<div className="relative">
<div className="absolute inset-0 flex pointer-events-none">
<div className="w-48 border-r border-slate-200 dark:border-slate-800"></div>
<div className="flex-1 flex">
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
<div className="flex-1 border-r border-slate-100 dark:border-slate-800"></div>
</div>
</div>
<div className="divide-y divide-slate-100 dark:divide-slate-800">
{rooms ? rooms.map((room: any) => (
<div key={room.id} className="flex min-h-[72px] relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
<div className="w-48 flex-shrink-0 px-6 py-4 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center">
<span className="font-bold">Room {room.number}</span>
<span className="text-xs text-slate-500">{room.type}</span>
<span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1 w-fit ${
    room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
    room.status === 'OCCUPIED' ? 'bg-red-100 text-red-700' :
    room.status === 'CLEANING' ? 'bg-blue-100 text-blue-700' :
    'bg-gray-100 text-gray-700'
}`}>{room.status}</span>
</div>
<div className="flex-1 relative p-2">
    {/* Simple visualization of bookings if any */}
    {room.bookings && room.bookings.length > 0 && (
        <div className="absolute top-4 left-10 h-10 bg-primary/20 border-l-4 border-primary rounded px-3 py-1 text-xs font-semibold text-primary truncate" style={{ width: '200px' }}>
            {room.bookings[0].guest.name}
        </div>
    )}
</div>
</div>
)) : (
    <div className="p-8 text-center text-slate-500">Loading rooms...</div>
)}
</div>
</div>
</div>
</div>
<footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between text-sm">
<div className="flex gap-6">
<div className="flex items-center gap-2">
<span className="text-slate-500">Occupancy:</span>
<span className="font-bold text-secondary">78%</span>
</div>
<div className="flex items-center gap-2">
<span className="text-slate-500">Available:</span>
<span className="font-bold">12 Rooms</span>
</div>
<div className="flex items-center gap-2">
<span className="text-slate-500">Check-ins:</span>
<span className="font-bold">8</span>
</div>
</div>
<div className="flex items-center gap-4 text-slate-400">
<span className="flex items-center gap-1"><span className="material-icons-outlined text-sm">sync</span> Last updated: 2 mins ago</span>
</div>
</footer>
</div>
</main>


    </div>
  );
}
