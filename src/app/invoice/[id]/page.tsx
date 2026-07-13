'use client';
import React, { Suspense, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HOTEL_INFO } from '@/lib/hotel-info';
import { formatPaymentMethod } from '@/lib/payment-methods';
import { InvoiceToolbar } from '@/components/invoice/InvoiceToolbar';

function InvoicePageContent() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
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
  const displayMethod = paymentMethod ?? invoice?.paymentMethod ?? null;
  const isPaid = displayStatus === 'PAID';

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

  const grandTotal = invoice.amount;
  const invoiceRef = `INV-${invoice.id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(invoice.date);

  const checkIn = invoice.booking?.checkIn ? new Date(invoice.booking.checkIn) : null;
  const checkOut = invoice.booking?.checkOut ? new Date(invoice.booking.checkOut) : null;
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const fmtDoneAt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <style>{`
        @media print {
          @page { margin: 15mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .inv-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <InvoiceToolbar
        invoiceId={invoice.id}
        status={displayStatus}
        paymentMethod={displayMethod}
        backLabel="Back to Invoices"
        backHref="/invoices"
        onStatusChange={(s, m) => {
          setStatus(s);
          setPaymentMethod(m ?? null);
          mutate();
        }}
      />

      <div className="p-4 lg:p-8 flex justify-center">
        <div className="inv-card bg-white w-full max-w-[760px] shadow-sm border border-border print:shadow-none print:border-0">

          {/* Status badge — screen only */}
          <div className="no-print px-6 pt-4 flex flex-wrap gap-2">
            <span className={`inline-flex text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isPaid
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isPaid ? `Paid · ${formatPaymentMethod(displayMethod)}` : 'Awaiting payment'}
            </span>
          </div>

          {/* ── PRINTABLE INVOICE BODY ── */}
          <div className="p-8 print:p-6">

            {/* Header */}
            <div className="text-center mb-6 pb-4 border-b-2 border-black">
              <h1 className="text-xl font-bold uppercase tracking-wide">{HOTEL_INFO.name.toUpperCase()}</h1>
              <p className="text-sm">{HOTEL_INFO.address}, {HOTEL_INFO.region}</p>
              <p className="text-sm">Tel: {HOTEL_INFO.phone}</p>
              <h2 className="text-base font-bold uppercase underline mt-3 tracking-widest">INVOICE</h2>
            </div>

            {/* Ref + Date row */}
            <div className="flex justify-between text-sm mb-2">
              <span><span className="font-bold">Ref No:</span> {invoiceRef}</span>
              <span><span className="font-bold">Date:</span> {fmtDate(invoiceDate)}</span>
            </div>

            {/* Guest */}
            <div className="text-sm mb-1">
              <span className="font-bold">RECEIVED BY: </span>
              <span className="font-bold uppercase">{invoice.guestName}</span>
            </div>

            {/* Stay details if booking linked */}
            {checkIn && checkOut ? (
              <div className="text-sm mb-5 flex flex-wrap gap-x-6 gap-y-1">
                <span><span className="font-bold">Check-in:</span> {fmtDate(checkIn)}</span>
                <span><span className="font-bold">Check-out:</span> {fmtDate(checkOut)}</span>
                {nights && <span><span className="font-bold">Nights:</span> {nights}</span>}
                {invoice.booking?.room && (
                  <span><span className="font-bold">Room:</span> {invoice.booking.room.number} ({invoice.booking.room.type})</span>
                )}
              </div>
            ) : (
              <div className="mb-5" />
            )}

            {/* Items table */}
            <table className="w-full border-collapse text-sm mb-0" style={{ borderSpacing: 0 }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th className="border border-black px-2 py-2 text-left font-bold whitespace-nowrap">DATE</th>
                  <th className="border border-black px-2 py-2 text-left font-bold">Description</th>
                  <th className="border border-black px-2 py-2 text-center font-bold w-12">Qty</th>
                  <th className="border border-black px-2 py-2 text-center font-bold w-12">FRQ</th>
                  <th className="border border-black px-2 py-2 text-center font-bold w-16">NIGHTS</th>
                  <th className="border border-black px-2 py-2 text-right font-bold whitespace-nowrap w-32">U.Price/RWF</th>
                  <th className="border border-black px-2 py-2 text-right font-bold whitespace-nowrap w-32">Total/RWF</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map(
                  (item: { id: string; description: string; quantity: number; price: number }, i: number) => (
                    <tr key={item.id || i}>
                      <td className="border border-black px-2 py-2 whitespace-nowrap">
                        {fmtDate(checkIn ?? invoiceDate)}
                      </td>
                      <td className="border border-black px-2 py-2">{item.description}</td>
                      <td className="border border-black px-2 py-2 text-center">{item.quantity}</td>
                      <td className="border border-black px-2 py-2 text-center">1</td>
                      <td className="border border-black px-2 py-2 text-center">{nights ?? item.quantity}</td>
                      <td className="border border-black px-2 py-2 text-right">{item.price.toLocaleString()}</td>
                      <td className="border border-black px-2 py-2 text-right font-medium">
                        {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
                {invoice.subInvoices?.map((sub: { id: string; type: string; amount: number }) => (
                  <tr key={sub.id}>
                    <td className="border border-black px-2 py-2 whitespace-nowrap">{fmtDate(invoiceDate)}</td>
                    <td className="border border-black px-2 py-2">
                      Invoice #{sub.id.slice(-6).toUpperCase()} ({sub.type})
                    </td>
                    <td className="border border-black px-2 py-2 text-center">1</td>
                    <td className="border border-black px-2 py-2 text-center">1</td>
                    <td className="border border-black px-2 py-2 text-center">—</td>
                    <td className="border border-black px-2 py-2 text-right">{sub.amount.toLocaleString()}</td>
                    <td className="border border-black px-2 py-2 text-right font-medium">
                      {sub.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="font-bold">
                  <td className="border border-black px-2 py-2" colSpan={3}>TOTAL</td>
                  <td className="border border-black px-2 py-2 text-center" colSpan={3}>VAT INCLUDE</td>
                  <td className="border border-black px-2 py-2 text-right text-base">
                    {grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Done at */}
            <div className="mt-8 mb-10">
              <p className="text-sm font-bold">Done at RUTSIRO, {fmtDoneAt(invoiceDate)}</p>
            </div>

            {/* Signature section */}
            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <p className="font-medium uppercase">Delivered by KAMDINE COMPANY LTD</p>
                <div className="mt-10 border-b border-black print:mt-16" />
                <p className="mt-1 text-xs">{invoice.createdByName ?? ''}</p>
                <p className="mt-3 text-xs">Date: ........../........../............</p>
              </div>
              <div>
                <p className="font-medium uppercase">Received by</p>
                <div className="mt-10 border-b border-black print:mt-16" />
                <p className="mt-1 text-xs font-semibold uppercase">{invoice.guestName}</p>
                <p className="mt-3 text-xs">Tel: .............................................</p>
                <p className="mt-3 text-xs">Date: ........../........../............</p>
              </div>
            </div>

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
