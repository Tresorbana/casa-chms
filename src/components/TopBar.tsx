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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
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
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    refreshNotifs();
  };

  const markAllRead = async () => {
    const unread = allNotifications.filter(n => !n.isRead && !n.id.startsWith('inq-') && !n.id.startsWith('out-') && !n.id.startsWith('in-'));
    await Promise.all(unread.map(n =>
      fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: n.id }) })
    ));
    refreshNotifs();
  };

  const iconFor = (type: string) => type === 'WARNING' ? 'warning' : type === 'SUCCESS' ? 'check_circle' : 'info';
  const colorFor = (type: string) =>
    type === 'WARNING' ? 'text-amber-400 bg-amber-400/10'
      : type === 'SUCCESS' ? 'text-emerald-400 bg-emerald-400/10'
      : 'text-gold bg-gold/10';

  return (
    <div className="py-6 mb-6 flex flex-col gap-4 md:flex-row md:items-end justify-between">
      {/* Page heading */}
      <div className="pl-14 lg:pl-0">
        <h1 className="text-2xl font-bold tracking-tight text-gold leading-none mb-1.5">{title}</h1>
        {description && (
          <p className="text-sm text-white/35 font-normal">{description}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2.5 lg:gap-3">
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}

        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-[18px]">search</span>
          <input
            className="pl-9 pr-4 py-2 rounded-lg text-sm text-white placeholder:text-white/20 w-44 lg:w-56 transition-all outline-none"
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
            placeholder="Search..."
            type="text"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            className={`relative p-2 rounded-lg transition-all ${showNotifications ? 'bg-gold/10 text-gold' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05]'}`}
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            aria-label="Notifications"
          >
            <span className="material-icons-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full border border-black animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl z-50 overflow-hidden shadow-surface-lg animate-slide-up"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-gold text-[#000] text-[9px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-semibold text-gold/60 hover:text-gold transition-colors uppercase tracking-widest">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {previewNotifications.length === 0 ? (
                    <div className="py-8 text-center text-white/25 text-sm">
                      <span className="material-icons-outlined block text-2xl mb-2 opacity-30">notifications_none</span>
                      No notifications
                    </div>
                  ) : previewNotifications.map((n: any) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-white/[0.03] ${!n.isRead ? 'bg-gold/[0.03]' : ''}`}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${colorFor(n.type)}`}>
                        <span className="material-icons-outlined text-[14px]">{iconFor(n.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${n.isRead ? 'text-white/35' : 'text-white/80'}`}>{n.message}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block w-full py-3 text-[10px] font-bold text-center text-white/30 hover:text-gold hover:bg-white/[0.02] transition-all uppercase tracking-widest"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  View all notifications
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/[0.06] hidden lg:block" />

        {/* User */}
        <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-semibold text-white/70 truncate max-w-[110px]">{user?.name ?? 'Guest User'}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">{user?.role ?? 'Staff'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-[#000] font-bold text-xs shadow-gold-sm flex-shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'G'}
          </div>
        </Link>
      </div>
    </div>
  );
}
