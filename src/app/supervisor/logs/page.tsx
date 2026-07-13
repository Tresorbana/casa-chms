'use client';
import React, { Suspense, useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetcher } from '@/lib/fetcher';

type LogRow = {
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

type User = { id: string; email: string; name: string | null; role: string };

const CATEGORIES = ['AUTH', 'BOOKINGS', 'CHECKOUT', 'INVOICES', 'USERS', 'GENERAL'];
const STATUSES = ['OK', 'FAILED', 'DENIED'];

const CATEGORY_COLORS: Record<string, string> = {
  AUTH: 'bg-blue-50 text-blue-700 border-blue-200',
  BOOKINGS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CHECKOUT: 'bg-purple-50 text-purple-700 border-purple-200',
  INVOICES: 'bg-amber-50 text-amber-700 border-amber-200',
  USERS: 'bg-rose-50 text-rose-700 border-rose-200',
  GENERAL: 'bg-muted text-muted-foreground border-border',
};

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function LogsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<LogRow | null>(null);
  const [pageSize] = useState(100);
  const [skip, setSkip] = useState(0);

  const filters = {
    category: searchParams.get('category') ?? '',
    userId: searchParams.get('userId') ?? '',
    status: searchParams.get('status') ?? '',
    action: searchParams.get('action') ?? '',
    q: searchParams.get('q') ?? '',
    since: searchParams.get('since') ?? '',
    until: searchParams.get('until') ?? '',
  };

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    params.set('take', String(pageSize));
    params.set('skip', String(skip));
    return params.toString();
  }, [filters, pageSize, skip]);

  const { data, mutate, isLoading } = useSWR<{ logs: LogRow[]; total: number }>(
    `/api/supervisor/logs?${query}`,
    fetcher,
    { refreshInterval: 15_000 }
  );
  const { data: users } = useSWR<User[]>('/api/supervisor/users', fetcher);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value); else next.delete(key);
    setSkip(0);
    router.replace(`/supervisor/logs?${next.toString()}`);
  };

  const clearFilters = () => {
    setSkip(0);
    router.replace('/supervisor/logs');
  };

  const total = data?.total ?? 0;
  const logs = data?.logs ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/supervisor"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Activity Log</h1>
              <p className="text-xs text-muted-foreground">{total.toLocaleString()} events — click a row for full detail & proof.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => mutate()}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 flex flex-col gap-4">
        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <input
            type="search"
            placeholder="Search…"
            value={filters.q}
            onChange={(e) => updateFilter('q', e.target.value)}
            className="col-span-2 bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filters.userId}
            onChange={(e) => updateFilter('userId', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All users</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>{u.name ?? u.email} · {u.role}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={filters.since}
            onChange={(e) => updateFilter('since', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={filters.until}
            onChange={(e) => updateFilter('until', e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {(filters.q || filters.category || filters.userId || filters.status || filters.since || filters.until || filters.action) && (
            <button
              type="button"
              onClick={clearFilters}
              className="col-span-2 md:col-span-4 lg:col-span-7 text-xs text-primary hover:underline text-left"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Logs table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {['Timestamp', 'User', 'Role', 'Action', 'Category', 'Entity', 'Method', 'Status', 'IP'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading && (
                  <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">Loading…</td></tr>
                )}
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className="hover:bg-accent/30 cursor-pointer"
                  >
                    <td className="px-3 py-2 text-[11px] text-muted-foreground whitespace-nowrap">{fmtTime(log.createdAt)}</td>
                    <td className="px-3 py-2 text-xs text-foreground">{log.userName ?? '—'}</td>
                    <td className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">{log.userRole ?? '—'}</td>
                    <td className="px-3 py-2 text-xs font-mono text-foreground">{log.action}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase border ${
                        CATEGORY_COLORS[log.category] ?? CATEGORY_COLORS.GENERAL
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {log.entity ? `${log.entity}${log.entityId ? ` · ${log.entityId.slice(-6)}` : ''}` : '—'}
                    </td>
                    <td className="px-3 py-2 text-[10px] font-mono text-muted-foreground">{log.method ?? '—'}</td>
                    <td className={`px-3 py-2 text-xs font-medium ${
                      log.status === 'FAILED' ? 'text-rose-600' :
                      log.status === 'DENIED' ? 'text-amber-600' :
                      'text-emerald-600'
                    }`}>{log.status}</td>
                    <td className="px-3 py-2 text-[10px] font-mono text-muted-foreground">{log.ipAddress ?? '—'}</td>
                  </tr>
                ))}
                {!isLoading && logs.length === 0 && (
                  <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">No activity matches your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {logs.length === 0 ? 0 : skip + 1}–{skip + logs.length} of {total.toLocaleString()}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={skip === 0}
                onClick={() => setSkip(Math.max(0, skip - pageSize))}
                className="px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <button
                type="button"
                disabled={skip + logs.length >= total}
                onClick={() => setSkip(skip + pageSize)}
                className="px-3 py-1.5 rounded border border-border hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border-l border-border h-full overflow-y-auto"
          >
            <div className="p-5 border-b border-border flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Activity proof</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Immutable audit record</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Log ID" value={selected.id} mono />
              <Field label="When" value={fmtTime(selected.createdAt)} />
              <Field label="User" value={selected.userName ?? '(unauthenticated)'} />
              <Field label="Role" value={selected.userRole ?? '—'} />
              <Field label="Action" value={selected.action} mono />
              <Field label="Category" value={selected.category} />
              <Field label="Status" value={selected.status} />
              <Field label="Entity" value={selected.entity ?? '—'} />
              <Field label="Entity ID" value={selected.entityId ?? '—'} mono />
              <Field label="Method" value={selected.method ?? '—'} mono />
              <Field label="Path" value={selected.path ?? '—'} mono />
              <Field label="IP Address" value={selected.ipAddress ?? '—'} mono />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">User agent</p>
                <p className="text-[11px] font-mono text-foreground break-all">{selected.userAgent ?? '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Metadata (proof)</p>
                <pre className="text-[11px] font-mono text-foreground bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
                  {selected.metadata ? JSON.stringify(selected.metadata, null, 2) : '(none)'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-xs text-foreground ${mono ? 'font-mono break-all' : ''}`}>{value}</p>
    </div>
  );
}

export default function SupervisorLogsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm text-muted-foreground">Loading…</div>}>
      <LogsInner />
    </Suspense>
  );
}
