'use client';
import React from 'react';
import TopBar from '@/components/TopBar';

export default function CMSRequests() {
    const stats = [
        { label: 'Total Requests', value: '142', icon: 'forum', color: 'primary' },
        { label: 'Pending Review', value: '12', icon: 'pending_actions', color: 'secondary' },
        { label: 'Contacted', value: '89', icon: 'mark_email_read', color: 'blue-500' },
        { label: 'Confirmed', value: '41', icon: 'verified', color: 'green-500' }
    ];

    const inquiries = [
        { name: 'Sarah Wilson', email: 'sarah.w@gmail.com', room: 'Deluxe Suite', dates: 'Dec 12 - Dec 15', time: '10 mins ago', color: 'primary' },
        { name: 'Michael Chen', email: 'm.chen@outlook.com', room: 'Standard Twin', dates: 'Jan 05 - Jan 10', time: '2 hours ago', color: 'secondary' },
        { name: 'Aline Umutoni', email: 'aline.u@rw.link', room: 'Executive Queen', dates: 'Feb 14 - Feb 16', time: '1 day ago', color: 'blue-500' }
    ];

    return (
        <div className="flex-1 min-h-screen p-4 lg:p-8 flex flex-col gap-8 bg-slate-50 dark:bg-slate-950">
            <TopBar
                title="Digital Inquiries"
                description="Review and manage incoming booking requests from the guest-facing website."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
                        <div className={`w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center grayscale group-hover:grayscale-0 transition-all`}>
                            <span className="material-icons-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-2xl font-black italic tracking-tighter uppercase">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex-1">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Recent Web Inquiries</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Unread First</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Guest Identity</th>
                                <th className="px-8 py-4">Preferences</th>
                                <th className="px-8 py-4">Received</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {inquiries.map((req, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-slate-800 dark:text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{req.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{req.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{req.room}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{req.dates}</p>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {req.time}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="px-6 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg active:scale-95">
                                            Process Inquiry
                                        </button>
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
