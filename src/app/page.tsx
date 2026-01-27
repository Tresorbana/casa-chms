'use client';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function Dashboard1() {
  const { data, error, isLoading } = useSWR('/api/dashboard', fetcher);

  if (isLoading) return <div className="ml-64 p-8">Loading...</div>;
  if (error) return <div className="ml-64 p-8">Failed to load data</div>;

  const { stats, rooms } = data;

  return (
    <div className="flex-1 min-h-screen relative">


      <main className="min-h-screen p-8">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/dashboard/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/dashboard/view-3">View 3</a></div><header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
            <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-64" placeholder="Search rooms, guests..." type="text" />
            </div>
            <button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative">
              <span className="material-icons-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                <span className="material-icons-outlined">bed</span>
              </div>
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded">+2.4%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Today's Occupancy</h3>
            <p className="text-3xl font-bold mt-1">78.5%</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: "78.5%" }}></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <span className="material-icons-outlined">payments</span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">On Track</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Total Revenue Today</h3>
            <p className="text-3xl font-bold mt-1">$12,450.00</p>
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
              <span className="material-icons-outlined text-xs text-secondary">trending_up</span>
              15% higher than yesterday
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <span className="material-icons-outlined">pending_actions</span>
              </div>
              <button className="text-xs font-bold text-blue-500 hover:underline">View All</button>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Pending Reservations</h3>
            <p className="text-3xl font-bold mt-1">24</p>
            <p className="text-xs text-slate-400 mt-4">Average response time: 14 mins</p>
          </div>
        </div>
        <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Room Status Grid</h3>
              <p className="text-sm text-slate-500">Live floor-wise status of all hotel units</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-secondary"></span> Available
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-primary"></span> Occupied
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-blue-400"></span> Cleaning
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span> Maintenance
              </div>
            </div>
          </div>
          <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto scrollbar-hide">
            <button className="pb-4 px-2 border-b-2 border-primary text-primary font-semibold whitespace-nowrap">Floor 1 (Lobby Level)</button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-slate-400 hover:text-slate-600 whitespace-nowrap">Floor 2 (Executive)</button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-slate-400 hover:text-slate-600 whitespace-nowrap">Floor 3 (Suites)</button>
            <button className="pb-4 px-2 border-b-2 border-transparent text-slate-400 hover:text-slate-600 whitespace-nowrap">Floor 4 (Penthouse)</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="group relative bg-secondary/5 border-2 border-secondary p-4 rounded-2xl hover:shadow-lg transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-secondary">101</span>
                <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Standard</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Available</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary p-4 rounded-2xl cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-primary">102</span>
                <span className="material-icons-outlined text-primary text-sm">person</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Deluxe</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Mr. Johson</p>
            </div>
            <div className="bg-blue-400/5 border-2 border-blue-400 p-4 rounded-2xl cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-blue-500">103</span>
                <span className="material-icons-outlined text-blue-500 text-sm">cleaning_services</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Standard</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Housekeeping</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary p-4 rounded-2xl cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-primary">104</span>
                <span className="material-icons-outlined text-primary text-sm">person</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Twin</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Ms. Sarah Lee</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 p-4 rounded-2xl cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-slate-400">105</span>
                <span className="material-icons-outlined text-slate-400 text-sm">build</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">King</p>
              <p className="text-xs font-medium text-slate-400 mt-1">Out of Order</p>
            </div>
            <div className="bg-secondary/5 border-2 border-secondary p-4 rounded-2xl cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-secondary">106</span>
                <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Standard</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Available</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-primary">107</span>
                <span className="material-icons-outlined text-primary text-sm">person</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Suite</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Reserved</p>
            </div>
            <div className="bg-secondary/5 border-2 border-secondary p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-secondary">108</span>
                <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Standard</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Available</p>
            </div>
            <div className="bg-secondary/5 border-2 border-secondary p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-secondary">109</span>
                <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Standard</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Available</p>
            </div>
            <div className="bg-blue-400/5 border-2 border-blue-400 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-blue-500">110</span>
                <span className="material-icons-outlined text-blue-500 text-sm">cleaning_services</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Deluxe</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Housekeeping</p>
            </div>
            <div className="bg-primary/5 border-2 border-primary p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-primary">111</span>
                <span className="material-icons-outlined text-primary text-sm">person</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Queen</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Occupied</p>
            </div>
            <div className="bg-secondary/5 border-2 border-secondary p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-secondary">112</span>
                <span className="material-icons-outlined text-secondary text-sm">check_circle</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Deluxe</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1">Available</p>
            </div>
          </div>
        </section>
        <div className="mt-8 flex justify-between items-center text-slate-400 text-xs">
          <p>© 2024 Casa Hotel Management System. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">System Status</a>
            <a className="hover:text-primary" href="#">Contact IT Support</a>
          </div>
        </div>
      </main>

    </div>
  );
}
