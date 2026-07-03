'use client';
import React, { Suspense, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HOTEL_INFO } from '@/lib/hotel-info';
import { formatPaymentMethod } from '@/lib/payment-methods';
import { HotelBrandMark } from '@/components/invoice/HotelBrandMark';
import { InvoiceToolbar } from '@/components/invoice/InvoiceToolbar';

function InvoicePageContent() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const { data: invoice, isLoading, mutate } = useSWR(
    params.id ? `/api/invoices/${params.id}` : null,
    fetcher
  );

  useEffect(() => {
    if (invoice?.type === 'RESTAURANT') {
      const view = invoice.status === 'PAID' ? 'final' : 'client';
      router.replace(`/invoice/restaurant?id=${invoice.id}&view=${view}`);
    }
  }, [invoice, router]);

  const displayStatus = status ?? invoice?.status ?? 'UNPAID';
  const displayMethod = invoice?.paymentMethod;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-muted-foreground/40 block mb-3">receipt_long</span>
          <p className="text-sm font-medium text-foreground">Invoice not found</p>
        </div>
      </div>
    );
  }

  const subtotal = invoice.items?.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0) ?? invoice.amount;
  const subInvoicesTotal = invoice.subInvoices?.reduce((s: number, i: { amount: number }) => s + i.amount, 0) ?? 0;
  const grandTotal = invoice.amount;
  const invoiceRef = `INV-${invoice.id.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <style>{`
        @media print {
          @page { margin: 12mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .invoice-wrap { padding: 0 !important; }
          .invoice-card { box-shadow: none !important; border: none !important; }
          main { padding-left: 0 !important; }
        }
      `}</style>

      <InvoiceToolbar
        invoiceId={invoice.id}
        status={displayStatus}
        paymentMethod={displayMethod}
        guestSignature={invoice.guestSignature}
        invoiceType={invoice.type}
        onStatusChange={(s) => {
          setStatus(s);
          mutate();
        }}
      />

      <div className="invoice-wrap p-4 lg:p-8 flex justify-center">
        <div className="invoice-card bg-card w-full max-w-[860px] shadow-sm rounded-xl overflow-hidden border border-border print:rounded-none print:border-0">
          <div className="h-1 bg-primary" />

          <div className="p-8 md:p-12">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-10">
              <HotelBrandMark showContact />
              <div className="text-left sm:text-right flex-shrink-0">
                <h2 className="text-3xl font-semibold text-muted-foreground/40 uppercase tracking-tight leading-none">
                  Invoice
                </h2>
                <p className="text-base font-semibold text-primary mt-2">{invoiceRef}</p>
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Date:</span>{' '}
                    {new Date(invoice.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Type:</span> {invoice.type || 'ROOM'}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Status:</span>{' '}
                    <span className={displayStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                      {displayStatus}
                      {displayStatus === 'PAID' && displayMethod
                        ? ` · ${formatPaymentMethod(displayMethod)}`
                        : ''}
                    </span>
                  </p>
                  {invoice.createdByName && (
                    <p>
                      <span className="font-medium text-foreground">Issued by:</span>{' '}
                      {invoice.createdByName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/40 rounded-lg p-5 mb-8 flex flex-col sm:flex-row justify-between gap-4 border border-border">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Billed to
                </p>
                <h3 className="text-lg font-semibold text-foreground">{invoice.guestName}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Guest · {invoice.guestSignature ? 'Signed' : 'Pending signature'}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">From</p>
                <h3 className="text-sm font-semibold text-foreground">{HOTEL_INFO.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{HOTEL_INFO.email}</p>
              </div>
            </div>

            <div className="mb-8 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase w-10">#</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase">Description</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-center w-16">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-right w-32">
                      Unit price
                    </th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-right w-32">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoice.items?.map((item: { id: string; description: string; quantity: number; price: number }, i: number) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{item.description}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">RWF {item.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        RWF {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {invoice.subInvoices?.map((sub: { id: string; type: string; amount: number }) => (
                    <tr key={sub.id} className="bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground text-xs">—</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">Invoice #{sub.id.slice(-6).toUpperCase()}</span>
                        <span className="ml-2 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                          {sub.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">1</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">RWF {sub.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        RWF {sub.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-10">
              <div className="w-72 space-y-2">
                {invoice.items && invoice.items.length > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>RWF {subtotal.toLocaleString()}</span>
                  </div>
                )}
                {subInvoicesTotal > 0 && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Linked invoices</span>
                    <span>RWF {subInvoicesTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg pt-3 border-t border-border">
                  <span className="font-semibold text-foreground">Grand total</span>
                  <span className="font-semibold text-primary">RWF {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-border pt-8">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-10">
                  Guest signature
                </p>
                <div className="h-px bg-border w-full mb-2" />
                <p className="text-xs text-muted-foreground">By signing, I confirm the above charges are correct.</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-10">
                  Authorized by
                </p>
                <div className="h-px bg-border w-full mb-2" />
                <p className="text-xs text-muted-foreground">
                  {invoice.createdByName ? invoice.createdByName : `${HOTEL_INFO.name} · Front desk`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
            <span>
              {HOTEL_INFO.name} — {HOTEL_INFO.region}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">call</span>
              {HOTEL_INFO.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <InvoicePageContent />
    </Suspense>
  );
}
