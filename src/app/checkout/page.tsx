'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import { HOTEL_INFO, hotelFullLocation } from '@/lib/hotel-info';
import { HotelBrandMark } from '@/components/invoice/HotelBrandMark';
import { MarkPaidDialog } from '@/components/invoice/MarkPaidDialog';
import { formatPaymentMethod, type PaymentMethodId } from '@/lib/payment-methods';
import { toast } from 'sonner';

type OccupiedRow = {
  roomId: string;
  roomNumber: string;
  roomType: string;
  floorName: string | null;
  guestName: string;
  guestPhone: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  balanceDue: number;
  bookingId: string;
};

type FolioLine = { description: string; quantity: number; price: number };

type CheckoutDetail = {
  room: { id: string; number: string; type: string; price: number };
  booking: { id: string; checkIn: string; checkOut: string };
  folio: {
    guestName: string;
    guestEmail: string | null;
    guestPhone: string | null;
    nights: number;
    lineItems: FolioLine[];
    roomLineTotal: number;
    servicesTotal: number;
    grandTotal: number;
  };
};

function OccupiedRoomsList({
  occupied,
  onSelect,
}: {
  occupied: OccupiedRow[];
  onSelect: (roomId: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Occupied rooms</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {occupied.length} room{occupied.length !== 1 ? 's' : ''} ready for checkout
        </p>
      </div>
      {occupied.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">bed</span>
          <p className="text-sm">No occupied rooms at the moment</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {['Room', 'Guest', 'Stay', 'Balance due', ''].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider ${
                      h === '' ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {occupied.map((row) => (
                <tr key={row.roomId} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-foreground">Room {row.roomNumber}</p>
                    <p className="text-xs text-muted-foreground">{row.roomType}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-foreground">{row.guestName}</p>
                    <p className="text-xs text-muted-foreground">{row.guestPhone || '—'}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    <p>
                      {new Date(row.checkIn).toLocaleDateString()} →{' '}
                      {new Date(row.checkOut).toLocaleDateString()}
                    </p>
                    <p className="mt-0.5">{row.nights} night{row.nights !== 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    RWF {row.balanceDue.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(row.roomId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                      Settle folio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CheckoutFolioView({
  detail,
  roomId,
  onBack,
  onComplete,
}: {
  detail: CheckoutDetail;
  roomId: string;
  onBack: () => void;
  onComplete: (invoiceId: string) => void;
}) {
  const { room, folio } = detail;
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const folioRef = `FOL-${new Date().getFullYear()}-${room.number}`;

  const runCheckout = async (paymentMethod: PaymentMethodId) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, paymentMethod, markPaid: true, finalize: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      toast.success(`Checkout complete — paid via ${formatPaymentMethod(paymentMethod)}`);
      onComplete(data.invoice.id);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const createInvoiceOnly = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, markPaid: false, finalize: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create invoice');
      toast.success('Unpaid invoice created — complete checkout when payment is received');
      onComplete(data.invoice.id);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background print:bg-white">
        <style>{`
          @media print {
            @page { margin: 12mm; size: A4; }
            body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .folio-card { box-shadow: none !important; border: none !important; }
          }
        `}</style>

        <div className="no-print p-4 lg:p-8 pb-0">
          <TopBar
            title="Settle folio"
            description={`Room ${room.number} — ${folio.guestName}`}
            actions={
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  All rooms
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-accent transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Print
                </button>
              </div>
            }
          />
        </div>

        <div className="p-4 lg:p-8 flex justify-center">
          <div className="folio-card w-full max-w-4xl bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="h-1 bg-primary" />

            <div className="p-6 md:p-10 border-b border-border">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <HotelBrandMark showContact />
                <div className="text-left lg:text-right">
                  <h2 className="text-2xl font-semibold text-muted-foreground/50 uppercase tracking-tight">Folio</h2>
                  <p className="text-sm font-semibold text-primary mt-1">{folioRef}</p>
                  <p className="text-xs text-amber-600 font-medium mt-2">Awaiting payment</p>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-10 py-5 bg-muted/30 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Guest</p>
                <p className="text-lg font-semibold text-foreground">{folio.guestName}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {folio.guestEmail || folio.guestPhone || '—'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Room</p>
                  <p className="font-medium text-foreground">
                    {room.number} · {room.type}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Rate</p>
                  <p className="font-medium text-foreground">RWF {room.price.toLocaleString()}/night</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Arrival</p>
                  <p className="text-foreground">{new Date(detail.booking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Scheduled departure
                  </p>
                  <p className="text-foreground">{new Date(detail.booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:px-10 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase">Description</th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-center w-16">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-right w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {folio.lineItems.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-4 font-medium text-foreground">{item.description}</td>
                      <td className="px-4 py-4 text-center text-muted-foreground">{item.quantity}</td>
                      <td className="px-4 py-4 text-right font-medium text-foreground">
                        RWF {(item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 md:px-10 py-5 border-t border-border space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground max-w-xs ml-auto">
                <span>Room charges</span>
                <span>RWF {folio.roomLineTotal.toLocaleString()}</span>
              </div>
              {folio.servicesTotal > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground max-w-xs ml-auto">
                  <span>Services & extras</span>
                  <span>RWF {folio.servicesTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold max-w-xs ml-auto pt-2 border-t border-border">
                <span className="text-foreground">Total due</span>
                <span className="text-primary">RWF {folio.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-muted/30 border-t border-border px-6 md:px-10 py-4 text-xs text-muted-foreground">
              {hotelFullLocation()} · {HOTEL_INFO.phone}
            </div>

            <div className="no-print p-6 md:px-10 border-t border-border flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={createInvoiceOnly}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                Invoice only (unpaid)
              </button>
              <button
                type="button"
                onClick={() => setShowPayDialog(true)}
                disabled={isSubmitting}
                className="flex-[2] inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">payments</span>
                Checkout & mark paid
              </button>
            </div>
          </div>
        </div>
      </div>

      <MarkPaidDialog
        open={showPayDialog}
        onClose={() => setShowPayDialog(false)}
        onConfirm={runCheckout}
      />
    </>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('roomId');

  const listKey = '/api/checkout';
  const detailKey = roomId ? `/api/checkout?roomId=${roomId}` : null;

  const { data: listData, isLoading: listLoading, mutate: mutateList } = useSWR(listKey, fetcher, {
    revalidateOnFocus: true,
  });
  const { data: detail, isLoading: detailLoading, error: detailError } = useSWR<CheckoutDetail>(
    detailKey,
    fetcher
  );

  const occupied: OccupiedRow[] = listData?.occupied ?? [];

  const handleSelectRoom = (id: string) => {
    router.push(`/checkout?roomId=${id}`);
  };

  const handleBackToList = () => {
    router.push('/checkout');
    mutateList();
  };

  const handleComplete = (invoiceId: string) => {
    mutateList();
    router.push(`/invoice/${invoiceId}`);
  };

  if (roomId) {
    if (detailLoading) {
      return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    if (detailError || !detail) {
      return (
        <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
          <TopBar title="Checkout" description="This room has no active stay to settle." />
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Room not found or already checked out.</p>
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              View all occupied rooms
            </button>
          </div>
        </div>
      );
    }
    return (
      <CheckoutFolioView
        detail={detail}
        roomId={roomId}
        onBack={handleBackToList}
        onComplete={handleComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Guest checkout"
        description="Select an occupied room to review the folio, generate an invoice, and complete payment."
      />

      {listLoading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
          Loading occupied rooms...
        </div>
      ) : (
        <OccupiedRoomsList occupied={occupied} onSelect={handleSelectRoom} />
      )}
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
