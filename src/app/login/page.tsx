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
        setError(data.error || 'Authentication Failed: Invalid Email or Password');
      }
    } catch (err) {
      setError('Connection Protocol Failure: Unable to reach authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>


      <main className="w-full max-w-md relative z-10 transition-all scale-100 hover:scale-[1.01]">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-12">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center shadow-inner group">
              <img alt="Casa Hotel Logo" className="h-12 w-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" src="logo.png" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">Casa Hotel</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-black mt-2">Central Management</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4" htmlFor="email">Authentication Identity</label>
              <div className="relative group">
                <span className="material-icons-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                <input
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-14 py-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  id="email"
                  name="email"
                  placeholder="Staff Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4" htmlFor="password">Security Protocol</label>
              <div className="relative group">
                <span className="material-icons-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-lg">lock</span>
                <input
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-14 py-5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  id="password"
                  name="password"
                  placeholder="Secret Access Key"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <span className="material-icons-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pt-2">
              <label className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group">
                <input className="w-4 h-4 rounded-lg bg-slate-100 border-slate-300 checked:bg-primary transition-all" type="checkbox" />
                <span className="group-hover:text-slate-800">Maintain Session</span>
              </label>
            </div>

            <button
              className="w-full mt-8 group relative overflow-hidden rounded-[2rem] bg-primary px-8 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? 'Decrypting Access...' : 'Authenticate'}
                <span className="material-icons-outlined text-sm">vpn_key</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">System Version 3.0.4-LTS</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8 no-print">
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Terminal Support</a>
          <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Safety Protocols</a>
        </div>
      </main>
    </div>
  );
}
