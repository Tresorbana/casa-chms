'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function InquiriesPage() {
    const { data: inquiriesData, isLoading } = useSWR('/api/inquiries', fetcher);
    const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];
    const [filter, setFilter] = useState('ALL');

    const filteredInquiries = inquiries?.filter((inq: any) =>
        filter === 'ALL' ? true : inq.status === filter
    );


    const handleStatusUpdate = async (id: string, newStatus: string, response?: string) => {
        await fetch('/api/inquiries', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus, response })
        });
        mutate('/api/inquiries');
    };

    const InquiryCard = ({ inq }: { inq: any }) => {
        const [replyText, setReplyText] = useState('');
        const [isReplying, setIsReplying] = useState(false);

        return (
            <div className={`bg-white p-6 rounded-2xl border ${inq.status === 'NEW' ? 'border-olive-leaf shadow-md shadow-olive-leaf/10' : 'border-slate-100'} transition-all hover:shadow-lg`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${inq.status === 'NEW' ? 'bg-olive-leaf' : 'bg-slate-300'}`}>
                            {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{inq.name}</h3>
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
                        <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1"
                        >
                            <span className="material-icons-outlined text-sm">reply</span> {inq.response ? 'Update Reply' : 'Reply'}
                        </button>
                    </div>
                </div>

                {inq.checkIn && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-olive-leaf/5 rounded-xl border border-olive-leaf/10">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Check In</p>
                            <p className="text-sm font-semibold">{new Date(inq.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Check Out</p>
                            <p className="text-sm font-semibold">{new Date(inq.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Guests</p>
                            <p className="text-sm font-semibold">{inq.guests}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Room Type</p>
                            <p className="text-sm font-semibold capitalize">{inq.roomType}</p>
                        </div>
                    </div>
                )}

                <div className="bg-slate-50 p-4 rounded-xl mb-3">
                    <h4 className="font-bold text-sm text-slate-700 mb-2">{inq.subject}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{inq.message}</p>
                </div>

                {inq.response && (
                    <div className="bg-blue-50 p-4 rounded-xl mb-3 border border-blue-100">
                        <h4 className="font-bold text-sm text-blue-700 mb-2">Our Response</h4>
                        <p className="text-sm text-blue-600 leading-relaxed">{inq.response}</p>
                    </div>
                )}

                {isReplying && (
                    <div className="mt-4 p-4 border-t border-slate-100">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-olive-leaf outline-none mb-3"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsReplying(false)} className="text-xs font-bold text-slate-500 px-4 py-2">Cancel</button>
                            <button 
                                onClick={() => {
                                    handleStatusUpdate(inq.id, 'REPLIED', replyText);
                                    setIsReplying(false);
                                }}
                                className="text-xs font-bold text-white bg-olive-leaf px-4 py-2 rounded-lg"
                            >
                                Send Response
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${inq.status === 'NEW' ? 'bg-olive-leaf/10 text-olive-leaf' : inq.status === 'REPLIED' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        {inq.status}
                    </span>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Inquiries...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Web Inquiries"
                description="Manage messages and booking requests from the website."
                actions={
                    <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-200">
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
                    <InquiryCard key={inq.id} inq={inq} />
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

