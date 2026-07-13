'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';

const LOGIN_HERO_IMAGE = '/sign-in.jpeg';

const rwandanTestimonials: Testimonial[] = [];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (res.ok) {
        toast.success('Signed in successfully');
        // Route supervisor straight to their console
        try {
          const meRes = await fetch('/api/auth/me');
          const me = await meRes.json();
          if (me?.user?.role === 'SUPERVISOR') {
            window.location.href = '/supervisor';
            return;
          }
        } catch { /* fall through */ }
        window.location.href = '/';
      } else {
        const responseData = await res.json();
        toast.error(responseData.error || 'Invalid email or password');
      }
    } catch {
      toast.error('Unable to reach the authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    toast.info('Password reset is not available yet. Contact your administrator.');
  };

  const handleCreateAccount = () => {
    toast.info('Account creation is managed by your administrator.');
  };

  return (
    <div className="h-screen w-full overflow-hidden">
      <SignInPage
        title={
          <>
            Welcome to <span className="text-primary">Ubumwe Hotel by Kamdine</span>
          </>
        }
        description="Sign in to manage operations at our Lake Kivu property in Rutsiro."
        heroImageSrc={LOGIN_HERO_IMAGE}
        testimonials={rwandanTestimonials}
        onSignIn={handleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        isLoading={isLoading}
      />
    </div>
  );
}
