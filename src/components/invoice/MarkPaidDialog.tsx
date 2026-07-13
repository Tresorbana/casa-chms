'use client';

import { useState } from 'react';
import { PAYMENT_METHODS, type PaymentMethodId } from '@/lib/payment-methods';

type MarkPaidDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethodId) => Promise<void>;
};

export function MarkPaidDialog({
  open,
  onClose,
  onConfirm,
}: MarkPaidDialogProps) {
  const [method, setMethod] = useState<PaymentMethodId>('CASH');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(method);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Record payment</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Select how the guest paid to generate the final invoice.</p>
        </div>
        <div className="p-5 space-y-2">
          {PAYMENT_METHODS.map((pm) => (
            <label
              key={pm.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                method === pm.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={pm.id}
                checked={method === pm.id}
                onChange={() => setMethod(pm.id)}
                className="accent-primary"
              />
              <span className="text-sm font-medium text-foreground">{pm.label}</span>
            </label>
          ))}
        </div>
        <div className="p-5 border-t border-border flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Confirm & finalize'}
          </button>
        </div>
      </div>
    </div>
  );
}
