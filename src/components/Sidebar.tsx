'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

const NAV_ITEMS = [
  { href: '/', icon: 'dashboard', label: 'Dashboard' },
  { href: '/bookings', icon: 'book_online', label: 'Guest Registration' },
  { href: '/calendar', icon: 'calendar_month', label: 'Occupancy Calendar' },
  { href: '/room-status', icon: 'hotel', label: 'Room Status' },
  { href: '/events', icon: 'event', label: 'Events' },
];

const OPS_ITEMS = [
  { href: '/pos/restaurant', icon: 'restaurant', label: 'Restaurant POS' },
  { href: '/checkout', icon: 'receipt_long', label: 'Checkout' },
  { href: '/invoices', icon: 'folder_shared', label: 'Invoices' },
];

const ADMIN_ITEMS = [
  { href: '/reports', icon: 'assessment', label: 'Reports' },
  { href: '/inquiries', icon: 'inbox', label: 'Web Requests' },
  { href: '/notifications', icon: 'notifications', label: 'Notifications' },
];

const CONFIG_ITEMS = [
  { href: '/settings/rooms', icon: 'meeting_room', label: 'Rooms & Floors' },
  { href: '/settings/conference', icon: 'groups', label: 'Conference' },
  { href: '/settings/services', icon: 'spa', label: 'Services' },
  { href: '/settings/menu', icon: 'restaurant_menu', label: 'Menu Items' },
];

function NavItem({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${active
        ? 'bg-white/[0.08] text-white border-l-2 border-gold pl-[10px]'
        : 'text-white/40 border-l-2 border-transparent hover:bg-white/[0.04] hover:text-white/70'
      }`}
    >
      <span className={`material-icons-outlined text-[18px] flex-shrink-0 ${active ? 'text-gold' : 'text-white/40 group-hover:text-white/60'}`}>
        {icon}
      </span>
      <span className="font-medium tracking-wide">{label}</span>
    </Link>
  );
}

function NavSection({ label, items, isActive }: { label: string; items: typeof NAV_ITEMS; isActive: (p: string) => boolean }) {
  return (
    <>
      <div className="pt-5 pb-1.5 px-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">{label}</span>
      </div>
      {items.map(item => (
        <NavItem key={item.href} {...item} active={isActive(item.href)} />
      ))}
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { isSidebarOpen, isSidebarCollapsed, closeSidebar, toggleSidebar, toggleSidebarCollapse } = useUI();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); });
  }, []);

  useEffect(() => { closeSidebar(); }, [pathname]);

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

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-[#111111] border border-white/[0.08] hover:bg-white/[0.06] transition-all shadow-surface"
      >
        <span className="material-icons-outlined text-white/60 text-[20px]">
          {isSidebarOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Desktop re-open button — only shown when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <button
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex fixed left-4 top-4 z-[60] p-2 items-center justify-center rounded-lg bg-[#111111] border border-white/[0.08] hover:bg-gold/10 hover:border-gold/30 transition-all shadow-surface group"
          title="Expand sidebar"
        >
          <span className="material-icons-outlined text-white/40 group-hover:text-gold text-[20px] transition-colors">menu_open</span>
        </button>
      )}

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-[50] lg:hidden backdrop-blur-sm" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isSidebarCollapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'}`}
        style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Brand */}
        <div className="px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center ring-1 ring-gold/20 overflow-hidden flex-shrink-0">
              <Image alt="Casa Hotel" width={28} height={28} className="object-contain" src="/logo.png" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gold tracking-tight leading-none">Casa Hotel</p>
              <p className="text-[9px] text-white/30 font-medium tracking-widest uppercase mt-0.5">Management</p>
            </div>
            {/* Desktop collapse toggle */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex flex-shrink-0 p-1.5 rounded-lg text-white/25 hover:text-gold hover:bg-gold/10 transition-all"
              title="Collapse sidebar"
            >
              <span className="material-icons-outlined text-[18px]">chevron_left</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-hide space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <NavSection label="Operations" items={OPS_ITEMS} isActive={isActive} />
          <NavSection label="Admin" items={ADMIN_ITEMS} isActive={isActive} />
          <NavSection label="Configuration" items={CONFIG_ITEMS} isActive={isActive} />
        </nav>

        {/* User footer */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Link href="/profile"
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-[#000] font-bold text-xs flex-shrink-0 shadow-gold-sm">
              {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) ?? '..'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate group-hover:text-white transition-colors">
                {user?.name ?? 'Loading...'}
              </p>
              <p className="text-[9px] text-white/25 uppercase tracking-widest truncate">{user?.role ?? ''}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); handleLogout(); }}
              className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 p-1 rounded"
              title="Sign out"
            >
              <span className="material-icons-outlined text-[16px]">logout</span>
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
