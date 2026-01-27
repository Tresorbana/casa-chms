'use client';
import React from 'react';
import Image from 'next/image';
import TopBar from '@/components/TopBar';

export default function Events() {
  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
      <TopBar
        title="Events & Conference Center"
        description="Manage room schedules, ballroom reservations, and event logistics."
        actions={
          <button className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Event Booking
          </button>
        }
      />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Executive Boardroom', rate: 'RWF 25,000/hr', cap: '15 Pax', status: 'Available', color: 'green' },
          { name: 'Grand Ballroom', rate: 'RWF 150,000/day', cap: '250 Pax', status: 'Occupied', color: 'primary' },
          { name: 'Focus Pod A', rate: 'RWF 8,000/hr', cap: '4 Pax', status: 'Available', color: 'green' },
          { name: 'Creative Studio', rate: 'RWF 12,500/hr', cap: '20 Pax', status: 'Maintenance', color: 'orange' }
        ].map((room, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className={`bg-${room.color === 'primary' ? 'primary' : room.color}-500/10 text-${room.color === 'primary' ? 'primary' : room.color}-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                {room.status}
              </div>
              <span className="text-slate-500 font-bold text-sm tracking-tight">{room.rate}</span>
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight group-hover:text-primary transition-colors">{room.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2 font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">groups</span> {room.cap} capacity
              </p>
            </div>
            <div className="mt-2 flex gap-2">
              <div className={`h-1.5 flex-1 bg-${room.color === 'primary' ? 'primary' : room.color}-500 rounded-full`}></div>
              <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col flex-1">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-inner">
              <button className="px-5 py-2 text-xs font-black rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700">Day</button>
              <button className="px-5 py-2 text-xs font-black rounded-lg bg-primary text-white shadow-lg shadow-primary/30">Week</button>
              <button className="px-5 py-2 text-xs font-black rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-700">Month</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"><span className="material-symbols-outlined">chevron_left</span></button>
              <span className="text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Oct 23 - Oct 29, 2023</span>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl py-2.5 pl-4 pr-10 focus:ring-1 focus:ring-primary shadow-sm appearance-none">
              <option>All Rooms</option>
              <option>Executive Boardroom</option>
              <option>Grand Ballroom</option>
            </select>
            <button className="bg-white dark:bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <div className="p-4"></div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className={`p-4 text-center border-l border-slate-100 dark:border-slate-800 ${i === 1 ? 'bg-primary/5' : ''}`}>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{day}</p>
                  <p className={`text-xl font-black ${i === 1 ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{23 + i}</p>
                </div>
              ))}
            </div>

            <div className="relative h-[400px]">
              {/* Time Rulers (Vertical lines) */}
              <div className="absolute inset-0 grid grid-cols-[80px_repeat(7,1fr)] pointer-events-none">
                <div className="border-r border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20"></div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="border-l border-slate-100 dark:border-slate-800"></div>
                ))}
              </div>

              {/* Example Bookings */}
              <div className="absolute top-12 left-[calc(80px+131px*0+8px)] right-[calc(100%-(80px+131px*1-8px))] h-[120px] bg-primary rounded-2xl p-4 shadow-xl z-10 border-l-4 border-white/50">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">09:00 - 11:00</p>
                <p className="text-sm font-black text-white leading-tight">Meta Regional Summit</p>
                <p className="text-[10px] text-white/70 italic mt-2 font-bold uppercase">Grand Ballroom</p>
              </div>

              <div className="absolute top-32 left-[calc(80px+131px*1+8px)] right-[calc(100%-(80px+131px*2-8px))] h-[180px] bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-2xl p-4 shadow-2xl z-20 border-l-4 border-secondary">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Ongoing</p>
                  <div className="size-2 rounded-full bg-red-500 animate-pulse"></div>
                </div>
                <p className="text-sm font-black leading-tight">Alpha Corp Annual General Meeting</p>
                <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase">09:30 - 12:30</p>
              </div>

              <div className="absolute top-56 left-[calc(80px+131px*2+8px)] right-[calc(100%-(80px+131px*3-8px))] h-[100px] bg-orange-500 rounded-2xl p-4 shadow-xl z-10 border-l-4 border-white/50">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">11:00 - 12:30</p>
                <p className="text-sm font-black text-white leading-tight">Legal Dept Weekly Sync</p>
                <p className="text-[10px] text-white/70 italic mt-2 font-bold uppercase">Executive Pod</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
