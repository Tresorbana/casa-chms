'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Profile() {
    const { data, isLoading } = useSWR('/api/auth/me', fetcher);
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gold/40">Loading Profile...</div>;

    const user = data?.user || { name: 'Guest User', email: 'guest@casahotel.rw', role: 'STAFF', createdAt: new Date().toISOString() };
    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar title="Account Profile" description="Manage your professional identity and security settings." />

            <div className="max-w-4xl mx-auto w-full space-y-6">
                {/* Profile Header */}
                <div className="rounded-[2rem] overflow-hidden relative" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                    <div className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-[1.5rem] bg-gold flex items-center justify-center text-3xl font-black text-black shadow-gold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-black tracking-tighter uppercase text-gold">{user.name}</h2>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-1">{user.role} &bull; Casa Hotel</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        ID: {user.id?.substring(0, 8).toUpperCase() || 'GUEST'}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                                        Active
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    style={{ background: isEditing ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: isEditing ? '#D4AF37' : 'rgba(255,255,255,0.6)' }}
                                >
                                    <span className="material-icons-outlined text-sm">{isEditing ? 'save' : 'edit'}</span>
                                    {isEditing ? 'Save' : 'Edit'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
                                    style={{ border: '1px solid rgba(248,113,113,0.2)' }}
                                >
                                    <span className="material-icons-outlined text-sm">logout</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-[2rem] p-8" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-gold/10 text-gold">
                                <span className="material-icons-outlined text-sm">person</span>
                            </div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/40">Identity Details</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Display Name</label>
                                {isEditing ? (
                                    <input type="text" defaultValue={user.name} className="w-full rounded-xl px-4 py-3 text-sm font-bold text-white outline-none" style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.25)' }} />
                                ) : (
                                    <p className="text-sm font-bold text-white/80">{user.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Email Address</label>
                                <p className="text-sm font-bold text-white/80">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Joined</label>
                                <p className="text-sm font-bold text-white/80">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] p-8" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-gold/10 text-gold">
                                <span className="material-icons-outlined text-sm">shield</span>
                            </div>
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/40">Security & Access</h3>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">System Role</label>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                    <p className="text-sm font-black text-gold uppercase tracking-tighter">{user.role}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Password Security</label>
                                <button className="text-[10px] font-black text-gold/70 uppercase tracking-widest hover:text-gold flex items-center gap-2 px-4 py-2 rounded-xl transition-all" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                    <span className="material-icons-outlined text-xs">key</span>
                                    Update Security Key
                                </button>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1.5">Active Sessions</label>
                                <p className="text-xs font-bold text-white/40">1 active session</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] p-8 text-center" style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.1)' }}>
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">Casa Hotel Management System &bull; Version 3.0</p>
                </div>
            </div>
        </div>
    );
}
