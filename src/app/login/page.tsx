'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';

const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    name: 'Sarah Chen',
    handle: '@sarahdigital',
    text: 'Amazing platform! The user experience is seamless and the features are exactly what I needed.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    name: 'Marcus Johnson',
    handle: '@marcustech',
    text: 'This service has transformed how I work. Clean design, powerful features, and excellent support.',
  },
  {
    avatarSrc: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80',
    name: 'David Martinez',
    handle: '@davidcreates',
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful.",
  },
];

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
    <div className="bg-background text-foreground h-screen w-full">
      <SignInPage
        title="Welcome to HMS"
        description="Sign in to access the Hotel Management System"
        heroImageSrc="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=2160&q=80"
        testimonials={sampleTestimonials}
        onSignIn={handleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
        isLoading={isLoading}
      />
    </div>
  );
}
