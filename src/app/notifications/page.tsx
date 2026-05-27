'use client';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const iconFor = (type: string) => type === 'WARNING' ? 'warning' : type === 'SUCCESS' ? 'check_circle' : 'info';
const colorFor = (type: string) =>
  type === 'WARNING' ? 'bg-amber-50 text-amber-600' :
  type === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' :
  'bg-blue-50 text-blue-600';

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 30000,
    onError: () => toast.error('Failed to load notifications'),
  });
  const notifications: any[] = Array.isArray(notificationsData) ? notificationsData : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    if (id.startsWith('inq-') || id.startsWith('out-') || id.startsWith('in-')) return;
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      mutate('/api/notifications');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead && !n.id.startsWith('inq-') && !n.id.startsWith('out-') && !n.id.startsWith('in-'));
    try {
      await Promise.all(unread.map(n =>
        fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) })
      ));
      mutate('/api/notifications');
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Notifications"
        description="System alerts, check-ins, check-outs, and web inquiries."
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-icons-outlined text-[18px]">done_all</span>
              Mark All Read
            </button>
          ) : undefined
        }
      />

      <div className="max-w-2xl mx-auto w-full space-y-2">
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <span className="material-icons-outlined text-4xl block mb-3 opacity-30">notifications_none</span>
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs mt-1">No notifications at the moment.</p>
          </div>
        ) : (
          <>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground px-1 mb-3">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
            {notifications.map((notif: any) => (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markAsRead(notif.id)}
                className={`relative flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  notif.isRead
                    ? 'bg-background border-border opacity-60 hover:opacity-80'
                    : 'bg-card border-border shadow-sm hover:shadow-md'
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorFor(notif.type)}`}>
                  <span className="material-icons-outlined text-[18px]">{iconFor(notif.type)}</span>
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className={`text-sm leading-snug ${notif.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${colorFor(notif.type)}`}>
                      {notif.type}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
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
