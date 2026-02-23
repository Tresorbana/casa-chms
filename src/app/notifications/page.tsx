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
        type === 'WARNING' ? 'bg-amber-100 text-amber-500' : type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-500' : 'bg-blue-100 text-blue-500';

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Notifications"
                description="System alerts, check-ins, check-outs, and web inquiries."
                actions={
                    unreadCount > 0 ? (
                        <button
                            onClick={markAllRead}
                            className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:bg-primary/90 flex items-center gap-2"
                        >
                            <span className="material-icons-outlined text-sm">done_all</span>
                            Mark All Read
                        </button>
                    ) : undefined
                }
            />

            <div className="max-w-3xl mx-auto w-full space-y-3">
                {isLoading ? (
                    <div className="py-20 text-center text-slate-400 font-bold animate-pulse">
                        <span className="material-icons-outlined text-4xl block mb-3">notifications</span>
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        <span className="material-icons-outlined text-5xl block mb-4 opacity-30">notifications_none</span>
                        <p className="font-bold text-lg">All caught up!</p>
                        <p className="text-sm mt-1">No notifications at the moment.</p>
                    </div>
                ) : (
                    <>
                        {unreadCount > 0 && (
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">
                                {unreadCount} Unread Notification{unreadCount > 1 ? 's' : ''}
                            </p>
                        )}
                        {notifications.map((notif: any) => (
                            <div
                                key={notif.id}
                                onClick={() => !notif.isRead && markAsRead(notif.id)}
                                className={`relative flex gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${notif.isRead
                                        ? 'bg-white border-slate-100 opacity-60 hover:opacity-80'
                                        : 'bg-white border-primary/20 shadow-md shadow-primary/5 hover:shadow-lg'
                                    }`}
                            >
                                {/* Unread indicator */}
                                {!notif.isRead && (
                                    <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                )}

                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorFor(notif.type)}`}>
                                    <span className="material-icons-outlined text-xl">{iconFor(notif.type)}</span>
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                    <p className={`font-bold text-sm leading-snug ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${notif.type === 'WARNING' ? 'bg-amber-100 text-amber-600' :
                                                notif.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>{notif.type}</span>
                                        <span className="text-xs text-slate-400 font-medium">
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
