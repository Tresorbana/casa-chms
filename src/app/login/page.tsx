'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { AppInput } from '@/components/ui/login-1';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication Failed: Invalid Email or Password');
      }
    } catch {
      setError('Connection Protocol Failure: Unable to reach authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl flex h-[580px] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60"
        style={{ border: '1px solid rgba(212,175,55,0.12)' }}
      >
        {/* Left — Form panel */}
        <div
          className="w-full lg:w-1/2 px-8 lg:px-14 flex flex-col justify-center relative overflow-hidden"
          style={{ background: '#0a0a0a' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Gold top accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {/* Mouse-tracked gold glow */}
          <div
            className={`absolute pointer-events-none w-[400px] h-[400px] rounded-full blur-3xl transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
              transform: `translate(${mousePosition.x - 200}px, ${mousePosition.y - 200}px)`,
              transition: 'transform 0.1s ease-out, opacity 0.3s',
            }}
          />

          {/* Brand */}
          <div className="flex flex-col items-center gap-4 mb-8 relative z-10">
            <div className="w-16 h-16 bg-gold/10 rounded-[1.2rem] flex items-center justify-center ring-1 ring-gold/20">
              <img alt="Casa Hotel Logo" className="h-10 w-10 object-contain" src="/logo.png" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tighter text-gold uppercase italic leading-none">
                Casa Hotel
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gold/40 font-semibold mt-1.5">
                Central Management
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <AppInput
              label="Authentication Identity"
              placeholder="Staff Email Address"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />

            <AppInput
              label="Security Protocol"
              placeholder="Secret Access Key"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-gold transition-colors"
                >
                  <span className="material-icons-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />

            <button
              className="group relative overflow-hidden mt-2 rounded-2xl bg-gold px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-black shadow-xl shadow-gold/20 transition-all hover:bg-gold-light hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              disabled={isLoading}
              type="submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? 'Authenticating...' : 'Authenticate'}
                <span className="material-icons-outlined text-sm">vpn_key</span>
              </span>
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <p className="text-[9px] font-bold text-white/15 uppercase tracking-[0.5em]">
              System Version 3.0.4-LTS
            </p>
          </div>
        </div>

        {/* Right — Image panel */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            loader={({ src }) => src}
            width={1000}
            height={1000}
            priority
            alt="Casa Hotel"
            className="w-full h-full object-cover opacity-50"
          />
          {/* Left-edge fade into form panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
          {/* Bottom caption */}
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-gold/60 text-[10px] font-bold uppercase tracking-[0.4em]">Casa Hotel</p>
            <p className="text-white/80 text-lg font-black italic mt-1">Premium Hospitality</p>
            <p className="text-white/30 text-xs mt-1 uppercase tracking-widest">Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
