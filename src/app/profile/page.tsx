'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function Profile() {
    const { data, error, isLoading } = useSWR('/api/auth/me', fetcher);
    const [isEditing, setIsEditing] = useState(false);

    if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Identity...</div>;

    const user = data?.user || {
        name: 'Guest User',
        email: 'guest@casahotel.rw',
        role: 'STAFF',
        createdAt: new Date().toISOString()
    };

    const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Account Profile"
                description="Manage your professional identity and security settings at Casa Hotel."
            />

            <div className="max-w-4xl mx-auto w-full space-y-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary/30 ring-4 ring-white">
                                {initials}
                            </div>
                            <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-primary hover:scale-110 transition-transform">
                                <span className="material-icons-outlined text-sm">photo_camera</span>
                            </button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{user.name}</h2>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-2 mb-4">{user.role} • CASA HOTEL STAFF</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                    ID: {user.id?.substring(0, 8).toUpperCase() || 'PROVISIONAL'}
                                </span>
                                <span className="px-4 py-1.5 bg-secondary/10 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest border border-secondary/10">
                                    Status: Active
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-sm">{isEditing ? 'save' : 'edit'}</span>
                                {isEditing ? 'Save Profile' : 'Edit Profile'}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-sm">logout</span>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary font-black uppercase italic">
                                <span className="material-icons-outlined text-sm">person</span>
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Identity Details</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                                {isEditing ? (
                                    <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold shadow-inner" />
                                ) : (
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{user.name}</p>
                                )}
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email address</label>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{user.email}</p>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Joined Network</label>
                                <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Security & Access */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-secondary/10 rounded-xl text-secondary font-black uppercase italic">
                                <span className="material-icons-outlined text-sm">shield</span>
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Security & Access</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">System Role</label>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                    <p className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">{user.role}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Password Security</label>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-xl transition-all border border-primary/10">
                                    <span className="material-icons-outlined text-xs">key</span>
                                    Update Security Key
                                </button>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Active Sessions</label>
                                <p className="text-xs font-bold text-slate-500">1 active session on Windows Desktop</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Pattern Footer */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    <h4 className="text-white font-black uppercase italic tracking-tighter text-xl mb-4 relative z-10">Professional Excellence</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.5em] relative z-10">Casa Hotel Management System v3.0</p>
                </div>
            </div>
        </div>
    );
}
