'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import ThemeToggle from '@/components/ThemeToggle';
import { HOTEL_INFO } from '@/lib/hotel-info';

interface TopBarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function TopBar({ title, description, actions }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); })
      .catch(() => toast.error('Failed to load user info'));
  }, []);

  const { data: notificationsData, mutate: refreshNotifs } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 60000,
    dedupingInterval: 30000,
  });

  const allNotifications: any[] = Array.isArray(notificationsData) ? notificationsData : [];
  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const previewNotifications = allNotifications.slice(0, 6);

  const markAsRead = async (id: string) => {
    if (id.startsWith('inq-') || id.startsWith('out-') || id.startsWith('in-')) return;
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      refreshNotifs();
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllRead = async () => {
    const unread = allNotifications.filter(
      n => !n.isRead && !n.id.startsWith('inq-') && !n.id.startsWith('out-') && !n.id.startsWith('in-')
    );
    try {
      await Promise.all(
        unread.map(n =>
          fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: n.id }),
          })
        )
      );
      refreshNotifs();
      toast.success('All notifications cleared');
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  const iconFor = (type: string) =>
    type === 'WARNING' ? 'warning' : type === 'SUCCESS' ? 'check_circle' : 'info';

  const colorFor = (type: string) =>
    type === 'WARNING'
      ? 'text-amber-600 bg-amber-50'
      : type === 'SUCCESS'
      ? 'text-emerald-600 bg-emerald-50'
      : 'text-blue-600 bg-blue-50';

  return (
    <div className="pb-4 mb-4 border-b border-border">
      {/* Mobile hotel name strip */}
      <div className="flex items-center justify-between mb-3 lg:hidden">
        <p className="text-[11px] font-medium text-muted-foreground tracking-wide truncate">
          {HOTEL_INFO.name}
        </p>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Notification bell — mobile */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowNotifications(v => !v)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                showNotifications
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
              }`}
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
              )}
            </button>
            {showNotifications && <NotificationsPanel
              previewNotifications={previewNotifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllRead={markAllRead}
              onClose={() => setShowNotifications(false)}
              colorFor={colorFor}
              iconFor={iconFor}
            />}
          </div>
          {/* User avatar — mobile */}
          <Link href="/profile" className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 active:opacity-70">
            {user?.name ? user.name[0].toUpperCase() : 'G'}
          </Link>
        </div>
      </div>

      {/* Page heading + desktop controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground leading-none mb-1">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}

          {/* Desktop-only controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
                search
              </span>
              <input
                className="pl-9 pr-4 py-2 rounded-lg text-sm bg-muted border border-border text-foreground placeholder:text-muted-foreground w-44 lg:w-56 outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                placeholder="Search..."
                type="text"
              />
            </div>

            <div className="h-8 w-px bg-border" />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(v => !v)}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  showNotifications
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                }`}
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
                )}
              </button>
              {showNotifications && <NotificationsPanel
                previewNotifications={previewNotifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllRead={markAllRead}
                onClose={() => setShowNotifications(false)}
                colorFor={colorFor}
                iconFor={iconFor}
              />}
            </div>

            <div className="h-8 w-px bg-border" />
            <ThemeToggle />

            {/* User */}
            <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-xs font-semibold text-foreground truncate max-w-[110px]">
                  {user?.name ?? 'Guest User'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {user?.role ?? 'Staff'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'G'}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

type NotificationsPanelProps = {
  previewNotifications: any[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
  colorFor: (type: string) => string;
  iconFor: (type: string) => string;
};

function NotificationsPanel({
  previewNotifications, unreadCount, onMarkAsRead, onMarkAllRead, onClose, colorFor, iconFor,
}: NotificationsPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 rounded-xl z-50 overflow-hidden shadow-lg border border-border bg-popover animate-slide-up">
        <div className="px-4 py-3 flex justify-between items-center border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {previewNotifications.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <span className="material-symbols-outlined block text-2xl mb-2 opacity-40">notifications_none</span>
              No notifications
            </div>
          ) : (
            previewNotifications.map((n: any) => (
              <button
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-accent border-b border-border last:border-0 ${
                  !n.isRead ? 'bg-muted/50' : ''
                }`}
              >
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorFor(n.type)}`}>
                  <span className="material-symbols-outlined text-[14px]">{iconFor(n.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${n.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
        <Link
          href="/notifications"
          onClick={onClose}
          className="block w-full py-3 text-[11px] font-medium text-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all border-t border-border"
        >
          View all notifications
        </Link>
      </div>
    </>
  );
}
