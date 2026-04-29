'use client';
import { usePathname } from 'next/navigation'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { UIProvider, useUI } from '@/context/UIContext'
import MobileBottomNav from '@/components/MobileBottomNav'
import SWRProvider from '@/components/SWRProvider'

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useUI();
  const isLoginPage = pathname === '/login';

  return (
    <main
      className={
        isLoginPage
          ? 'min-h-screen w-full'
          : `min-h-screen transition-all duration-300 w-full pb-20 lg:pb-0 ${isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'}`
      }
    >
      {children}
    </main>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Round&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-black text-white overflow-x-hidden antialiased">
        <UIProvider>
          <SWRProvider>
            <Sidebar />
            <MobileBottomNav />
            <AppShell>{children}</AppShell>
          </SWRProvider>
        </UIProvider>
      </body>
    </html>
  );
}
