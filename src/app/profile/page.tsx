'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass =
  'w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all';

export default function Profile() {
  const { data, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
    onError: () => toast.error('Failed to load profile'),
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const user = data?.user;

  useEffect(() => {
    if (user?.name) setNameValue(user.name);
  }, [user?.name]);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">refresh</span>
        <p className="text-sm">Loading profile...</p>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-sm text-muted-foreground">Not signed in.</p>
    </div>
  );

  const initials = (user.name || user.email)
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) { toast.error('Name cannot be empty'); return; }
    setIsSavingName(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameValue.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || 'Failed to update name'); return; }
      mutate({ user: json.user });
      setIsEditingName(false);
      toast.success('Name updated');
    } catch { toast.error('Failed to update name'); }
    finally { setIsSavingName(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) { toast.error('New passwords do not match'); return; }
    if (passwordForm.next.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.next }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error || 'Failed to change password'); return; }
      setPasswordForm({ current: '', next: '', confirm: '' });
      setShowPasswordForm(false);
      toast.success('Password changed successfully');
    } catch { toast.error('Failed to change password'); }
    finally { setIsSavingPassword(false); }
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
              <h2 className="text-xl font-semibold text-foreground">{user.name || user.email}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{user.role} · Ubumwe Hotel by Kamdine</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                  ID: {user.id?.substring(0, 8).toUpperCase() || '—'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
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
          {/* Identity */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">person</span>
              <h3 className="text-sm font-semibold text-foreground">Identity</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Display Name</label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      className={inputClass}
                      autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setIsEditingName(false); }}
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isSavingName ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setIsEditingName(false); setNameValue(user.name || ''); }}
                      className="px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:bg-accent transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground flex-1">{user.name || '—'}</p>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Edit name"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email Address</label>
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Member Since</label>
                <p className="text-sm font-medium text-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
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
                {showPasswordForm ? (
                  <form onSubmit={handleChangePassword} className="space-y-2 mt-2">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.current}
                      onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className={inputClass}
                      required
                      autoFocus
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.next}
                      onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })}
                      className={inputClass}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirm}
                      onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className={inputClass}
                      required
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setShowPasswordForm(false); setPasswordForm({ current: '', next: '', confirm: '' }); }}
                        className="flex-1 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isSavingPassword ? 'Saving...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:bg-accent transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">key</span>
                    Change Password
                  </button>
                )}
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
