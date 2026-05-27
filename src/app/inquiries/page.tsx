'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

function InquiryCard({ inq }: { inq: any }) {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleStatusUpdate = async (id: string, newStatus: string, response?: string) => {
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, response }),
      });
      mutate('/api/inquiries');
      toast.success('Inquiry updated');
    } catch {
      toast.error('Failed to update inquiry');
    }
  };

  const statusColor = inq.status === 'NEW'
    ? 'bg-blue-50 text-blue-700 border-blue-200'
    : inq.status === 'REPLIED'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-muted text-muted-foreground border-border';

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-shadow hover:shadow-md ${inq.status === 'NEW' ? 'border-primary/30' : 'border-border'}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm ${inq.status === 'NEW' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {inq.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{inq.name}</h3>
              <p className="text-xs text-muted-foreground">{inq.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className="text-[11px] text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border uppercase ${statusColor}`}>{inq.status}</span>
          </div>
        </div>

        {inq.checkIn && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            {[
              { label: 'Check In', value: new Date(inq.checkIn).toLocaleDateString() },
              { label: 'Check Out', value: new Date(inq.checkOut).toLocaleDateString() },
              { label: 'Guests', value: inq.guests },
              { label: 'Room Type', value: inq.roomType },
            ].map(item => (
              <div key={item.label}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-medium text-foreground capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-muted/40 p-4 rounded-lg mb-3 border border-border">
          {inq.subject && <h4 className="text-sm font-medium text-foreground mb-1">{inq.subject}</h4>}
          <p className="text-sm text-muted-foreground leading-relaxed">{inq.message}</p>
        </div>

        {inq.response && (
          <div className="bg-emerald-50 p-4 rounded-lg mb-3 border border-emerald-200">
            <h4 className="text-xs font-medium text-emerald-700 mb-1 uppercase tracking-wider">Our Response</h4>
            <p className="text-sm text-emerald-800 leading-relaxed">{inq.response}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {inq.status === 'NEW' && (
            <button
              onClick={() => handleStatusUpdate(inq.id, 'READ')}
              className="text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              Mark Read
            </button>
          )}
          <a
            href={`mailto:${inq.email}?subject=Re: ${inq.subject || 'Your Inquiry'}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">email</span> Email
          </a>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">reply</span>
            {inq.response ? 'Update Reply' : 'Reply'}
          </button>
        </div>

        {isReplying && (
          <div className="mt-4 pt-4 border-t border-border">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response..."
              className="w-full p-3 text-sm border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-ring outline-none mb-3 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsReplying(false)} className="text-xs text-muted-foreground px-4 py-2 hover:text-foreground transition-colors">Cancel</button>
              <button
                onClick={() => { handleStatusUpdate(inq.id, 'REPLIED', replyText); setIsReplying(false); }}
                className="text-xs font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send Response
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  const { data: inquiriesData, isLoading } = useSWR('/api/inquiries', fetcher, {
    onError: () => toast.error('Failed to load inquiries'),
  });
  const inquiries = Array.isArray(inquiriesData) ? inquiriesData : [];
  const [filter, setFilter] = useState('ALL');

  const filtered = inquiries.filter((inq: any) => filter === 'ALL' || inq.status === filter);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Web Inquiries"
        description="Messages and booking requests from the website."
        actions={
          <div className="flex gap-1 p-1 bg-muted border border-border rounded-lg">
            {['ALL', 'NEW', 'READ', 'REPLIED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === status ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        }
      />

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading inquiries...</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((inq: any) => <InquiryCard key={inq.id} inq={inq} />)}
          {filtered.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-3 block">inbox</span>
              <p className="text-sm text-muted-foreground">No inquiries found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
