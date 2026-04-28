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
            <div className={`bg-navy-surface p-6 rounded-2xl border transition-all hover:shadow-lg relative overflow-hidden ${inq.status === 'NEW' ? 'border-gold/30 shadow-md shadow-gold/5' : 'border-gold/[0.08]'}`}>
                <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/50 to-transparent" />
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-black ${inq.status === 'NEW' ? 'bg-gold' : 'bg-white/20 text-white'}`}>
                            {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{inq.name}</h3>
                            <p className="text-xs text-white/35">{inq.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mr-2">
                            {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                        {inq.status === 'NEW' && (
                            <button onClick={() => handleStatusUpdate(inq.id, 'READ')} className="text-xs font-bold text-gold border border-gold/30 px-3 py-1 rounded-lg hover:bg-gold hover:text-black transition-colors">
                                Mark Read
                            </button>
                        )}
                        <a
                            href={`mailto:${inq.email}?subject=Regarding your inquiry: ${inq.subject || 'Booking Request'}`}
                            className="text-xs font-bold text-gold border border-gold/30 px-3 py-1 rounded-lg hover:bg-gold hover:text-black transition-colors flex items-center gap-1"
                        >
                            <span className="material-icons-outlined text-sm">email</span> Email
                        </a>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-bold text-black bg-gold px-3 py-1 rounded-lg hover:bg-gold-light transition-colors shadow-sm flex items-center gap-1"
                        >
                            <span className="material-icons-outlined text-sm">reply</span> {inq.response ? 'Update Reply' : 'Reply'}
                        </button>
                    </div>
                </div>

                {inq.checkIn && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gold/[0.05] rounded-xl border border-gold/15">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/30">Check In</p>
                            <p className="text-sm font-semibold text-white">{new Date(inq.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/30">Check Out</p>
                            <p className="text-sm font-semibold text-white">{new Date(inq.checkOut).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/30">Guests</p>
                            <p className="text-sm font-semibold text-white">{inq.guests}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-white/30">Room Type</p>
                            <p className="text-sm font-semibold text-white capitalize">{inq.roomType}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white/[0.04] p-4 rounded-xl mb-3 border border-white/[0.06]">
                    <h4 className="font-bold text-sm text-gold/80 mb-2">{inq.subject}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{inq.message}</p>
                </div>

                {inq.response && (
                    <div className="bg-gold/[0.05] p-4 rounded-xl mb-3 border border-gold/20">
                        <h4 className="font-bold text-sm text-gold mb-2">Our Response</h4>
                        <p className="text-sm text-gold/70 leading-relaxed">{inq.response}</p>
                    </div>
                )}

                {isReplying && (
                    <div className="mt-4 p-4 border-t border-gold/[0.1]">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response here..."
                            className="w-full p-3 text-sm border border-gold/20 bg-[#0a0a0a] text-white placeholder:text-white/25 rounded-xl focus:ring-2 focus:ring-gold/30 focus:border-gold/40 outline-none mb-3 resize-none"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsReplying(false)} className="text-xs font-bold text-white/40 px-4 py-2 hover:text-white transition-colors">Cancel</button>
                            <button
                                onClick={() => {
                                    handleStatusUpdate(inq.id, 'REPLIED', replyText);
                                    setIsReplying(false);
                                }}
                                className="text-xs font-bold text-black bg-gold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
                            >
                                Send Response
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border ${inq.status === 'NEW' ? 'bg-gold/10 text-gold border-gold/25' : inq.status === 'REPLIED' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 'bg-white/[0.04] text-white/30 border-white/10'}`}>
                        {inq.status}
                    </span>
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="p-8 text-center text-white/30">Loading Inquiries...</div>;

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Web Inquiries"
                description="Manage messages and booking requests from the website."
                actions={
                    <div className="flex gap-2 p-1 bg-navy-surface rounded-xl border border-gold/15">
                        {['ALL', 'NEW', 'READ', 'REPLIED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === status ? 'bg-gold text-black shadow-md' : 'text-white/40 hover:text-gold'}`}
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
                    <div className="text-center py-20">
                        <span className="material-icons-outlined text-6xl text-white/15 mb-4 block">inbox</span>
                        <p className="text-xl font-bold text-white/25">No inquiries found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
