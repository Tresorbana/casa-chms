'use client';
import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { fetcher } from '@/lib/fetcher';

type Overview = {
  totals: {
    allTime: number;
    today: number;
    lastHour: number;
    week: number;
    failedLogs: number;
    failedLoginsToday: number;
    users: number;
  };
  byCategory: { category: string; count: number }[];
  topActions: { action: string; count: number }[];
  topUsers: { userId: string | null; userName: string | null; userRole: string | null; count: number }[];
  recentActive: ActivityLogRow[];
  hotel: {
    activeBookings: number;
    occupiedRooms: number;
    unpaidInvoices: number;
    revenueToday: number;
    revenueWeek: number;
  };
};

type ActivityLogRow = {
  id: string;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  action: string;
  category: string;
  entity: string | null;
  entityId: string | null;
  method: string | null;
  path: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  createdAt: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  AUTH: 'bg-blue-50 text-blue-700 border-blue-200',
  BOOKINGS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CHECKOUT: 'bg-purple-50 text-purple-700 border-purple-200',
  INVOICES: 'bg-amber-50 text-amber-700 border-amber-200',
  USERS: 'bg-rose-50 text-rose-700 border-rose-200',
  GENERAL: 'bg-muted text-muted-foreground border-border',
};

const STATUS_COLORS: Record<string, string> = {
  OK: 'text-emerald-600',
  FAILED: 'text-rose-600',
  DENIED: 'text-amber-600',
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function StatCard({ label, value, hint, tone = 'default' }: { label: string; value: string | number; hint?: string; tone?: 'default' | 'good' | 'warn' | 'bad' }) {
  const toneClass =
    tone === 'good' ? 'text-emerald-600' :
    tone === 'warn' ? 'text-amber-600' :
    tone === 'bad' ? 'text-rose-600' :
    'text-foreground';
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${toneClass}`}>{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

export default function SupervisorDashboard() {
  const { data: overview, mutate: mutateOverview } = useSWR<Overview>(
    '/api/supervisor/overview',
    fetcher,
    { refreshInterval: 15_000 }
  );
  const { data: recentLogs } = useSWR<{ logs: ActivityLogRow[]; total: number }>(
    '/api/supervisor/logs?take=25',
    fetcher,
    { refreshInterval: 10_000 }
  );

  const [now, setNow] = useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const health = useMemo(() => {
    if (!overview) return 'unknown';
    if (overview.totals.lastHour === 0) return 'idle';
    if (overview.totals.failedLoginsToday > 10) return 'alert';
    return 'live';
  }, [overview, now]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600">shield_person</span>
              <h1 className="text-lg font-semibold text-foreground">Supervisor Console</h1>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                health === 'alert' ? 'bg-rose-50 text-rose-700 border-rose-200'
                : health === 'idle' ? 'bg-muted text-muted-foreground border-border'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  health === 'alert' ? 'bg-rose-500'
                  : health === 'idle' ? 'bg-muted-foreground'
                  : 'bg-emerald-500'
                }`} />
                {health}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Silent oversight — activity logs, user actions, and system usage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/supervisor/logs"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              Activity Log
            </Link>
            <button
              type="button"
              onClick={() => mutateOverview()}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              Refresh
            </button>
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
        {!overview ? (
          <div className="bg-card border border-border rounded-xl p-16 text-center text-muted-foreground">
            Loading overview…
          </div>
        ) : (
          <>
            {/* System usage snapshot */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">System usage</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Actions last hour"
                  value={overview.totals.lastHour}
                  hint={overview.totals.lastHour > 0 ? 'System is being used' : 'Idle — no traffic'}
                  tone={overview.totals.lastHour > 0 ? 'good' : 'warn'}
                />
                <StatCard label="Actions today" value={overview.totals.today} />
                <StatCard label="Actions this week" value={overview.totals.week} />
                <StatCard label="All-time logs" value={overview.totals.allTime} />
              </div>
            </section>

            {/* Alerts / integrity */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Integrity & alerts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Failed / denied today"
                  value={overview.totals.failedLogs}
                  tone={overview.totals.failedLogs > 5 ? 'bad' : 'default'}
                />
                <StatCard
                  label="Failed logins today"
                  value={overview.totals.failedLoginsToday}
                  hint={overview.totals.failedLoginsToday > 5 ? 'Possible brute force' : 'Normal'}
                  tone={overview.totals.failedLoginsToday > 5 ? 'bad' : 'good'}
                />
                <StatCard label="Total users" value={overview.totals.users} />
                <StatCard label="Active users (week)" value={overview.topUsers.length} />
              </div>
            </section>

            {/* Hotel operations */}
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Hotel snapshot</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatCard label="Active bookings" value={overview.hotel.activeBookings} />
                <StatCard label="Occupied rooms" value={overview.hotel.occupiedRooms} />
                <StatCard label="Unpaid invoices" value={overview.hotel.unpaidInvoices} tone={overview.hotel.unpaidInvoices > 0 ? 'warn' : 'default'} />
                <StatCard label="Revenue today" value={`RWF ${overview.hotel.revenueToday.toLocaleString()}`} tone="good" />
                <StatCard label="Revenue 7d" value={`RWF ${overview.hotel.revenueWeek.toLocaleString()}`} tone="good" />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Top users */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Most active users (7d)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Who is doing what</p>
                </div>
                <div className="divide-y divide-border">
                  {overview.topUsers.length === 0 && (
                    <p className="p-4 text-xs text-muted-foreground">No activity yet.</p>
                  )}
                  {overview.topUsers.map((u) => (
                    <Link
                      key={u.userId ?? Math.random()}
                      href={`/supervisor/logs?userId=${u.userId ?? ''}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                        {(u.userName ?? '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{u.userName ?? 'Unknown'}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{u.userRole ?? '—'}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{u.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">By category</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">What areas of the app are used</p>
                </div>
                <div className="divide-y divide-border">
                  {overview.byCategory.map((c) => {
                    const max = Math.max(...overview.byCategory.map((x) => x.count), 1);
                    const pct = Math.max(3, Math.round((c.count / max) * 100));
                    return (
                      <Link
                        key={c.category}
                        href={`/supervisor/logs?category=${c.category}`}
                        className="p-3 block hover:bg-accent/40 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                            CATEGORY_COLORS[c.category] ?? CATEGORY_COLORS.GENERAL
                          }`}>
                            {c.category}
                          </span>
                          <span className="text-sm font-semibold text-foreground">{c.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Top actions */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Top actions (30d)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Frequency of specific operations</p>
                </div>
                <div className="divide-y divide-border max-h-[380px] overflow-y-auto">
                  {overview.topActions.map((a) => (
                    <Link
                      key={a.action}
                      href={`/supervisor/logs?action=${encodeURIComponent(a.action)}`}
                      className="flex items-center justify-between p-3 hover:bg-accent/40 transition-colors"
                    >
                      <span className="text-xs font-mono text-foreground">{a.action}</span>
                      <span className="text-sm font-semibold text-foreground">{a.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Live tail */}
            <section className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Live activity</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Auto-refreshing tail — full audit trail available in Activity Log.</p>
                </div>
                <Link href="/supervisor/logs" className="text-xs text-primary hover:underline">
                  View all →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      {['Time', 'User', 'Action', 'Category', 'Entity', 'Status', 'IP'].map((h) => (
                        <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(recentLogs?.logs ?? overview.recentActive).map((log) => (
                      <tr key={log.id} className="hover:bg-accent/30">
                        <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap" title={fmtTime(log.createdAt)}>
                          {fmtRelative(log.createdAt)}
                        </td>
                        <td className="px-4 py-2 text-xs">
                          <p className="text-foreground font-medium">{log.userName ?? '—'}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{log.userRole ?? '—'}</p>
                        </td>
                        <td className="px-4 py-2 text-xs font-mono text-foreground">{log.action}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${
                            CATEGORY_COLORS[log.category] ?? CATEGORY_COLORS.GENERAL
                          }`}>
                            {log.category}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {log.entity ? `${log.entity}${log.entityId ? ` · ${log.entityId.slice(-6)}` : ''}` : '—'}
                        </td>
                        <td className={`px-4 py-2 text-xs font-medium ${STATUS_COLORS[log.status] ?? 'text-muted-foreground'}`}>
                          {log.status}
                        </td>
                        <td className="px-4 py-2 text-[10px] font-mono text-muted-foreground">
                          {log.ipAddress ?? '—'}
                        </td>
                      </tr>
                    ))}
                    {(recentLogs?.logs ?? overview.recentActive).length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                          No activity recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
