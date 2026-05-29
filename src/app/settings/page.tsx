'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function Settings() {
  const { data: users, isLoading: usersLoading } = useSWR('/api/users', fetcher, {
    onError: () => toast.error('Failed to load users'),
  });
  const { data: notificationData } = useSWR('/api/notifications', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        mutate('/api/users');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'STAFF' });
        toast.success('User created successfully');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create user');
      }
    } catch {
      toast.error('Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Settings"
        description="Manage staff access and system configuration."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Create User
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Users Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Staff Members</h3>
              <p className="text-xs text-muted-foreground mt-0.5">All authenticated users</p>
            </div>
            {usersLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading users...</div>
            ) : (
              <div className="divide-y divide-border">
                {users?.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email} · {u.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[18px]">settings</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Log */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">System Audit Log</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Recent system events</p>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>
            </div>
            <div className="p-5 space-y-3">
              {(notificationData && Array.isArray(notificationData) ? notificationData.slice(0, 5) : []).map((log: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${log.type === 'WARNING' ? 'bg-amber-500' : log.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <p className="text-sm text-foreground truncate max-w-[240px]">{log.message}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex-shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {(!notificationData || !Array.isArray(notificationData) || notificationData.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent events</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Config */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Configuration</h3>
            <div className="space-y-4">
              {[
                { label: 'VAT Rate', value: '15.0%' },
                { label: 'Service Charge', value: '10.0%' },
                { label: 'Currency', value: 'RWF' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast.info('Configuration saved')}
              className="w-full mt-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Update Configuration
            </button>
          </div>

          {/* System Info */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="text-sm font-semibold text-foreground mb-4">System Info</h4>
            <div className="space-y-3">
              {[
                { icon: 'cloud_done', label: 'Region: East Africa' },
                { icon: 'dns', label: 'Version: 3.0.4-LTS' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <span className="material-symbols-outlined text-muted-foreground text-[16px]">{item.icon}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-sm font-semibold text-foreground">Create Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Enter full name' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'staff@hotel.local' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">{field.label}</label>
                  <input
                    required type={field.type} placeholder={field.placeholder}
                    value={(formData as any)[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputClass}>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
