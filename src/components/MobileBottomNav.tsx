'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import { isChromelessRoute } from '@/lib/hotel-info';
import { canAccessRoute } from '@/lib/rbac';

const NAV = [
  { href: '/',               icon: 'dashboard',      label: 'Home' },
  { href: '/bookings',       icon: 'book_online',    label: 'Bookings' },
  { href: '/pos/restaurant', icon: 'restaurant',     label: 'Restaurant' },
  { href: '/invoices',       icon: 'receipt_long',   label: 'Invoices' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useUI();
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user ?? null));
  }, []);

  if (pathname === '/login' || isChromelessRoute(pathname)) return null;

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const canSee = (href: string) => {
    if (user === undefined) return true;
    return canAccessRoute(user?.role ?? null, href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-background/98 backdrop-blur-md border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-[60px] px-1">
        {NAV.filter(item => canSee(item.href)).map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full px-1 transition-colors active:scale-95 ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10' : ''}`}>
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <span className={`text-[9px] tracking-wide font-medium ${active ? 'text-primary' : ''}`}>{item.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}

        {/* More — opens full sidebar */}
        <button
          onClick={toggleSidebar}
          className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full px-1 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          <div className="p-1.5 rounded-xl">
            <span className="material-symbols-outlined text-[22px]">grid_view</span>
          </div>
          <span className="text-[9px] tracking-wide font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
