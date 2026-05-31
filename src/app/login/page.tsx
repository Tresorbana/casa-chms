'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SignInPage, type Testimonial } from '@/components/ui/sign-in';

const LOGIN_HERO_IMAGE = '/Sign%20in%20image.jpeg';

const rwandanTestimonials: Testimonial[] = [
  {
    avatarSrc: 'https://ui-avatars.com/api/?name=Marie+Uwimana&background=1d4ed8&color=fff&size=128',
    name: 'Marie-Claire Uwimana',
    handle: 'Guest · Kigali',
    text: 'The view over Lake Kivu at sunrise is unforgettable. Kamdine felt peaceful, clean, and truly welcoming.',
  },
  {
    avatarSrc: 'https://ui-avatars.com/api/?name=Patrick+Nsengimana&background=047857&color=fff&size=128',
    name: 'Patrick Nsengimana',
    handle: 'Traveler · Musanze',
    text: 'We stopped in Rutsiro on our way west—the rooms were comfortable and the restaurant served excellent local dishes.',
  },
  {
    avatarSrc: 'https://ui-avatars.com/api/?name=Grace+Mukamana&background=7c3aed&color=fff&size=128',
    name: 'Grace Mukamana',
    handle: 'Visitor · Rubavu',
    text: 'A quiet getaway on the lake. The staff were kind, and the outdoor terrace is perfect for relaxing after a long drive.',
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
