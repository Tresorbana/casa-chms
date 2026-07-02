'use client';
import React, { Suspense, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams, useRouter } from 'next/navigation';
import { HOTEL_INFO, hotelFullLocation } from '@/lib/hotel-info';
import { formatPaymentMethod } from '@/lib/payment-methods';
import { InvoiceToolbar } from '@/components/invoice/InvoiceToolbar';
import { toast } from 'sonner';

function RestaurantInvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');
  const viewParam = searchParams.get('view');

  const [status, setStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [signatureInput, setSignatureInput] = useState('');
  const [savingSignature, setSavingSignature] = useState(false);

  const { data: apiInvoice, isLoading, mutate } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  const displayStatus = status ?? apiInvoice?.status ?? 'UNPAID';
  const displayMethod = paymentMethod ?? apiInvoice?.paymentMethod ?? null;
  const isPaid = displayStatus === 'PAID';
  const view = viewParam === 'final' && isPaid ? 'final' : 'client';
  const isClientCopy = view === 'client';
  const hasSignature = Boolean(apiInvoice?.guestSignature);

  const saveSignature = async () => {
    if (!invoiceId || !signatureInput.trim()) {
      toast.error('Enter the guest name for signature');
      return;
    }
    setSavingSignature(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestSignature: signatureInput.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save signature');
      }
      toast.success('Client signature recorded');
      mutate();
      setSignatureInput('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save signature');
    } finally {
      setSavingSignature(false);
    }
  };

  if (!invoiceId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">No invoice ID specified.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!apiInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-muted-foreground/40 block mb-3">receipt_long</span>
          <p className="text-sm font-medium text-foreground">Invoice not found</p>
          <button type="button" onClick={() => router.back()} className="mt-4 text-sm text-primary hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const subtotal =
    apiInvoice.items?.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0) ??
    apiInvoice.amount;
  const itemCount = apiInvoice.items?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ?? 0;
  const grandTotal = apiInvoice.amount;
  const invoiceRef = `TED-${apiInvoice.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(apiInvoice.date);
  const paidDate = apiInvoice.paidAt ? new Date(apiInvoice.paidAt) : null;

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <style>{`
        @media print {
          @page { margin: 10mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .inv-card { box-shadow: none !important; border: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <InvoiceToolbar
        invoiceId={apiInvoice.id}
        status={displayStatus}
        paymentMethod={displayMethod}
        guestSignature={apiInvoice.guestSignature}
        invoiceType="RESTAURANT"
        backLabel="Back to Restaurant"
        backHref="/pos/restaurant"
        onStatusChange={(s, m) => {
          setStatus(s);
          setPaymentMethod(m ?? null);
          mutate();
        }}
      />

      <div className="p-4 lg:p-8 flex justify-center">
        <div className="inv-card bg-card w-full max-w-[720px] shadow-sm rounded-xl overflow-hidden border border-border print:border-0">
          <div className="h-1 bg-primary" />

          <div className="px-8 pt-6 pb-2 no-print">
            <span
              className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isClientCopy
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isClientCopy ? 'Guest copy — signature required' : 'Final receipt — paid'}
            </span>
          </div>

          <div className="flex flex-col items-center pt-4 pb-6 px-8 border-b border-border">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-sm mb-3">
              <span className="material-symbols-outlined text-primary-foreground text-[30px]">restaurant</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{HOTEL_INFO.name}</h1>
            <p className="text-sm font-medium text-primary">Restaurant & Bar</p>
            <p className="text-xs text-muted-foreground mt-1 text-center">{hotelFullLocation()}</p>
            <p className="text-xs text-muted-foreground">{HOTEL_INFO.phone}</p>
          </div>

          <div className="bg-muted/40 px-8 py-4 flex justify-between items-center border-b border-border">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {isClientCopy ? 'Proforma invoice' : 'Tax receipt'}
              </p>
              <p className="font-semibold text-primary text-sm">{invoiceRef}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Date & time</p>
              <p className="text-sm font-medium text-foreground">
                {invoiceDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {invoiceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {!isClientCopy && paidDate && (
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Paid {paidDate.toLocaleDateString()} · {formatPaymentMethod(displayMethod)}
                </p>
              )}
            </div>
          </div>

          <div className="px-8 py-5 border-b border-border">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1">Guest</p>
                <p className="text-lg font-semibold text-foreground">{apiInvoice.guestName}</p>
              </div>
              <span
                className={`text-[10px] font-medium uppercase px-2.5 py-1 rounded-full flex-shrink-0 ${
                  isPaid
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isPaid ? `Paid · ${formatPaymentMethod(displayMethod)}` : 'Awaiting payment'}
              </span>
            </div>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Ordered items</p>
                <p className="text-sm text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} on this bill</p>
              </div>
              <div className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                {apiInvoice.items?.length || 0} line item{(apiInvoice.items?.length || 0) !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase">Item</th>
                    <th className="text-center px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase w-16">Qty</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase w-32">Unit</th>
                    <th className="text-right px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase w-32">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {apiInvoice.items?.map(
                    (item: { id: string; description: string; quantity: number; price: number }, i: number) => (
                      <tr key={item.id || i} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">{item.description}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Menu line #{String(i + 1).padStart(2, '0')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-muted-foreground font-medium">{item.quantity}</td>
                        <td className="px-4 py-4 text-right text-muted-foreground">RWF {item.price.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right font-semibold text-foreground">
                          RWF {(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Order summary</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium text-foreground">{itemCount}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Lines</span>
                    <span className="font-medium text-foreground">{apiInvoice.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium text-foreground">{formatPaymentMethod(displayMethod)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-primary/5 p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Totals</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>RWF {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-border">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-semibold text-primary">RWF {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isClientCopy ? (
            <div className="px-8 pb-8 border-t border-dashed border-border pt-6">
              <p className="text-center text-muted-foreground text-xs mb-4">
                I confirm the items and total above. By signing, I agree to pay the amount due.
              </p>
              {hasSignature ? (
                <div className="text-center space-y-2">
                  <div className="max-w-[280px] mx-auto border-b-2 border-foreground/30 pb-1 font-serif text-lg text-foreground italic">
                    {apiInvoice.guestSignature}
                  </div>
                  <p className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">
                    Signed by client
                  </p>
                </div>
              ) : (
                <div className="no-print max-w-sm mx-auto space-y-3">
                  <input
                    type="text"
                    placeholder="Guest full name (signature)"
                    value={signatureInput}
                    onChange={(e) => setSignatureInput(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={saveSignature}
                    disabled={savingSignature}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {savingSignature ? 'Saving...' : 'Confirm client signature'}
                  </button>
                </div>
              )}
              {!hasSignature && (
                <div className="hidden print:block mt-4 max-w-[280px] mx-auto">
                  <div className="h-12 border-b border-foreground/40" />
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-2">
                    Guest signature
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-8 pb-8 border-t border-border pt-6 space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <div>
                  <p className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider">Payment status</p>
                  <p className="text-lg font-semibold text-emerald-900">PAID</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider">Method</p>
                  <p className="text-sm font-semibold text-emerald-900">{formatPaymentMethod(displayMethod)}</p>
                </div>
              </div>
              {apiInvoice.guestSignature && (
                <div className="text-center pt-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Client signature on file</p>
                  <p className="font-serif italic text-foreground">{apiInvoice.guestSignature}</p>
                </div>
              )}
              <p className="text-center text-xs text-muted-foreground">Thank you for dining at {HOTEL_INFO.name}</p>
            </div>
          )}

          <div className="bg-muted/30 border-t border-border px-8 py-4 text-center text-xs text-muted-foreground">
            {HOTEL_INFO.name} — Restaurant & Bar · {HOTEL_INFO.phone}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <RestaurantInvoiceContent />
    </Suspense>
  );
}
