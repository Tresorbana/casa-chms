'use client';
import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import LegacyLogic from '@/components/LegacyLogic'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`font-sans bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200`}>
        <LegacyLogic />
        <Sidebar />
        <main className={isLoginPage ? "min-h-screen" : "ml-64 min-h-screen"}>
          {children}
        </main>
      </body>
    </html>
  )
}
