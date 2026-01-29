'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function InquiriesPage() {
    const { data: inquiriesData, isLoading } = useSWR('/api/inquiries', fetcher);
    const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];
    const [filter, setFilter] = useState('ALL');

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        await fetch('/api/inquiries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        mutate('/api/inquiries');
    };

    const filteredInquiries = inquiries?.filter((inq: any) =>
        filter === 'ALL' ? true : inq.status === filter
    );

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Inquiries...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Web Inquiries"
                description="Manage messages and booking requests from the website."
                actions={
                    <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        {['ALL', 'NEW', 'READ', 'REPLIED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === status ? 'bg-olive-leaf text-white shadow-md' : 'text-slate-500 hover:text-olive-leaf'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="grid gap-4">
                {filteredInquiries?.map((inq: any) => (
                    <div key={inq.id} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${inq.status === 'NEW' ? 'border-olive-leaf shadow-md shadow-olive-leaf/10' : 'border-slate-100 dark:border-slate-800'} transition-all hover:shadow-lg`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${inq.status === 'NEW' ? 'bg-olive-leaf' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    {inq.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">{inq.name}</h3>
                                    <p className="text-xs text-slate-500">{inq.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
                                    {new Date(inq.createdAt).toLocaleDateString()}
                                </span>
                                {inq.status === 'NEW' && (
                                    <button onClick={() => handleStatusUpdate(inq.id, 'READ')} className="text-xs font-bold text-olive-leaf border border-olive-leaf px-3 py-1 rounded-lg hover:bg-olive-leaf hover:text-white transition-colors">
                                        Mark Read
                                    </button>
                                )}
                                <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`} className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1">
                                    <span className="material-icons-outlined text-sm">reply</span> Reply
                                </a>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-3">
                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">{inq.subject}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{inq.message}</p>
                        </div>
                        {inq.status !== 'NEW' && (
                            <div className="flex justify-end">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase tracking-widest`}>
                                    Status: {inq.status}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
                {(!filteredInquiries || filteredInquiries.length === 0) && (
                    <div className="text-center py-20 opacity-50">
                        <span className="material-icons-outlined text-6xl text-slate-300 mb-4">inbox</span>
                        <p className="text-xl font-bold text-slate-400">No inquiries found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
