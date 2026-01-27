'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen relative">

      <div className="absolute top-4 right-4">
        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 hover:text-primary bg-white/70 dark:bg-slate-900/70 backdrop-blur rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-sm" onClick={() => { document.documentElement.classList.toggle('dark') }}>
          <span className="material-icons-outlined text-sm">dark_mode</span>
          Switch Theme
        </button>
      </div>
      <main className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 px-8 py-10">
          <div className="flex flex-col items-center gap-3 mb-8">
            <img alt="Casa Hotel Logo" className="h-16 w-16 rounded-xl object-contain h-10" src="logo.png" />
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Casa Hotel</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary font-semibold mt-1">Management System</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mb-6">Use your staff credentials to access the Casa Hotel management console.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-xs font-medium text-red-500 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1" htmlFor="email">Email</label>
              <input className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none" id="email" name="email" placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input
                  className="mt-1 block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all focus:scale-[1.01]"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-icons-outlined text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                <input className="rounded border-slate-300 text-primary focus:ring-primary transition-colors" type="checkbox" />
                <span>Remember this device</span>
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Secure connection</span>
              </span>
            </div>
            <button className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white text-sm font-semibold py-2.5 shadow-sm hover:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark transition-colors disabled:opacity-50" disabled={isLoading} type="submit">
              <span className="material-icons-outlined text-base">login</span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Need help? Contact front office manager.</span>
            <span className="font-mono">v1.0</span>
          </div>
        </div>
      </main>


    </div>
  );
}
