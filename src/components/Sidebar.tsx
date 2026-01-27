'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const activeClass = "bg-primary/10 text-primary font-medium shadow-sm";
  const inactiveClass = "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Image alt="Casa Hotel Logo" width={40} height={40} className="h-10 w-10 object-contain" src="/logo.png" />
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Casa Hotel</h1>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Management System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 mt-4 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link href="/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/bookings') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">calendar_today</span>
          Bookings
        </Link>
        <Link href="/room-status" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/room-status') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">hotel</span>
          Room Status
        </Link>
        <Link href="/events" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/events') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">event</span>
          Events
        </Link>
        <div className="pt-4 pb-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Operations</p>
        </div>
        <Link href="/pos/restaurant" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/pos/restaurant') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">restaurant</span>
          Restaurant POS
        </Link>
        <Link href="/checkout" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/checkout') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">receipt_long</span>
          Checkout
        </Link>
        <div className="pt-4 pb-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin</p>
        </div>
        <Link href="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/reports') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">assessment</span>
          Reports
        </Link>
        <Link href="/cms/content" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/cms/content') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">language</span>
          Website CMS
        </Link>
        <Link href="/cms/requests" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/cms/requests') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">inbox</span>
          Web Requests
        </Link>
        <Link href="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings') ? activeClass : inactiveClass}`}>
          <span className="material-icons-outlined">settings</span>
          Settings
        </Link>
      </nav>
      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4 cursor-pointer group" onClick={handleLogout} title="Click to logout">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
            {user ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : '...'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-slate-500">{user?.role || ''}</p>
          </div>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-primary transition-colors"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}
        >
          <span className="material-icons-outlined text-sm">dark_mode</span>
          Switch Theme
        </button>
      </div>
    </aside>
  );
}
