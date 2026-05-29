'use client';
import React, { Suspense, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams, useRouter } from 'next/navigation';
import { HOTEL_INFO } from '@/lib/hotel-info';
import { HotelBrandMark } from '@/components/invoice/HotelBrandMark';
import { InvoiceToolbar } from '@/components/invoice/InvoiceToolbar';

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');
  const [status, setStatus] = useState<string | null>(null);

  const { data: invoice, isLoading, mutate } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  const displayStatus = status ?? invoice?.status ?? 'UNPAID';

  if (!invoiceId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">No invoice specified.</p>
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

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-destructive font-medium">Invoice not found.</p>
        <button type="button" onClick={() => router.back()} className="ml-4 text-sm text-primary">
          Back
        </button>
      </div>
    );
  }

  const grandTotal = invoice.amount;
  const invoiceRef = `INV-${invoice.id.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <style>{`
        @media print {
          @page { margin: 10mm; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <InvoiceToolbar
        invoiceId={invoice.id}
        status={displayStatus}
        onStatusChange={(s) => {
          setStatus(s);
          mutate();
        }}
      />

      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-[680px] bg-card shadow-sm rounded-xl overflow-hidden border border-border">
          <div className="h-1 bg-primary" />

          <div className="flex flex-col items-center pt-8 pb-6 px-8 border-b border-border">
            <HotelBrandMark size="sm" centered />
            <p className="text-xs text-muted-foreground mt-2 text-center">{HOTEL_INFO.address} · {HOTEL_INFO.city}</p>
          </div>

          <div className="bg-muted/40 px-8 py-4 flex justify-between border-b border-border">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Invoice</p>
              <p className="font-semibold text-primary text-sm">{invoiceRef}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Date</p>
              <p className="font-medium text-sm text-foreground">
                {new Date(invoice.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="px-8 py-5 border-b border-border">
            <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1">Billed to</p>
            <p className="text-lg font-semibold text-foreground">{invoice.guestName}</p>
          </div>

          <div className="px-8 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 text-[11px] font-medium text-muted-foreground uppercase">Description</th>
                  <th className="text-center pb-3 text-[11px] font-medium text-muted-foreground uppercase w-12">Qty</th>
                  <th className="text-right pb-3 text-[11px] font-medium text-muted-foreground uppercase w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoice.items?.map(
                  (item: { id: string; description: string; quantity: number; price: number }, i: number) => (
                    <tr key={item.id || i}>
                      <td className="py-3 font-medium text-foreground">{item.description}</td>
                      <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
                      <td className="py-3 text-right font-medium text-foreground">
                        RWF {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
                {invoice.subInvoices?.map((sub: { id: string; type: string; amount: number }) => (
                  <tr key={sub.id} className="bg-muted/20">
                    <td className="py-3 font-medium text-foreground">
                      Invoice #{sub.id.slice(-6).toUpperCase()}
                      <span className="ml-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                        {sub.type}
                      </span>
                    </td>
                    <td className="py-3 text-center text-muted-foreground">1</td>
                    <td className="py-3 text-right font-medium text-foreground">RWF {sub.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 pb-8 flex flex-col items-end border-t border-border pt-5">
            <div className="flex justify-between w-full max-w-[240px] pt-3 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-xl font-semibold text-primary">RWF {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2 border-t border-dashed border-border">
            <p className="text-center text-muted-foreground text-xs mb-6">
              I agree that the total amount above will be charged to my account.
            </p>
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] border-b border-border mb-2 h-10" />
              <p className="text-[10px] font-medium text-primary uppercase tracking-wider">Guest signature</p>
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border py-4 px-8 text-center">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {HOTEL_INFO.name} · {HOTEL_INFO.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
