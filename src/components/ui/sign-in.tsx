"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  isLoading?: boolean;
  error?: string;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-none border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-none bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-none" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  isLoading = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans w-full relative overflow-hidden">

      {/* Full-page background image */}
      {heroImageSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImageSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110"
            style={{ filter: 'contrast(1.05) saturate(1.1)' }}
          />
          {/* Base dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Frosted glass layer over everything */}
          <div className="absolute inset-0 backdrop-blur-md bg-white/5" />
        </>
      )}

      {/* Left column: glass form panel */}
      <section className="relative z-10 flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md rounded-none border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-8">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-white/70">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              {error && (
                <div className="p-3 text-sm text-red-300 bg-red-500/20 rounded-none border border-red-400/30 text-center">
                  {error}
                </div>
              )}

              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-white/80">Email Address</label>
                <div className="mt-1 rounded-none border border-white/20 bg-white/10 backdrop-blur-sm transition-colors focus-within:border-white/50 focus-within:bg-white/15">
                  <input name="email" type="email" required placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-none focus:outline-none text-white placeholder:text-white/40" />
                </div>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-white/80">Password</label>
                <div className="mt-1 rounded-none border border-white/20 bg-white/10 backdrop-blur-sm transition-colors focus-within:border-white/50 focus-within:bg-white/15">
                  <div className="relative">
                    <input name="password" required type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-none focus:outline-none text-white placeholder:text-white/40" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-white/50 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-white/50 hover:text-white transition-colors" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="rounded border-white/30 bg-white/10" />
                  <span className="text-white/80">Keep me signed in</span>
                </label>
                <button type="button" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-white/70 hover:text-white transition-colors">Reset password</button>
              </div>

              <button disabled={isLoading} type="submit" className="animate-element animate-delay-600 w-full rounded-none bg-white/20 border border-white/30 backdrop-blur-sm py-4 font-medium text-white hover:bg-white/30 transition-colors disabled:opacity-50">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Right column: clean glass panel over the background */}
      {heroImageSrc && (
        <section className="hidden md:flex flex-1 relative z-10 p-4 items-center justify-center">
          <div className="w-full h-full rounded-none border border-white/10 bg-white/5 backdrop-blur-sm" />
        </section>
      )}
    </div>
  );
};
