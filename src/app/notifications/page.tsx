'use client';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

export default function NotificationsPage() {
    const { data: notificationsData, isLoading } = useSWR('/api/notifications', fetcher);
    const notifications = Array.isArray(notificationsData) ? notificationsData : [];

    const markAsRead = async (id: string) => {
        await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        mutate('/api/notifications');
    };

    if (isLoading) return <div className="p-8 text-center text-slate-400">Loading Notifications...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8 flex flex-col gap-8">
            <TopBar
                title="Notifications"
                description="System alerts and activity logs."
            />

            <div className="max-w-3xl mx-auto w-full grid gap-4">
                {notifications?.map((notif: any) => (
                    <div
                        key={notif.id}
                        className={`relative p-6 rounded-2xl border transition-all ${notif.isRead ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-70' : 'bg-white dark:bg-slate-900 border-olive-leaf shadow-lg shadow-olive-leaf/10'}`}
                        onClick={() => !notif.isRead && markAsRead(notif.id)}
                    >
                        {!notif.isRead && (
                            <span className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-sm"></span>
                        )}
                        <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.type === 'WARNING' ? 'bg-red-100 text-red-500' :
                                notif.type === 'SUCCESS' ? 'bg-green-100 text-green-500' :
                                    'bg-blue-100 text-blue-500'
                                }`}>
                                <span className="material-icons-outlined">
                                    {notif.type === 'WARNING' ? 'warning' : notif.type === 'SUCCESS' ? 'check_circle' : 'info'}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white mb-1">{notif.message}</h4>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {new Date(notif.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
