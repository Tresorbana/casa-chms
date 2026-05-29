'use client';
import React, { Suspense, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSearchParams, useRouter } from 'next/navigation';
import { HOTEL_INFO } from '@/lib/hotel-info';
import { HotelBrandMark } from '@/components/invoice/HotelBrandMark';
import { InvoiceToolbar } from '@/components/invoice/InvoiceToolbar';

function RestaurantInvoiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get('id');
  const [status, setStatus] = useState<string | null>(null);

  const { data: apiInvoice, isLoading, mutate } = useSWR(
    invoiceId ? `/api/invoices/${invoiceId}` : null,
    fetcher
  );

  const displayStatus = status ?? apiInvoice?.status ?? 'UNPAID';

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
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const subtotal =
    apiInvoice.items?.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0) ??
    apiInvoice.amount;
  const grandTotal = apiInvoice.amount;
  const invoiceRef = `INV-${apiInvoice.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(apiInvoice.date);

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
        backLabel="Back to POS"
        onStatusChange={(s) => {
          setStatus(s);
          mutate();
        }}
      />

      <div className="p-4 lg:p-8 flex justify-center">
        <div className="inv-card bg-card w-full max-w-[720px] shadow-sm rounded-xl overflow-hidden border border-border print:border-0">
          <div className="h-1 bg-primary" />

          <div className="flex flex-col items-center pt-8 pb-6 px-8 border-b border-border">
            <HotelBrandMark size="sm" centered showTagline />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {HOTEL_INFO.address} · {HOTEL_INFO.city}
            </p>
            <p className="text-xs text-muted-foreground">{HOTEL_INFO.phone}</p>
          </div>

          <div className="bg-muted/40 px-8 py-4 flex justify-between items-center border-b border-border">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Invoice no.</p>
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
            </div>
          </div>

          <div className="px-8 py-5 border-b border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1">Guest</p>
                <p className="text-lg font-semibold text-foreground">{apiInvoice.guestName}</p>
              </div>
              <span
                className={`text-[10px] font-medium uppercase px-2.5 py-1 rounded-full ${
                  displayStatus === 'PAID'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {displayStatus}
              </span>
            </div>
          </div>

          <div className="px-8 py-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 text-[11px] font-medium text-muted-foreground uppercase">Item</th>
                  <th className="text-center pb-3 text-[11px] font-medium text-muted-foreground uppercase w-12">Qty</th>
                  <th className="text-right pb-3 text-[11px] font-medium text-muted-foreground uppercase w-28">Price</th>
                  <th className="text-right pb-3 text-[11px] font-medium text-muted-foreground uppercase w-28">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiInvoice.items?.map((item: { id: string; description: string; quantity: number; price: number }, i: number) => (
                  <tr key={item.id || i}>
                    <td className="py-3 font-medium text-foreground">{item.description}</td>
                    <td className="py-3 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-muted-foreground">RWF {item.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-medium text-foreground">
                      RWF {(item.quantity * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 pb-8 flex flex-col items-end gap-2 border-t border-border pt-6">
            <div className="flex justify-between w-full max-w-[260px] text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>RWF {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-[260px] pt-3 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-xl font-semibold text-primary">RWF {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border px-8 py-6 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Thank you for your visit
            </p>
            <p className="text-xs text-muted-foreground">{HOTEL_INFO.phone}</p>
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
