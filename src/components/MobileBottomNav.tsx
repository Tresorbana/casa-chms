'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { toggleSidebar, isSidebarOpen } = useUI();

    const isActive = (path: string) => {
        if (path === '/' && (pathname === '/' || pathname === '/dashboard')) return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    const activeClass = "text-primary";
    const inactiveClass = "text-slate-400";

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link href="/" className={`flex flex-col items-center gap-1 w-full h-full justify-center ${isActive('/') ? activeClass : inactiveClass}`}>
                    <span className="material-icons-outlined text-2xl">dashboard</span>
                    <span className="text-[10px] font-bold">Home</span>
                </Link>
                <Link href="/calendar" className={`flex flex-col items-center gap-1 w-full h-full justify-center ${isActive('/calendar') ? activeClass : inactiveClass}`}>
                    <span className="material-icons-outlined text-2xl">calendar_month</span>
                    <span className="text-[10px] font-bold">Calendar</span>
                </Link>
                <Link href="/pos/restaurant" className={`flex flex-col items-center gap-1 w-full h-full justify-center ${isActive('/pos/restaurant') ? activeClass : inactiveClass}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-6 border-4 border-slate-50 shadow-lg ${isActive('/pos/restaurant') ? 'bg-primary text-white' : 'bg-slate-900 text-white'}`}>
                        <span className="material-icons-outlined text-xl">restaurant</span>
                    </div>
                    <span className="text-[10px] font-bold">POS</span>
                </Link>
                <Link href="/events" className={`flex flex-col items-center gap-1 w-full h-full justify-center ${isActive('/events') ? activeClass : inactiveClass}`}>
                    <span className="material-icons-outlined text-2xl">event</span>
                    <span className="text-[10px] font-bold">Events</span>
                </Link>
                <button
                    onClick={toggleSidebar}
                    className={`flex flex-col items-center gap-1 w-full h-full justify-center ${isSidebarOpen ? activeClass : inactiveClass}`}
                >
                    <span className="material-icons-outlined text-2xl">menu</span>
                    <span className="text-[10px] font-bold">Menu</span>
                </button>
            </div>
        </div>
    );
}
