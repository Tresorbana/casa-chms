'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function CMSRequests() {
    const { data: inquiriesData, isLoading } = useSWR('/api/inquiries', fetcher);
    const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];

    const stats = [
        { label: 'Total Requests', value: inquiries.length.toString(), icon: 'forum', color: 'primary' },
        { label: 'Pending Review', value: inquiries.filter((i: any) => i.status === 'NEW').length.toString(), icon: 'pending_actions', color: 'secondary' },
        { label: 'Closed', value: inquiries.filter((i: any) => i.status === 'CLOSED').length.toString(), icon: 'verified', color: 'green-500' },
        { label: 'Responded', value: inquiries.filter((i: any) => i.status === 'RESPONDED').length.toString(), icon: 'mark_email_read', color: 'blue-500' }
    ];

    return (
        <div className="flex-1 min-h-screen p-4 lg:p-8 flex flex-col gap-8 bg-slate-50">
            <TopBar
                title="Digital Inquiries"
                description="Review and manage incoming booking requests from the guest-facing website."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
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

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl flex-1">
                <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Recent Web Inquiries</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Unread First</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Guest Identity</th>
                                <th className="px-8 py-4">Preferences</th>
                                <th className="px-8 py-4">Received</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inquiries.map((req, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-black text-slate-800 uppercase italic tracking-tighter group-hover:text-primary transition-colors">{req.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{req.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-600 uppercase tracking-tighter">{req.subject || 'No Subject'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {req.status}</p>
                                    </td>
                                    <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="px-6 py-2 bg-slate-900 hover:bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg active:scale-95">
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
