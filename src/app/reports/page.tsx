'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Reports() {
  const { data, error, isLoading } = useSWR('/api/reports', fetcher);

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Intelligence Data...</div>;
  if (!data) return <div className="p-8 text-red-500 font-bold text-center">Failed to synchronize reporting metrics</div>;

  const summary = data.summary || { totalRevenue: 0, avgOccupancy: 0, totalBookings: 0 };
  const records = data.records || [];

  return (
    <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          aside, nav { display: none !important; }
          main { margin-left: 0 !important; padding: 0 !important; }
        }
      `}</style>
      <TopBar
        title="Business Intelligence"
        description="Real-time occupancy analytics and revenue performance metrics for Casa Hotel."
        actions={
          <div className="flex gap-2">
            <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm">
              <span className="material-icons-outlined text-[20px]">filter_list</span>
            </button>
            <button className="bg-primary hover:bg-opacity-90 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20" onClick={() => window.print()}>
              <span className="material-icons-outlined text-[18px]">download</span>
              Export Report
            </button>
          </div>
        }
      />

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `RWF ${summary.totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: 'payments', color: 'primary' },
          { label: 'Avg Occupancy', value: `${summary.avgOccupancy.toFixed(1)}%`, trend: '+5.2%', icon: 'bed', color: 'secondary' },
          { label: 'Total Bookings', value: summary.totalBookings.toLocaleString(), trend: '-2.1%', icon: 'book_online', color: 'blue' },
          { label: 'Restaurant Sales', value: 'RWF 3,284,000', trend: '+8.4%', icon: 'restaurant', color: 'orange' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color === 'primary' ? 'primary' : stat.color === 'secondary' ? 'secondary' : stat.color + '-500'}/10 rounded-2xl text-${stat.color === 'primary' ? 'primary' : stat.color === 'secondary' ? 'secondary' : stat.color + '-500'} group-hover:scale-110 transition-transform`}>
                <span className="material-icons-outlined">{stat.icon}</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-secondary/10 text-secondary' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Visual Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-lg tracking-tight text-slate-800 dark:text-white">Occupancy Trends</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly occupancy distribution</p>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm"></span> Deluxe
              </span>
              <span className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-sm"></span> Standard
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="border-t border-slate-100 dark:border-slate-800/50 w-full h-0"></div>)}
            </div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-3 w-full group relative z-10">
                <div className="flex gap-1.5 items-end h-48 w-full justify-center">
                  <div className="w-3 bg-primary rounded-full hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20" style={{ height: `${[80, 40, 90, 65, 75, 100, 95][i]}%` }}></div>
                  <div className="w-3 bg-secondary rounded-full hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-secondary/20" style={{ height: `${[60, 30, 75, 85, 55, 90, 80][i]}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-lg tracking-tight text-slate-800 dark:text-white">Revenue Mix</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue by department</p>
            </div>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-icons-outlined">more_horiz</span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-around gap-10">
            <div className="relative w-56 h-56 group">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-xl" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" className="text-slate-100 dark:text-slate-800" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" className="text-primary" strokeWidth="4.5" strokeDasharray="60, 100" />
                <circle cx="18" cy="18" r="15.915" fill="none" className="text-secondary" strokeWidth="4.5" strokeDasharray="25, 100" strokeDashoffset="-60" />
                <circle cx="18" cy="18" r="15.915" fill="none" className="text-blue-500/50" strokeWidth="4.5" strokeDasharray="15, 100" strokeDashoffset="-85" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic">124M</span>
              </div>
            </div>
            <div className="space-y-5 w-full md:w-auto">
              {[
                { label: 'Rooms', val: '60%', raw: '74.7M', color: 'primary' },
                { label: 'Dining', val: '25%', raw: '31.1M', color: 'secondary' },
                { label: 'Events', val: '15%', raw: '18.6M', color: 'blue-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-default w-full md:min-w-[180px]">
                  <div className={`w-2.5 h-10 rounded-full bg-${item.color === 'primary' ? 'primary' : item.color === 'secondary' ? 'secondary' : item.color}`}></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="font-black text-slate-800 dark:text-white text-sm">{item.val} <span className="text-[10px] opacity-40 ml-1">({item.raw})</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Records Table */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex-1 mb-8">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h3 className="font-black text-lg tracking-tight text-slate-800 dark:text-white uppercase italic">Transactional Data</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed room revenue logs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-primary transition-colors">search</span>
              <input className="pl-12 pr-6 py-3 text-xs bg-white dark:bg-slate-800 border-none rounded-2xl focus:ring-1 focus:ring-primary w-full md:w-72 shadow-inner font-bold uppercase tracking-widest placeholder:text-slate-300" placeholder="Search records..." type="text" />
            </div>
            <button className="bg-white dark:bg-slate-800 p-3 rounded-2xl text-slate-400 hover:text-primary transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
              <span className="material-icons-outlined text-[20px]">sort</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-800/10">
                {['Ref ID', 'Guest', 'Nationality', 'Room Type', 'Period', 'Revenue', 'Status'].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map((record: any) => (
                <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      #{record.id.substring(record.id.length - 6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors text-sm">{record.guestName}</p>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{record.nationality}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200/50 dark:border-slate-700/50">{record.roomType}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase">{record.dates}</td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-800 dark:text-white text-sm">RWF {record.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${record.status === 'COMPLETED' ? 'bg-secondary/10 text-secondary' :
                      record.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-primary/10 text-primary'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'COMPLETED' ? 'bg-secondary' :
                        record.status === 'CONFIRMED' ? 'bg-blue-500' :
                          'bg-primary animate-pulse'
                        }`}></span>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {records.length} of {records.length} entries</p>
          <div className="flex gap-2">
            <button className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all disabled:opacity-30 shadow-sm" disabled>
              <span className="material-icons-outlined text-[18px]">chevron_left</span>
            </button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`size-10 rounded-xl text-[10px] font-black transition-all shadow-sm ${p === 1 ? 'bg-primary text-white shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}>
                {p}
              </button>
            ))}
            <button className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary transition-all shadow-sm">
              <span className="material-icons-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
