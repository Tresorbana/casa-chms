'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      });
  }, []);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm"
      >
        <span className="material-icons-outlined">{isOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[50] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            <span className="material-icons-outlined">book_online</span>
            Guest Registration
          </Link>
          <Link href="/calendar" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/calendar') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">calendar_month</span>
            Occupancy Calendar
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
          <Link href="/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/invoices') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">folder_shared</span>
            Invoices
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin</p>
          </div>
          <Link href="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/reports') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">assessment</span>
            Reports
          </Link>

          <Link href="/inquiries" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/inquiries') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">inbox</span>
            Web Requests
          </Link>
          <Link href="/notifications" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/notifications') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">notifications</span>
            Notifications
          </Link>

          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuration</p>
          </div>
          <Link href="/settings/rooms" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings/rooms') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">meeting_room</span>
            Rooms & Floors
          </Link>
          <Link href="/settings/conference" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings/conference') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">groups</span>
            Conference
          </Link>
          <Link href="/settings/services" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings/services') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">spa</span>
            Services
          </Link>
          <Link href="/settings/menu" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings/menu') ? activeClass : inactiveClass}`}>
            <span className="material-icons-outlined">restaurant_menu</span>
            Menu Items
          </Link>
        </nav>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
          <Link href="/profile" className="flex items-center gap-3 mb-4 cursor-pointer group" title="View Profile">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold overflow-hidden shadow-lg shadow-primary/20">
              {user ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : '...'}
            </div>
            <div>
              <p className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors italic uppercase tracking-tighter">{user?.name || 'Loading...'}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role || ''}</p>
            </div>
          </Link>
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
    </>
  );
}
