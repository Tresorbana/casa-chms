'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatPaymentMethod, type PaymentMethodId } from '@/lib/payment-methods';
import { MarkPaidDialog } from '@/components/invoice/MarkPaidDialog';

type InvoiceToolbarProps = {
  invoiceId: string;
  status: string;
  paymentMethod?: string | null;
  guestSignature?: string | null;
  invoiceType?: string;
  backLabel?: string;
  onStatusChange?: (status: string, paymentMethod?: string | null) => void;
};

export function InvoiceToolbar({
  invoiceId,
  status,
  paymentMethod,
  guestSignature,
  invoiceType,
  backLabel = 'Back',
  onStatusChange,
}: InvoiceToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentMethod, setCurrentMethod] = useState(paymentMethod);
  const [showPayDialog, setShowPayDialog] = useState(false);

  const isPaid = currentStatus === 'PAID';
  const isRestaurant = invoiceType === 'RESTAURANT';
  const view = searchParams.get('view') || (isPaid ? 'final' : 'client');

  const setView = (next: 'client' | 'final') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', next);
    router.replace(`?${params.toString()}`);
  };

  const handleMarkPaid = async (method: PaymentMethodId) => {
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID', paymentMethod: method }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update invoice');
    }
    setCurrentStatus('PAID');
    setCurrentMethod(method);
    onStatusChange?.('PAID', method);
    toast.success(`Paid via ${formatPaymentMethod(method)}`);
    if (isRestaurant) {
      setView('final');
    }
  };

  return (
    <>
      <div className="no-print sticky top-0 z-50 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-card border-b border-border">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {backLabel}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {isRestaurant && (
            <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
              <button
                type="button"
                onClick={() => setView('client')}
                className={`px-3 py-1.5 transition-colors ${
                  view === 'client' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Guest copy
              </button>
              <button
                type="button"
                onClick={() => isPaid && setView('final')}
                disabled={!isPaid}
                className={`px-3 py-1.5 transition-colors disabled:opacity-40 ${
                  view === 'final' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                }`}
              >
                Final receipt
              </button>
            </div>
          )}

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase ${
              isPaid
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isPaid ? `Paid · ${formatPaymentMethod(currentMethod)}` : currentStatus}
          </span>

          {!isPaid && (
            <button
              type="button"
              onClick={() => setShowPayDialog(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Mark as paid
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-accent transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Print
          </button>
        </div>
      </div>

      <MarkPaidDialog
        open={showPayDialog}
        onClose={() => setShowPayDialog(false)}
        onConfirm={handleMarkPaid}
        requireSignature={isRestaurant}
        hasSignature={Boolean(guestSignature)}
      />
    </>
  );
}
