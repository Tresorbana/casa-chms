'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type InvoiceToolbarProps = {
  invoiceId: string;
  status: string;
  backLabel?: string;
  onStatusChange?: (status: string) => void;
};

export function InvoiceToolbar({
  invoiceId,
  status,
  backLabel = 'Back',
  onStatusChange,
}: InvoiceToolbarProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [markingPaid, setMarkingPaid] = useState(false);

  const isPaid = currentStatus === 'PAID';

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update invoice');
      }
      setCurrentStatus('PAID');
      onStatusChange?.('PAID');
      toast.success('Invoice marked as paid');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark as paid');
    } finally {
      setMarkingPaid(false);
    }
  };

  return (
    <div className="no-print sticky top-0 z-50 px-4 lg:px-6 py-3 flex items-center justify-between gap-4 bg-card border-b border-border">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {backLabel}
      </button>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase ${
            isPaid
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {currentStatus}
        </span>
        {!isPaid && (
          <button
            type="button"
            onClick={handleMarkPaid}
            disabled={markingPaid}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {markingPaid ? 'Updating...' : 'Mark as paid'}
          </button>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Print / PDF
        </button>
      </div>
    </div>
  );
}
