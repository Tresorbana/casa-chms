'use client';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { UIProvider, useUI } from '@/context/UIContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import SWRProvider from '@/components/SWRProvider';

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUI();
  const isLoginPage = pathname === '/login';

  return (
    <main
      className={
        isLoginPage
          ? 'min-h-screen w-full'
          // Mobile: no left padding (sidebar slides over content)
          // Desktop: 56px (icon rail) when collapsed, 256px (full) when expanded
          : `min-h-screen transition-all duration-300 w-full pb-20 lg:pb-0 ${
              isSidebarCollapsed ? 'lg:pl-14' : 'lg:pl-64'
            }`
      }
    >
      {children}
    </main>
  );
}

export default function AppShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <SWRProvider>
        <Sidebar />
        <MobileBottomNav />
        <AppShell>{children}</AppShell>
      </SWRProvider>
    </UIProvider>
  );
}
