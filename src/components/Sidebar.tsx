'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import { HOTEL_INFO, isChromelessRoute } from '@/lib/hotel-info';
import { canAccessRoute } from '@/lib/rbac';

const NAV_ITEMS = [
  { href: '/',              icon: 'dashboard',       label: 'Dashboard' },
  { href: '/bookings',      icon: 'book_online',     label: 'Guest Registration' },
  { href: '/calendar',      icon: 'calendar_month',  label: 'Occupancy Calendar' },
  { href: '/room-status',   icon: 'hotel',           label: 'Room Status' },
  { href: '/events',        icon: 'event',           label: 'Events' },
];

const OPS_ITEMS = [
  { href: '/pos/restaurant', icon: 'restaurant',    label: 'Restaurant & Bar' },
  { href: '/pos/events',     icon: 'celebration',   label: 'Restaurant Events' },
  { href: '/checkout',       icon: 'receipt_long',  label: 'Checkout' },
  { href: '/invoices',       icon: 'folder_shared', label: 'Invoices' },
  { href: '/inventory',      icon: 'inventory_2',   label: 'Stock' },
  { href: '/finance',        icon: 'account_balance', label: 'Finance' },
];

const ADMIN_ITEMS = [
  { href: '/reports',       icon: 'assessment',     label: 'Reports' },
  { href: '/inquiries',     icon: 'inbox',          label: 'Web Requests' },
  { href: '/notifications', icon: 'notifications',  label: 'Notifications' },
];

const CONFIG_ITEMS = [
  { href: '/settings',            icon: 'manage_accounts', label: 'Staff & Users' },
  { href: '/settings/rooms',      icon: 'meeting_room',    label: 'Rooms & Categories' },
  { href: '/settings/conference', icon: 'groups',          label: 'Conference' },
  { href: '/settings/services',   icon: 'spa',             label: 'Services' },
  { href: '/settings/menu',       icon: 'restaurant_menu', label: 'Menu Items' },
];

function NavItem({
  href, icon, label, active, collapsed,
}: { href: string; icon: string; label: string; active: boolean; collapsed: boolean }) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`group flex items-center gap-3 rounded-lg transition-all duration-150 ${
        collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2'
      } ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
      }`}
    >
      <span
        className={`material-symbols-outlined flex-shrink-0 ${
          collapsed ? 'text-[22px]' : 'text-[20px]'
        } ${active ? 'text-primary-foreground' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'}`}
      >
        {icon}
      </span>
      {!collapsed && <span className="truncate text-sm">{label}</span>}
    </Link>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div className="my-2 h-px bg-sidebar-border mx-2" />;
  }
  return (
    <div className="pt-5 pb-1 px-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(undefined);
  const { isSidebarOpen, isSidebarCollapsed, closeSidebar, toggleSidebarCollapse } = useUI();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user ?? null));
  }, []);

  useEffect(() => { closeSidebar(); }, [pathname]);

  if (pathname === '/login' || isChromelessRoute(pathname)) return null;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (path === '/settings') return pathname === '/settings';
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const canSee = (href: string) => {
    if (user === undefined) return true;
    return canAccessRoute(user?.role ?? null, href);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
    : '..';

  // On mobile: slide in/out. On desktop: full (w-64) or icon rail (w-14).
  const desktopWidth = isSidebarCollapsed ? 'lg:w-14' : 'lg:w-64';
  const mobileTranslate = isSidebarOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-[50] lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 overflow-hidden print:hidden
          w-64 ${desktopWidth}
          ${mobileTranslate} lg:translate-x-0`}
      >
        {/* Brand */}
        <div className={`border-b border-sidebar-border flex-shrink-0 ${isSidebarCollapsed ? 'px-0 py-4 items-center justify-center flex' : 'px-4 py-4'}`}>
          {isSidebarCollapsed ? (
            /* Collapsed: just the toggle button as the brand area */
            <button
              onClick={toggleSidebarCollapse}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-sidebar-accent transition-all"
              title="Expand sidebar"
            >
              <span className="material-symbols-outlined text-[22px] text-sidebar-foreground/50">menu_open</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-1">
              {/* Text logo mark */}
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-foreground text-[20px]">home</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-none truncate">{HOTEL_INFO.name}</p>
                <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5 truncate">Lake Kivu · Rutsiro</p>
              </div>
              <button
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                title="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-3 overflow-y-auto scrollbar-hide space-y-0.5 ${isSidebarCollapsed ? 'px-1' : 'px-2'}`}>
          {NAV_ITEMS.filter(item => canSee(item.href)).map(item => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} collapsed={isSidebarCollapsed} />
          ))}

          {OPS_ITEMS.some(item => canSee(item.href)) && (
            <>
              <SectionLabel label="Operations" collapsed={isSidebarCollapsed} />
              {OPS_ITEMS.filter(item => canSee(item.href)).map(item => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} collapsed={isSidebarCollapsed} />
              ))}
            </>
          )}

          {ADMIN_ITEMS.some(item => canSee(item.href)) && (
            <>
              <SectionLabel label="Admin" collapsed={isSidebarCollapsed} />
              {ADMIN_ITEMS.filter(item => canSee(item.href)).map(item => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} collapsed={isSidebarCollapsed} />
              ))}
            </>
          )}

          {CONFIG_ITEMS.some(item => canSee(item.href)) && (
            <>
              <SectionLabel label="Config" collapsed={isSidebarCollapsed} />
              {CONFIG_ITEMS.filter(item => canSee(item.href)).map(item => (
                <NavItem key={item.href} {...item} active={isActive(item.href)} collapsed={isSidebarCollapsed} />
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className={`border-t border-sidebar-border flex-shrink-0 ${isSidebarCollapsed ? 'p-1' : 'p-3'}`}>
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2 py-1">
              <Link
                href="/profile"
                title={user?.name ?? 'Profile'}
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium hover:opacity-80 transition-opacity"
              >
                {initials}
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/profile"
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-sidebar-accent transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">
                  {user?.name ?? 'Loading...'}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
                  {user?.role ?? ''}
                </p>
              </div>
              <button
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1 rounded"
                title="Sign out"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
              </button>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
