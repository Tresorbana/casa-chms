'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import { HOTEL_INFO, hotelFullLocation } from '@/lib/hotel-info';
import { HotelBrandMark } from '@/components/invoice/HotelBrandMark';
import { toast } from 'sonner';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('roomId');
  const { data: rooms, isLoading } = useSWR('/api/rooms', fetcher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const room = safeRooms.find((r: { id: string; number: string }) => r.id === roomId || r.number === roomId);
  const booking = room?.bookings?.[0];
  const guest = booking?.guest;

  const nights =
    booking?.checkIn && booking?.checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000
          )
        )
      : 1;
  const roomTotal = (room?.price ?? 0) * nights;
  const folioRef = `FOL-${new Date().getFullYear()}-${room?.number ?? '—'}`;

  const handleFinalizeCheckout = async () => {
    if (!room) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: room.id, status: 'CLEANING' }),
      });

      if (res.ok) {
        mutate('/api/rooms');
        mutate('/api/dashboard');
        toast.success('Checkout completed');
        router.push('/');
      } else {
        toast.error('Failed to finalize checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading guest folio...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-xl flex items-center justify-center border border-destructive/20">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground">No active checkout found</h1>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Select an occupied room from the dashboard to settle the folio.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <style>{`
        @media print {
          @page { margin: 12mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .folio-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="no-print">
        <div className="p-4 lg:p-8 pb-0">
          <TopBar
            title="Guest checkout"
            description={`Settle folio for ${guest?.name || 'Walk-in guest'} — Room ${room.number}`}
            actions={
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-accent transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print
              </button>
            }
          />
        </div>
      </div>

      <div className="p-4 lg:p-8 flex justify-center">
        <div className="folio-card w-full max-w-4xl bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="h-1 bg-primary" />

          <div className="p-6 md:p-10 border-b border-border">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
              <HotelBrandMark showContact />
              <div className="text-left lg:text-right flex-shrink-0">
                <h2 className="text-2xl font-semibold text-muted-foreground/50 uppercase tracking-tight">
                  Folio
                </h2>
                <p className="text-sm font-semibold text-primary mt-1">{folioRef}</p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Date:</span>{' '}
                    {new Date().toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Status:</span>{' '}
                    <span className="text-amber-600">Pending settlement</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10 py-5 bg-muted/30 border-b border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Guest
              </p>
              <p className="text-lg font-semibold text-foreground">{guest?.name || 'Walk-in guest'}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{guest?.email || guest?.phone || '—'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Room
                </p>
                <p className="font-medium text-foreground">
                  {room.number} · {room.type}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Rate
                </p>
                <p className="font-medium text-foreground">RWF {room.price?.toLocaleString()}/night</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Arrival
                </p>
                <p className="text-foreground">
                  {booking ? new Date(booking.checkIn).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Departure
                </p>
                <p className="text-foreground">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:px-10 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-center w-16">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase text-right w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">Room accommodation</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {nights} night{nights !== 1 ? 's' : ''} × RWF {room.price?.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center text-muted-foreground">{nights}</td>
                  <td className="px-4 py-4 text-right font-medium text-foreground">
                    RWF {roomTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 md:px-10 py-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-xs text-muted-foreground max-w-md">{HOTEL_INFO.description}</p>
            <div className="text-right w-full sm:w-auto">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net payable</p>
              <p className="text-2xl font-semibold text-primary">RWF {roomTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border px-6 md:px-10 py-4 text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {hotelFullLocation()}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">call</span>
              {HOTEL_INFO.phone}
            </span>
            {HOTEL_INFO.amenities.map((a) => (
              <span key={a} className="hidden sm:inline">
                · {a}
              </span>
            ))}
          </div>

          <div className="no-print p-6 md:px-10 border-t border-border flex flex-col sm:flex-row gap-3 bg-card">
            <Link
              href="/"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-center text-muted-foreground border border-border hover:bg-accent transition-colors"
            >
              Postpone
            </Link>
            <button
              type="button"
              onClick={handleFinalizeCheckout}
              disabled={isSubmitting}
              className="flex-[2] inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              {isSubmitting ? 'Processing...' : 'Finalize & close folio'}
            </button>
          </div>
        </div>
      </div>
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
