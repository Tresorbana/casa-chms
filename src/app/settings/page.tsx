'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Settings() {
    const { data: user } = useSWR('/api/auth/me', fetcher);
    const { data: users, isLoading: usersLoading } = useSWR('/api/users', fetcher);
    const { data: notificationData } = useSWR('/api/notifications', fetcher);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                mutate('/api/users');
                setIsModalOpen(false);
                setFormData({ name: '', email: '', password: '', role: 'STAFF' });
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (usersLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading System Configuration...</div>;

    return (
        <div className="flex-1 min-h-screen relative p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Security & Control Center"
                description="Manage staff access, financial configurations, and monitor system activity logs."
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-icons-outlined text-base">person_add</span>
                        Create User
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 space-y-8">
                    {/* User Management Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Authenticated Staff</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        <th className="px-8 py-4">Staff Member</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {users?.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                        {u.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 dark:text-white group-hover:text-primary transition-colors italic uppercase">{u.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{u.email} • {u.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-secondary/10 text-secondary">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 animate-pulse"></span>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-slate-400 hover:text-primary transition-colors p-2">
                                                    <span className="material-icons-outlined text-lg">settings</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Audit Log (Mocked as per implementation plan) */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">System Audit Logs</h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All Records</button>
                        </div>
                        <div className="p-8 space-y-4">
                            {usersLoading ? (
                                <div className="text-center text-slate-400 text-xs">Loading logs...</div>
                            ) : (
                                (notificationData && Array.isArray(notificationData) ? notificationData.slice(0, 5) : []).map((log: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${log.type === 'WARNING' ? 'bg-amber-500' : log.type === 'SUCCESS' ? 'bg-primary' : 'bg-blue-500'}`}></div>
                                            <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter truncate max-w-[200px]">{log.message}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-slate-400">System</p>
                                            <p className="text-[9px] font-bold text-slate-400">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Financial Settings */}
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <h3 className="font-black text-xs uppercase tracking-[0.4em] text-slate-400 mb-8 relative z-10">Configuration</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black uppercase italic italic">VAT RATE</span>
                                <span className="text-xl font-black text-primary tracking-tighter">15.0%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black uppercase italic">SERVICE CHARGE</span>
                                <span className="text-xl font-black text-secondary tracking-tighter">10.0%</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-700 pt-6">
                                <span className="text-sm font-black uppercase italic">CURRENCY</span>
                                <span className="text-xl font-black tracking-tighter">RWF</span>
                            </div>
                        </div>
                        <button onClick={() => alert("Protocols synchronized with server.")} className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 active:scale-95">
                            Update Protocols
                        </button>
                    </div>

                    {/* System Info */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400 mb-6">Environment</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                    <span className="material-icons-outlined text-sm">cloud_done</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Region: East Africa</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                                    <span className="material-icons-outlined text-sm">dns</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Version: 3.0.4-LTS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Creation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                            <span className="material-icons-outlined">close</span>
                        </button>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-8">Provision Staff</h2>
                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Official Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner"
                                    placeholder="staff@casahotel.rw"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Access Key</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">System Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold shadow-inner appearance-none"
                                >
                                    <option value="STAFF">GENERAL STAFF</option>
                                    <option value="ADMIN">ADMINISTRATOR</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? 'Provisioning...' : 'Initialize Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
