'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import Link from 'next/link';

function statusBadge(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    CHECKED_IN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CHECKED_OUT: 'bg-purple-50 text-purple-700 border-purple-200',
    INVOICED: 'bg-amber-50 text-amber-700 border-amber-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };
  return map[status] || 'bg-muted text-muted-foreground border-border';
}

export default function EventsReport() {
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useSWR(
    `/api/conference/report?from=${from}&to=${to}`,
    fetcher,
    { onError: () => toast.error('Failed to load report') }
  );

  const bookings: any[] = data?.bookings ?? [];
  const summary = data?.summary ?? {};

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Events Report"
        description="Detailed breakdown of conference and event bookings."
        actions={
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border border-border text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors text-foreground"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Events
          </Link>
        }
      />

      {/* Date filter */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <span className="text-xs font-medium text-muted-foreground">Period:</span>
        <input type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" value={from} onChange={e => setFrom(e.target.value)} />
        <span className="text-muted-foreground text-xs">to</span>
        <input type="date" className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" value={to} onChange={e => setTo(e.target.value)} />
        {['This Month', 'Last 30 Days', 'This Year'].map(label => (
          <button key={label} onClick={() => {
            const now = new Date();
            if (label === 'This Month') { setFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]); setTo(now.toISOString().split('T')[0]); }
            else if (label === 'Last 30 Days') { const d = new Date(); d.setDate(d.getDate() - 30); setFrom(d.toISOString().split('T')[0]); setTo(now.toISOString().split('T')[0]); }
            else { setFrom(`${now.getFullYear()}-01-01`); setTo(now.toISOString().split('T')[0]); }
          }} className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-auto">{label}</button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Bookings', value: summary.totalBookings ?? 0, color: 'text-foreground' },
          { label: 'Total Revenue', value: `RWF ${(summary.totalRevenue ?? 0).toLocaleString()}`, color: 'text-emerald-600' },
          { label: 'Confirmed', value: summary.confirmedCount ?? 0, color: 'text-blue-600' },
          { label: 'Checked In/Out', value: (summary.checkedInCount ?? 0) + (summary.checkedOutCount ?? 0), color: 'text-purple-600' },
          { label: 'Cancelled', value: summary.cancelledCount ?? 0, color: 'text-red-600' },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Event Bookings</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Click a row to see full details including linked rooms</p>
        </div>
        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground text-sm">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">event_note</span>
            <p className="text-sm">No events in this period</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.map((b: any) => (
              <div key={b.id}>
                <button
                  onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-sm font-medium text-foreground truncate">{b.guestName}</p>
                      <p className="text-xs text-muted-foreground">{b.guestContact || b.guestEmail || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Venue</p>
                      <p className="text-xs font-medium text-foreground">{b.venue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-xs text-foreground">{new Date(b.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Grand Total</p>
                      <p className="text-xs font-semibold text-emerald-600">RWF {b.grandTotal.toLocaleString()}</p>
                      {b.linkedRooms.length > 0 && <p className="text-[10px] text-muted-foreground">{b.linkedRooms.length} room{b.linkedRooms.length > 1 ? 's' : ''} linked</p>}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge(b.status)}`}>{b.status}</span>
                      <span className="material-symbols-outlined text-[18px] text-muted-foreground">{expanded === b.id ? 'expand_less' : 'expand_more'}</span>
                    </div>
                  </div>
                </button>

                {expanded === b.id && (
                  <div className="px-5 pb-5 bg-muted/20 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {/* Event details */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Event Details</h4>
                        <dl className="space-y-2 text-xs">
                          <div className="flex justify-between"><dt className="text-muted-foreground">Venue</dt><dd className="font-medium">{b.venue}</dd></div>
                          <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{b.bookingType}</dd></div>
                          <div className="flex justify-between"><dt className="text-muted-foreground">Start</dt><dd>{new Date(b.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</dd></div>
                          <div className="flex justify-between"><dt className="text-muted-foreground">End</dt><dd>{new Date(b.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</dd></div>
                          <div className="flex justify-between"><dt className="text-muted-foreground">Venue Fee</dt><dd>RWF {b.venueFee.toLocaleString()}</dd></div>
                          <div className="flex justify-between"><dt className="text-muted-foreground">Extras</dt><dd>RWF {b.extrasTotal.toLocaleString()}</dd></div>
                          {b.checkedInAt && <div className="flex justify-between"><dt className="text-muted-foreground">Checked In</dt><dd className="text-emerald-600">{new Date(b.checkedInAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</dd></div>}
                          {b.checkedOutAt && <div className="flex justify-between"><dt className="text-muted-foreground">Checked Out</dt><dd className="text-purple-600">{new Date(b.checkedOutAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</dd></div>}
                          {b.notes && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Notes</dt><dd className="text-right">{b.notes}</dd></div>}
                        </dl>
                        {b.extras.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Extras / Food</h5>
                            <div className="space-y-1">
                              {b.extras.map((ex: any) => (
                                <div key={ex.id} className="flex justify-between text-xs">
                                  <span>{ex.description} ×{ex.quantity}</span>
                                  <span className="font-medium">RWF {ex.totalPrice.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Linked hotel rooms */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Linked Hotel Rooms {b.linkedRooms.length > 0 && `(${b.linkedRooms.length})`}
                        </h4>
                        {b.linkedRooms.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">No hotel rooms linked</p>
                        ) : (
                          <div className="space-y-2">
                            {b.linkedRooms.map((r: any) => (
                              <div key={r.id} className="p-3 bg-background border border-border rounded-lg text-xs">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{r.guestName}</span>
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${statusBadge(r.status)}`}>{r.status}</span>
                                </div>
                                <div className="text-muted-foreground space-y-0.5">
                                  <p>Room {r.roomNumber} · {r.roomType}</p>
                                  <p>{new Date(r.checkIn).toLocaleDateString()} → {new Date(r.checkOut).toLocaleDateString()}</p>
                                  <p className="font-medium text-foreground">RWF {r.amount.toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                            <div className="flex justify-between text-xs font-semibold pt-2 border-t border-border">
                              <span>Rooms Total</span>
                              <span>RWF {b.linkedRoomsTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex justify-between text-sm font-bold text-primary">
                            <span>Full Total (Event + Rooms)</span>
                            <span>RWF {b.fullTotal.toLocaleString()}</span>
                          </div>
                        </div>
                        {b.invoiceId && (
                          <Link
                            href={`/invoice/${b.invoiceId}`}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                            View Invoice
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
