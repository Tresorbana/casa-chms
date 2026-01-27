'use client';
import React from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';

export default function CmsRequests() {
    return (
        <div className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Website Booking Requests"
                description="Manage incoming reservations and inquiries from the official hotel website."
                actions={
                    <button className="bg-secondary text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
                        <span className="material-icons-round text-base">add</span>
                        New Reservation
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Requests', value: '124', color: 'slate' },
                    { label: 'Pending Action', value: '12', color: 'yellow' },
                    { label: 'Contacted', value: '48', color: 'blue' },
                    { label: 'Confirmed', value: '64', color: 'secondary' }
                ].map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-${stat.color === 'secondary' ? 'secondary' : stat.color + '-500'}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Recent Inquiries</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1.5 text-xs font-black bg-primary text-white rounded-lg shadow-lg shadow-primary/20">All</button>
                        <button className="px-4 py-1.5 text-xs font-black text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all">Pending</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dates</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Type</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[
                                { name: 'Elena Rodriguez', email: 'elena.rod@example.com', dates: 'Oct 24 - Oct 28', type: 'Deluxe Suite', status: 'Pending', color: 'yellow' },
                                { name: 'Marcus Chen', email: 'chen.marcus@globex.com', dates: 'Nov 02 - Nov 05', type: 'Standard King', status: 'Contacted', color: 'blue' },
                                { name: 'Sarah Jenkins', email: 's.jenkins@webmail.com', dates: 'Oct 28 - Nov 01', type: 'Ocean View', status: 'Confirmed', color: 'green' }
                            ].map((req, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase tracking-tighter">
                                                {req.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors">{req.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">{req.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <span className="material-icons-round text-slate-400 text-lg">calendar_today</span>
                                            {req.dates}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{req.type}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${req.color}-500/10 text-${req.color === 'green' ? 'secondary' : req.color + '-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-${req.color === 'green' ? 'secondary' : req.color + '-500'} mr-2`}></span>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Review</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
