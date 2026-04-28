'use client';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function NotificationsPage() {
    const { data: notificationsData, isLoading } = useSWR('/api/notifications', fetcher, {
        refreshInterval: 30000,
    });
    const notifications: any[] = Array.isArray(notificationsData) ? notificationsData : [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = async (id: string) => {
        if (id.startsWith('inq-') || id.startsWith('out-') || id.startsWith('in-')) return;
        await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        mutate('/api/notifications');
    };

    const markAllRead = async () => {
        const storedUnread = notifications.filter(n => !n.isRead && !n.id.startsWith('inq-') && !n.id.startsWith('out-') && !n.id.startsWith('in-'));
        await Promise.all(storedUnread.map(n =>
            fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) })
        ));
        mutate('/api/notifications');
    };

    const iconFor = (type: string) => type === 'WARNING' ? 'warning' : type === 'SUCCESS' ? 'check_circle' : 'info';
    const colorFor = (type: string) =>
        type === 'WARNING' ? 'bg-amber-400/10 text-amber-400' : type === 'SUCCESS' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-gold/10 text-gold';

    return (
        <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
            <TopBar
                title="Notifications"
                description="System alerts, check-ins, check-outs, and web inquiries."
                actions={
                    unreadCount > 0 ? (
                        <button
                            onClick={markAllRead}
                            className="bg-gold text-black px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-gold/20 hover:bg-gold-light flex items-center gap-2"
                        >
                            <span className="material-icons-outlined text-sm">done_all</span>
                            Mark All Read
                        </button>
                    ) : undefined
                }
            />

            <div className="max-w-3xl mx-auto w-full space-y-3">
                {isLoading ? (
                    <div className="py-20 text-center text-white/30 font-bold animate-pulse">
                        <span className="material-icons-outlined text-4xl block mb-3">notifications</span>
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-20 text-center text-white/25">
                        <span className="material-icons-outlined text-5xl block mb-4 opacity-30">notifications_none</span>
                        <p className="font-bold text-lg text-white/40">All caught up!</p>
                        <p className="text-sm mt-1 text-white/25">No notifications at the moment.</p>
                    </div>
                ) : (
                    <>
                        {unreadCount > 0 && (
                            <p className="text-xs font-black text-gold/40 uppercase tracking-widest px-2 mb-4">
                                {unreadCount} Unread Notification{unreadCount > 1 ? 's' : ''}
                            </p>
                        )}
                        {notifications.map((notif: any) => (
                            <div
                                key={notif.id}
                                onClick={() => !notif.isRead && markAsRead(notif.id)}
                                className={`relative flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${notif.isRead
                                        ? 'bg-navy-surface border-gold/[0.08] opacity-50 hover:opacity-70'
                                        : 'bg-navy-surface border-gold/25 shadow-md shadow-gold/5 hover:shadow-lg hover:shadow-gold/10 hover:border-gold/35'
                                    }`}
                            >
                                {/* Unread indicator */}
                                {!notif.isRead && (
                                    <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-gold rounded-full animate-pulse" />
                                )}

                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorFor(notif.type)}`}>
                                    <span className="material-icons-outlined text-xl">{iconFor(notif.type)}</span>
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                    <p className={`font-bold text-sm leading-snug ${notif.isRead ? 'text-white/40' : 'text-white'}`}>
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${notif.type === 'WARNING' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                                                notif.type === 'SUCCESS' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                                                    'bg-gold/10 text-gold border-gold/20'
                                            }`}>{notif.type}</span>
                                        <span className="text-xs text-white/25 font-medium">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
