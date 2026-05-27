'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleSidebar, isSidebarOpen } = useUI();

  if (pathname === '/login') return null;

  const isActive = (path: string) => {
    if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const activeClass = 'text-primary';
  const inactiveClass = 'text-muted-foreground';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-background border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/') ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[9px] font-semibold tracking-wide">Home</span>
        </Link>

        <Link
          href="/calendar"
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/calendar') ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined text-2xl">calendar_month</span>
          <span className="text-[9px] font-semibold tracking-wide">Calendar</span>
        </Link>

        <Link
          href="/pos/restaurant"
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/pos/restaurant') ? activeClass : inactiveClass}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center -mt-6 border-2 shadow-md transition-all ${
              isActive('/pos/restaurant')
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted border-border text-muted-foreground'
            }`}
          >
            <span className="material-symbols-outlined text-xl">restaurant</span>
          </div>
          <span className="text-[9px] font-semibold tracking-wide">POS</span>
        </Link>

        <Link
          href="/events"
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isActive('/events') ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined text-2xl">event</span>
          <span className="text-[9px] font-semibold tracking-wide">Events</span>
        </Link>

        <button
          onClick={toggleSidebar}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${isSidebarOpen ? activeClass : inactiveClass}`}
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
          <span className="text-[9px] font-semibold tracking-wide">Menu</span>
        </button>
      </div>
    </div>
  );
}
