import './globals.css';
import AppShellWrapper from '@/components/AppShellWrapper';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Casa HMS — Hotel Management System</title>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Material Symbols — variable font, weight 200 (thin/light look) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,200,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground overflow-x-hidden antialiased">
        <ThemeProvider />
        <AppShellWrapper>
          {children}
        </AppShellWrapper>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
