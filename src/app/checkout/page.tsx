'use client';
import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('roomId');
  const { data: rooms, isLoading } = useSWR('/api/rooms', fetcher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const room = safeRooms.find((r: any) => r.id === roomId || r.number === roomId);
  const booking = room?.bookings?.[0];
  const guest = booking?.guest;

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
        router.push('/');
      } else {
        alert('Failed to finalize checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Guest Folio...</div>;

  if (!room) {
    return (
      <div className="flex-1 min-h-screen p-8 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center">
          <span className="material-icons-outlined text-4xl">warning</span>
        </div>
        <h1 className="text-2xl font-black">No Active Checkout Found</h1>
        <p className="text-slate-500">Please select a room from the dashboard to proceed with checkout.</p>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen relative">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 min-h-screen">
        <TopBar
          title="Guest Checkout"
          description={`Finalize billing and payment for ${guest?.name || 'Walk-in Guest'} - Room ${room.number}`}
        />
        <div className="invoice-container w-full max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase uppercase">Folio Settlement</h1>
              <p className="text-slate-500">Finalizing Room <span className="font-black text-olive-leaf">{room.number}</span></p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest transition-all" onClick={() => { window.print() }}>
                <span className="material-icons-outlined text-lg">print</span> Print PDF
              </button>
            </div>
          </div>
          <div className="bg-white shadow-2xl border border-slate-100 rounded-[2.5rem] overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-8 bg-cornsilk/30">
              <div>
                <img alt="Casa Hotel" className="h-12 w-auto mb-6 object-contain grayscale" src="logo.png" />
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic uppercase">Casa Hotel</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hospitality Excellence</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black text-slate-200 mb-4 uppercase tracking-tighter italic">Invoice</h3>
                <div className="space-y-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <p>Folio: #CH-{new Date().getFullYear()}-{room.number}</p>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                  <p className="text-primary">Status: PENDING SETTLEMENT</p>
                </div>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Guest Details</p>
                  <p className="font-black text-xl text-slate-800 uppercase italic">{guest?.name || 'Walk-in Guest'}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">{guest?.email || 'No email provided'}</p>
                </div>
                <div className="pt-4 flex gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Type</p>
                    <p className="font-black text-sm text-primary uppercase">{room.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                    <p className="font-black text-sm text-slate-800">RWF {room.price?.toLocaleString()}/night</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Arrival</p>
                    <p className="font-black text-sm">{booking ? new Date(booking.checkIn).toLocaleDateString() : 'Today'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Departure</p>
                    <p className="font-black text-sm">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-0 overflow-x-auto px-10">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-4 py-4">Description</th>
                    <th className="px-4 py-4 text-center">Unit</th>
                    <th className="px-4 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold">
                  <tr className="bg-slate-50 rounded-xl">
                    <td className="px-6 py-5 first:rounded-l-2xl">
                      <div className="font-black text-slate-800 uppercase italic">Room Accommodation</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black mt-1">Stays at RWF {room.price?.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-5 text-center text-slate-500">1</td>
                    <td className="px-6 py-5 text-right font-black text-slate-800 last:rounded-r-2xl">RWF {room.price?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-10 mt-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                  <span className="material-icons-outlined">verified_user</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">System-generated folio.<br />Authorized for immediate settlement.</p>
              </div>
              <div className="w-full md:w-1/3 space-y-3">
                <div className="flex justify-between items-end border-t border-slate-200 pt-4 mt-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Net Payable</span>
                  <span className="text-2xl font-black text-primary italic tracking-tighter">RWF {room.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-10 border-t border-slate-100 flex gap-4 no-print bg-white">
              <Link href="/" className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl text-center hover:bg-slate-200 transition-all">
                Postpone
              </Link>
              <button
                onClick={handleFinalizeCheckout}
                disabled={isSubmitting}
                className="flex-[2] flex items-center justify-center gap-3 px-10 py-4 bg-olive-leaf text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-olive-leaf/30 hover:bg-black-forest transition-all transform hover:scale-[1.01] disabled:opacity-50"
              >
                <span className="material-icons-outlined text-base">task_alt</span>
                {isSubmitting ? 'Processing Settlement...' : 'Finalize & Close Folio'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
