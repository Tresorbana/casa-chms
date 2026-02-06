'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface TopBarProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export default function TopBar({ title, description, actions }: TopBarProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUser(data.user);
            });
    }, []);

    const { data: notificationsData } = useSWR('/api/notifications', fetcher);
    const notifications = Array.isArray(notificationsData) ? notificationsData.slice(0, 5).map((n: any) => ({
        id: n.id,
        text: n.message,
        time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: n.type === 'WARNING' ? 'warning' : n.type === 'SUCCESS' ? 'check_circle' : 'info',
        color: n.type === 'WARNING' ? 'text-amber-500' : n.type === 'SUCCESS' ? 'text-primary' : 'text-blue-500'
    })) : [];

    return (
        <div className={`py-6 mb-8 flex flex-col gap-6 md:flex-row md:items-end justify-between transition-all duration-300 ${scrolled ? 'py-4' : ''}`}>
            <div className="pl-14 lg:pl-0 transition-all">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 leading-none mb-2">{title}</h1>
                {description && <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>}
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
                {/* Actions */}
                {actions && <div className="flex items-center gap-3">{actions}</div>}

                {/* Search */}
                <div className="relative hidden sm:block">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm w-48 lg:w-64 transition-all shadow-sm"
                        placeholder="Search everything..."
                        type="text"
                    />
                </div>


                {/* Notifications */}
                <div className="relative">
                    <button
                        className={`p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary transition-all shadow-sm hover:shadow-md relative ${showNotifications ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <span className="material-icons-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-200">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500">Notifications</h3>
                                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((n) => (
                                        <button key={n.id} className="w-full text-left p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 flex gap-3 items-start group">
                                            <div className={`p-2 rounded-lg bg-slate-100 ${n.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <span className="material-icons-outlined text-sm">{n.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-slate-800">{n.text}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{n.time}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <Link href="/notifications" className="block w-full py-3 text-xs font-bold text-center text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest">View All Notifications</Link>
                            </div>
                        </>
                    )}
                </div>

                {/* User Profile */}
                <div className="h-10 w-px bg-slate-200 hidden lg:block mx-1"></div>
                <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-black text-slate-800 truncate max-w-[120px] uppercase tracking-tighter italic">{user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.role || 'Staff'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 ring-2 ring-white">
                        {user?.name ? user.name[0].toUpperCase() : 'G'}
                    </div>
                </Link>
            </div>
        </div>
    );
}
