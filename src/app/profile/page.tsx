'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

export default function Profile() {
  const { data, isLoading } = useSWR('/api/auth/me', fetcher, {
    onError: () => toast.error('Failed to load profile'),
  });
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">refresh</span>
        <p className="text-sm">Loading profile...</p>
      </div>
    </div>
  );

  const user = data?.user || { name: 'Guest User', email: 'guest@hotel.local', role: 'STAFF', createdAt: new Date().toISOString() };
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar title="Profile" description="Manage your account and security settings." />

      <div className="max-w-3xl mx-auto w-full space-y-5">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-primary flex items-center justify-center text-2xl font-semibold text-primary-foreground flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{user.role} · Ubumwe Hotel by Kamdine</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                  ID: {user.id?.substring(0, 8).toUpperCase() || 'GUEST'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent text-foreground transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">{isEditing ? 'save' : 'edit'}</span>
                {isEditing ? 'Save' : 'Edit'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
              <h3 className="text-sm font-semibold text-foreground">Identity</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Display Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email Address</label>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Member Since</label>
                <p className="text-sm font-medium text-foreground">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">shield</span>
              <h3 className="text-sm font-semibold text-foreground">Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">System Role</label>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-medium text-foreground">{user.role}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Password</label>
                <button
                  onClick={() => toast.info('Password reset is managed by your administrator')}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:bg-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">key</span>
                  Change Password
                </button>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Active Sessions</label>
                <p className="text-sm text-muted-foreground">1 active session</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4 border-t border-border">
          <p className="text-[11px] text-muted-foreground">Ubumwe Hotel by Kamdine · Version 3.0</p>
        </div>
      </div>
    </div>
  );
}
