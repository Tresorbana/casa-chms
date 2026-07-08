'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR, { mutate as globalMutate } from 'swr';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import { countries } from '@/lib/countries';
import { fetcher } from '@/lib/fetcher';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all";
const labelClass = "text-xs font-medium text-muted-foreground";

function statusBadge(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    CHECKED_IN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CHECKED_OUT: 'bg-purple-50 text-purple-700 border-purple-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return map[status] || 'bg-muted text-muted-foreground border-border';
}

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomNumberParam = searchParams.get('roomNumber');
  const { data: roomsData } = useSWR('/api/rooms', fetcher);
  const { data: bookingsData, mutate: mutateBookings } = useSWR('/api/bookings?take=50', fetcher);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', nationality: '',
    checkIn: '', checkOut: '', roomType: '', roomNumber: roomNumberParam || '',
    adults: 1, children: 0,
  });
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<'new' | 'manage'>('new');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isActioning, setIsActioning] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [editPriceTarget, setEditPriceTarget] = useState<any>(null);
  const [editPriceValue, setEditPriceValue] = useState('');
  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [customTotal, setCustomTotal] = useState<string>('');
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [walkInData, setWalkInData] = useState({ name: '', phone: '', email: '', idNumber: '', nationality: '', roomNumber: '', checkOut: '', total: '' });
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  const rooms = Array.isArray(roomsData) ? roomsData : [];
  const bookings: any[] = Array.isArray(bookingsData) ? bookingsData : [];
  const selectedRoom = rooms.find((room: any) => room.number === formData.roomNumber);
  const walkInRoom = rooms.find((r: any) => r.number === walkInData.roomNumber) ?? null;
  const walkInNights = walkInData.checkOut
    ? Math.max(1, Math.ceil((new Date(walkInData.checkOut).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && selectedRoom) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setEstimatedTotal(days > 0 ? days * Number(selectedRoom.price || 0) : 0);
      return;
    }
    setEstimatedTotal(0);
  }, [formData.checkIn, formData.checkOut, selectedRoom]);

  useEffect(() => {
    if (!showWalkIn || !walkInRoom || !walkInData.checkOut) return;
    setWalkInData(p => ({ ...p, total: (walkInRoom.price * walkInNights).toString() }));
  }, [walkInData.roomNumber, walkInData.checkOut, showWalkIn]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.name, guestEmail: formData.email,
          guestPhone: formData.phone, roomNumber: formData.roomNumber,
          checkIn: formData.checkIn, checkOut: formData.checkOut,
          nationality: formData.nationality,
          totalAmount: customTotal !== '' ? parseFloat(customTotal) : estimatedTotal,
        }),
      });
      if (res.ok) {
        toast.success('Booking created successfully');
        mutateBookings();
        setFormData({ name: '', phone: '', email: '', nationality: '', checkIn: '', checkOut: '', roomType: '', roomNumber: '', adults: 1, children: 0 });
        setCustomTotal('');
        setActiveView('manage');
      } else {
        const error = await res.json();
        toast.error(error.message || error.error || 'Failed to create booking');
      }
    } catch {
      toast.error('Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalkIn = async (e: any) => {
    e.preventDefault();
    setIsSubmittingWalkIn(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: walkInData.name,
          guestPhone: walkInData.phone,
          ...(walkInData.email.trim() && { guestEmail: walkInData.email }),
          ...(walkInData.idNumber.trim() && { guestIdNumber: walkInData.idNumber }),
          ...(walkInData.nationality && { nationality: walkInData.nationality }),
          roomNumber: walkInData.roomNumber,
          checkIn: new Date().toISOString(),
          checkOut: walkInData.checkOut,
          totalAmount: walkInData.total,
          source: 'WALK_IN',
        }),
      });
      if (res.ok) {
        toast.success(`Walk-in registered: ${walkInData.name}`);
        mutateBookings();
        globalMutate('/api/dashboard');
        setShowWalkIn(false);
        setWalkInData({ name: '', phone: '', email: '', idNumber: '', nationality: '', roomNumber: '', checkOut: '', total: '' });
        setActiveView('manage');
      } else {
        const err = await res.json();
        toast.error(err.message || err.error || 'Failed to register walk-in');
      }
    } catch {
      toast.error('Failed to register walk-in');
    } finally {
      setIsSubmittingWalkIn(false);
    }
  };

  const handleSavePrice = async () => {
    if (!editPriceTarget || !editPriceValue) return;
    setIsSavingPrice(true);
    try {
      const res = await fetch(`/api/bookings/${editPriceTarget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: parseFloat(editPriceValue) }),
      });
      if (!res.ok) { toast.error('Failed to update price'); return; }
      toast.success('Price updated');
      mutateBookings();
      setEditPriceTarget(null);
    } catch { toast.error('Error updating price'); }
    finally { setIsSavingPrice(false); }
  };

  const handleBookingAction = async (bookingId: string, action: string, reason?: string) => {
    setIsActioning(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cancellationReason: reason }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to update booking');
        return;
      }
      const updated = await res.json();
      mutateBookings();
      globalMutate('/api/dashboard');
      setCancelTarget(null);
      setCancelReason('');
      const msgs: Record<string, string> = {
        CHECK_IN: `Checked in: ${updated.guest?.name}`,
        CHECK_OUT: `Checked out: ${updated.guest?.name}`,
        CANCEL: 'Booking cancelled',
        RESTORE: 'Booking restored',
      };
      toast.success(msgs[action] || 'Updated');
    } catch { toast.error('Error updating booking'); }
    finally { setIsActioning(null); }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = !searchFilter ||
      b.guest?.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.room?.number?.includes(searchFilter);
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Guest Registration"
        description="Create bookings and manage check-in / check-out."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWalkIn(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
              Walk-in
            </button>
            <div className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5">
              <button
                onClick={() => setActiveView('new')}
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${activeView === 'new' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                New Booking
              </button>
              <button
                onClick={() => setActiveView('manage')}
                className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${activeView === 'manage' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                Manage
                {bookings.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                    {bookings.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        }
      />

      {activeView === 'new' && (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground text-[20px]">person_add</span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Guest Information</h2>
                    <p className="text-xs text-muted-foreground">Contact and identity details</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Full Name</label>
                      <input className={inputClass} placeholder="John Doe" type="text" name="name" autoComplete="off" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Phone Number</label>
                      <input className={inputClass} placeholder="+250 788 000 000" type="tel" name="phone" autoComplete="off" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Email Address</label>
                      <input className={inputClass} placeholder="guest@example.com" type="email" name="email" autoComplete="off" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Nationality</label>
                      <select className={inputClass} name="nationality" value={formData.nationality} onChange={handleChange}>
                        <option value="">Select country...</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                  <span className="material-symbols-outlined text-muted-foreground text-[20px]">event</span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Booking Details</h2>
                    <p className="text-xs text-muted-foreground">Dates and room assignment</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Check In</label>
                      <input className={inputClass} type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className={labelClass}>Check Out</label>
                      <input className={inputClass} type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Room Type</label>
                    <select className={inputClass} name="roomType" value={formData.roomType} onChange={handleChange} required>
                      <option value="">Select type...</option>
                      <option value="TWIN">Twin Room</option>
                      <option value="VIP">VIP Room</option>
                      <option value="SUITE">Executive Suite</option>
                      <option value="FAMILY">Family Room</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className={labelClass}>Room Number</label>
                    <input className={inputClass} placeholder="e.g. 101" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                  </div>

                  {selectedRoom && (
                    <div className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Selected room</p>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Room {selectedRoom.number}</p>
                          <p className="text-xs text-muted-foreground">{selectedRoom.type}</p>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          RWF {Number(selectedRoom.price || 0).toLocaleString()}/night
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Estimated Total</span>
                      <span className="text-sm font-medium text-muted-foreground">RWF {estimatedTotal.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <label className={labelClass}>Agreed Price (RWF) — override if negotiated</label>
                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        placeholder={`e.g. ${estimatedTotal || '50000'}`}
                        value={customTotal}
                        onChange={e => setCustomTotal(e.target.value)}
                      />
                      {customTotal !== '' && (
                        <p className="text-xs text-primary font-medium">
                          Will charge: RWF {parseFloat(customTotal || '0').toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button
                      className="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>Creating...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">check</span>Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {activeView === 'manage' && (
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 p-4 bg-card border border-border rounded-xl">
            <input
              type="text"
              placeholder="Search by guest name or room..."
              className="flex-1 min-w-[200px] bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
            />
            <select
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Bookings Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Bookings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</p>
            </div>
            {filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">hotel</span>
                <p className="text-sm">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      {['Guest', 'Room', 'Check In', 'Check Out', 'Amount', 'Booked by', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredBookings.map((b: any) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{b.guest?.name}</p>
                            {b.source === 'WALK_IN' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide">Walk-in</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{b.guest?.phone || b.guest?.email || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          Room {b.room?.number}
                          <p className="text-xs text-muted-foreground">{b.room?.type}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(b.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {b.checkedInAt && <p className="text-[10px] text-emerald-600">In: {new Date(b.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(b.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          {b.checkedOutAt && <p className="text-[10px] text-purple-600">Out: {new Date(b.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                          RWF {b.totalAmount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {b.createdByName || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {b.status === 'CONFIRMED' && (
                              <button
                                onClick={() => handleBookingAction(b.id, 'CHECK_IN')}
                                disabled={isActioning === b.id}
                                title="Check In"
                                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">login</span>
                              </button>
                            )}
                            {b.status === 'CHECKED_IN' && (
                              <button
                                onClick={() => handleBookingAction(b.id, 'CHECK_OUT')}
                                disabled={isActioning === b.id}
                                title="Check Out"
                                className="p-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">logout</span>
                              </button>
                            )}
                            {!['CANCELLED', 'CHECKED_OUT'].includes(b.status) && (
                              <button
                                onClick={() => { setCancelTarget(b); setCancelReason(''); }}
                                title="Cancel Booking"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors text-xs font-medium whitespace-nowrap"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Cancel
                              </button>
                            )}
                            {b.status === 'CANCELLED' && (
                              <button
                                onClick={() => handleBookingAction(b.id, 'RESTORE')}
                                disabled={isActioning === b.id}
                                title="Restore Booking"
                                className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-[16px]">restore</span>
                              </button>
                            )}
                            <button
                              onClick={() => { setEditPriceTarget(b); setEditPriceValue(b.totalAmount?.toString() ?? ''); }}
                              title="Adjust Price"
                              className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            {b.invoice?.id && (
                              <button
                                onClick={() => router.push(`/invoice/${b.invoice.id}`)}
                                title="View Invoice"
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editPriceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Adjust Price</h3>
              <button onClick={() => setEditPriceTarget(null)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Booking for <span className="font-medium text-foreground">{editPriceTarget.guest?.name}</span> — Room <span className="font-medium text-foreground">{editPriceTarget.room?.number}</span>
              </p>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Agreed Amount (RWF)</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={editPriceValue}
                  onChange={e => setEditPriceValue(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditPriceTarget(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button
                  onClick={handleSavePrice}
                  disabled={isSavingPrice || !editPriceValue}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSavingPrice ? 'Saving...' : 'Save Price'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Registration Modal */}
      {showWalkIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-purple-600">directions_walk</span>
                  Walk-in Guest
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Guest arriving now — no advance booking</p>
              </div>
              <button onClick={() => setShowWalkIn(false)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleWalkIn} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className={labelClass}>Full Name <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="text" autoComplete="off" placeholder="Guest full name"
                    value={walkInData.name} onChange={e => setWalkInData(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Phone <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="tel" autoComplete="off" placeholder="+250 788 000 000"
                    value={walkInData.phone} onChange={e => setWalkInData(p => ({ ...p, phone: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>ID / Passport No. <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="text" autoComplete="off" placeholder="National ID or passport"
                    value={walkInData.idNumber} onChange={e => setWalkInData(p => ({ ...p, idNumber: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Email <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
                  <input className={inputClass} type="email" autoComplete="off" placeholder="guest@example.com"
                    value={walkInData.email} onChange={e => setWalkInData(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Nationality</label>
                  <select className={inputClass} value={walkInData.nationality} onChange={e => setWalkInData(p => ({ ...p, nationality: e.target.value }))}>
                    <option value="">Select country...</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Room Number <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="text" autoComplete="off" placeholder="e.g. 101"
                    value={walkInData.roomNumber} onChange={e => setWalkInData(p => ({ ...p, roomNumber: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Check-out Date <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="date" min={new Date().toISOString().split('T')[0]}
                    value={walkInData.checkOut} onChange={e => setWalkInData(p => ({ ...p, checkOut: e.target.value }))} required />
                </div>
                {walkInRoom ? (
                  <div className="col-span-2 rounded-lg bg-muted/40 border border-border px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">Room {walkInRoom.number} · {walkInRoom.type}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">RWF {Number(walkInRoom.price).toLocaleString()}/night</p>
                    </div>
                    {walkInNights > 0 && (
                      <p className="text-sm font-semibold text-primary">
                        {walkInNights} night{walkInNights !== 1 ? 's' : ''} = RWF {(walkInRoom.price * walkInNights).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : walkInData.roomNumber ? (
                  <div className="col-span-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-700">
                    Room &quot;{walkInData.roomNumber}&quot; not found — check the room number.
                  </div>
                ) : null}
                <div className="col-span-2 space-y-1.5">
                  <label className={labelClass}>Agreed Amount (RWF) <span className="text-destructive">*</span></label>
                  <input className={inputClass} type="number" min="0" autoComplete="off" placeholder="e.g. 50000"
                    value={walkInData.total} onChange={e => setWalkInData(p => ({ ...p, total: e.target.value }))} required />
                  {walkInRoom && walkInNights > 0 && walkInData.total && Number(walkInData.total) !== walkInRoom.price * walkInNights && (
                    <p className="text-xs text-amber-600">Differs from room rate estimate — confirm this is correct.</p>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-purple-50 border border-purple-200 px-4 py-2.5 text-xs text-purple-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Room will be marked <strong>Occupied</strong> immediately and an invoice will be generated.
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowWalkIn(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWalkIn}
                  className="flex-1 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingWalkIn ? (
                    <><span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>Registering...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[16px]">how_to_reg</span>Register Walk-in</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Cancel Booking</h3>
              <button onClick={() => setCancelTarget(null)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Cancel booking for <span className="font-medium text-foreground">{cancelTarget.guest?.name}</span> in Room <span className="font-medium text-foreground">{cancelTarget.room?.number}</span>?
              </p>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Cancellation Reason (optional)</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="e.g. Guest request, no-show..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCancelTarget(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">
                  Back
                </button>
                <button
                  onClick={() => handleBookingAction(cancelTarget.id, 'CANCEL', cancelReason)}
                  disabled={isActioning === cancelTarget.id}
                  className="flex-1 bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {isActioning === cancelTarget.id ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Bookings() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm text-muted-foreground">Loading...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
