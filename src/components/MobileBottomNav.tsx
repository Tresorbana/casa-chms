'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import { isChromelessRoute } from '@/lib/hotel-info';

const NAV = [
  { href: '/',               icon: 'dashboard',      label: 'Home' },
  { href: '/bookings',       icon: 'book_online',    label: 'Bookings' },
  { href: '/pos/restaurant', icon: 'restaurant',     label: 'POS' },
  { href: '/calendar',       icon: 'calendar_month', label: 'Calendar' },
  { href: '/notifications',  icon: 'notifications',  label: 'Alerts' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleSidebar } = useUI();

  if (pathname === '/login' || isChromelessRoute(pathname)) return null;

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {NAV.map(item => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-[9px] tracking-wide">{item.label}</span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}

        {/* More — opens full sidebar */}
        <button
          onClick={toggleSidebar}
          className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-[9px] tracking-wide">More</span>
        </button>
      </div>
    </nav>
  );
}
