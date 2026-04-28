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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Decorative gold orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-gold/[0.06] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gold/[0.015] rounded-full blur-[150px] pointer-events-none" />

      <main className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="rounded-[2rem] shadow-2xl shadow-black/60 p-10 relative overflow-hidden"
          style={{ background: '#111111', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          {/* Gold top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

          {/* Logo + Brand */}
          <div className="flex flex-col items-center gap-5 mb-10">
            <div className="w-20 h-20 bg-gold/10 rounded-[1.5rem] flex items-center justify-center shadow-inner ring-1 ring-gold/20">
              <img alt="Casa Hotel Logo" className="h-12 w-12 object-contain" src="logo.png" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-black tracking-tighter text-gold uppercase italic leading-none">Casa Hotel</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold/50 font-semibold mt-2">Central Management</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gold/50 uppercase tracking-widest ml-1" htmlFor="email">Authentication Identity</label>
              <div className="relative group">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-gold transition-colors text-lg">alternate_email</span>
                <input
                  className="w-full rounded-2xl border border-gold/20 bg-black/60 px-12 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:bg-black focus:border-gold/50 focus:ring-2 focus:ring-gold/15 outline-none transition-all"
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
              <label className="text-[10px] font-bold text-gold/50 uppercase tracking-widest ml-1" htmlFor="password">Security Protocol</label>
              <div className="relative group">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-gold transition-colors text-lg">lock</span>
                <input
                  className="w-full rounded-2xl border border-gold/20 bg-black/60 px-12 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:bg-black focus:border-gold/50 focus:ring-2 focus:ring-gold/15 outline-none transition-all"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-gold transition-colors"
                >
                  <span className="material-icons-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 pt-1">
              <label className="flex items-center gap-3 text-[10px] font-bold text-white/35 uppercase tracking-widest cursor-pointer group">
                <input className="w-4 h-4 rounded bg-black border-gold/30 accent-gold transition-all" type="checkbox" />
                <span className="group-hover:text-white/60 transition-colors">Maintain Session</span>
              </label>
            </div>

            <button
              className="w-full mt-6 group relative overflow-hidden rounded-[1.5rem] bg-gold px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black shadow-2xl shadow-gold/25 transition-all hover:bg-gold-light hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              disabled={isLoading}
              type="submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? 'Authenticating...' : 'Authenticate'}
                <span className="material-icons-outlined text-sm">vpn_key</span>
              </span>
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">System Version 3.0.4-LTS</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-gold/60 transition-colors">Terminal Support</a>
          <a href="#" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-gold/60 transition-colors">Safety Protocols</a>
        </div>
      </main>
    </div>
  );
}
