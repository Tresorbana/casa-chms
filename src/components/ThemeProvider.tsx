'use client';
import { useEffect } from 'react';

/**
 * Reads the saved theme from localStorage on first mount and applies
 * the `dark` class to <html>. This runs client-side only so there's
 * no server/client mismatch.
 */
export default function ThemeProvider() {
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}
