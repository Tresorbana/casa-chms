'use client';
import React, { useState, useEffect, useRef } from 'react';
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
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => { if (data.user) setUser(data.user); });
    }, []);

    // Poll every 60s for new notifications
    const { data: notificationsData, mutate: refreshNotifs } = useSWR('/api/notifications', fetcher, {
        refreshInterval: 60000,
        dedupingInterval: 30000,
    });

    const allNotifications: any[] = Array.isArray(notificationsData) ? notificationsData : [];
    const unreadCount = allNotifications.filter(n => !n.isRead).length;
    const previewNotifications = allNotifications.slice(0, 6);

    const markAsRead = async (id: string) => {
        if (id.startsWith('inq-') || id.startsWith('out-') || id.startsWith('in-')) {
            // Dynamic notifications — no DB update needed, just refresh
            return;
        }
        await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        refreshNotifs();
    };

    const markAllRead = async () => {
        const storedUnread = allNotifications.filter(n => !n.isRead && !n.id.startsWith('inq-') && !n.id.startsWith('out-') && !n.id.startsWith('in-'));
        await Promise.all(storedUnread.map(n =>
            fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) })
        ));
        refreshNotifs();
    };

    const iconFor = (type: string) => type === 'WARNING' ? 'warning' : type === 'SUCCESS' ? 'check_circle' : 'info';
    const colorFor = (type: string) => type === 'WARNING' ? 'text-amber-500 bg-amber-50' : type === 'SUCCESS' ? 'text-emerald-500 bg-emerald-50' : 'text-blue-500 bg-blue-50';

    return (
        <div className={`py-6 mb-8 flex flex-col gap-6 md:flex-row md:items-end justify-between transition-all duration-300 ${scrolled ? 'py-4' : ''}`}>
            <div className="pl-14 lg:pl-0 transition-all">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 leading-none mb-2">{title}</h1>
                {description && <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>}
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
                {actions && <div className="flex items-center gap-3">{actions}</div>}

                {/* Search */}
                <div className="relative hidden sm:block">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                    <input
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm w-48 lg:w-64 transition-all shadow-sm outline-none"
                        placeholder="Search everything..."
                        type="text"
                    />
                </div>

                {/* Notifications Bell */}
                <div className="relative" ref={panelRef}>
                    <button
                        className={`p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary transition-all shadow-sm hover:shadow-md relative ${showNotifications ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                        onClick={() => setShowNotifications(v => !v)}
                        aria-label="Notifications"
                    >
                        <span className="material-icons-outlined">notifications</span>
                        {/* Only show red dot when there are unread notifications */}
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                                {/* Header */}
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold min-w-[20px] text-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                {/* List */}
                                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                    {previewNotifications.length === 0 ? (
                                        <div className="py-10 text-center text-slate-400 text-sm font-medium">
                                            <span className="material-icons-outlined block text-3xl mb-2 opacity-30">notifications_none</span>
                                            No notifications
                                        </div>
                                    ) : previewNotifications.map((n: any) => (
                                        <button
                                            key={n.id}
                                            onClick={() => markAsRead(n.id)}
                                            className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3 items-start group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                                        >
                                            <div className={`p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform ${colorFor(n.type)}`}>
                                                <span className="material-icons-outlined text-sm">{iconFor(n.type)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold truncate ${n.isRead ? 'text-slate-500' : 'text-slate-800'}`}>{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            {!n.isRead && <span className="w-2 h-2 mt-2 bg-primary rounded-full flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>

                                {/* Footer */}
                                <Link
                                    href="/notifications"
                                    className="block w-full py-3 text-xs font-bold text-center text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest border-t border-slate-100"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Divider + User */}
                <div className="h-10 w-px bg-slate-200 hidden lg:block mx-1" />
                <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-black text-slate-800 truncate max-w-[120px] uppercase tracking-tighter italic">{user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.role || 'Staff'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 ring-2 ring-white">
                        {user?.name ? user.name[0].toUpperCase() : 'G'}
                    </div>
                </Link>
            </div>
        </div>
    );
}
