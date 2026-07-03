'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import ConferenceBookingModal from '@/components/ConferenceBookingModal';
import { ExportButton } from '@/components/ExportButton';
import { exportToExcel, conferenceExportRows } from '@/lib/export-excel';
import { useRouter } from 'next/navigation';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

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

export default function Events() {
  const router = useRouter();
  const { data: venuesData, isLoading: isLoadingVenues } = useSWR('/api/conference', fetcher, {
    onError: () => toast.error('Failed to load venues'),
  });
  const { data: bookingsData, mutate: mutateBookings } = useSWR('/api/conference/bookings', fetcher);
  const { data: allHotelBookingsData } = useSWR('/api/bookings', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [addItemForm, setAddItemForm] = useState({ description: '', quantity: '1', unitPrice: '' });
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ guestName: '', guestContact: '', guestEmail: '', notes: '' });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isActioning, setIsActioning] = useState(false);
  const [isLinkingRoom, setIsLinkingRoom] = useState(false);

  const venues = Array.isArray(venuesData) ? venuesData : [];
  const schedule = Array.isArray(bookingsData) ? bookingsData : [];
  const allHotelBookings = Array.isArray(allHotelBookingsData) ? allHotelBookingsData : [];

  const handleExport = () => {
    exportToExcel(conferenceExportRows(schedule), `Conference_Events_${new Date().toISOString().split('T')[0]}`, 'Events');
    toast.success('Events schedule exported');
  };

  const openBookingDetail = (booking: any) => {
    setSelectedBooking(booking);
    setAddItemForm({ description: '', quantity: '1', unitPrice: '' });
    setIsLinkingRoom(false);
  };

  const openEditModal = () => {
    if (!selectedBooking) return;
    setEditForm({
      guestName: selectedBooking.guestName ?? '',
      guestContact: selectedBooking.guestContact ?? '',
      guestEmail: selectedBooking.guestEmail ?? '',
      notes: selectedBooking.notes ?? '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/conference/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { toast.error('Failed to update booking'); return; }
      const updated = await res.json();
      mutateBookings();
      setSelectedBooking(updated);
      setIsEditModalOpen(false);
      toast.success('Booking updated');
    } catch { toast.error('Error updating booking'); }
  };

  const handleBookingAction = async (action: string, reason?: string) => {
    if (!selectedBooking) return;
    setIsActioning(true);
    try {
      const res = await fetch(`/api/conference/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, cancellationReason: reason }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to update status');
        return;
      }
      const updated = await res.json();
      mutateBookings();
      setSelectedBooking(updated);
      setIsCancelModalOpen(false);
      setCancelReason('');
      const messages: Record<string, string> = {
        CHECK_IN: 'Guest checked in',
        CHECK_OUT: 'Guest checked out',
        CANCEL: 'Booking cancelled',
        RESTORE: 'Booking restored',
      };
      toast.success(messages[action] || 'Updated');
    } catch { toast.error('Error updating booking'); }
    finally { setIsActioning(false); }
  };

  const handleLinkRoom = async (bookingId: string) => {
    if (!selectedBooking) return;
    const newIds = [...(selectedBooking.linkedBookingIds ?? []), bookingId];
    try {
      const res = await fetch(`/api/conference/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedBookingIds: newIds }),
      });
      if (!res.ok) { toast.error('Failed to link room'); return; }
      const updated = await res.json();
      mutateBookings();
      setSelectedBooking(updated);
      setIsLinkingRoom(false);
      toast.success('Hotel room linked');
    } catch { toast.error('Error linking room'); }
  };

  const handleUnlinkRoom = async (bookingId: string) => {
    if (!selectedBooking) return;
    const newIds = (selectedBooking.linkedBookingIds ?? []).filter((id: string) => id !== bookingId);
    try {
      const res = await fetch(`/api/conference/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedBookingIds: newIds }),
      });
      if (!res.ok) { toast.error('Failed to unlink room'); return; }
      const updated = await res.json();
      mutateBookings();
      setSelectedBooking(updated);
      toast.success('Room unlinked');
    } catch { toast.error('Error unlinking room'); }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!addItemForm.description || !addItemForm.unitPrice) { toast.error('Description and price required'); return; }
    setIsAddingItem(true);
    try {
      const res = await fetch(`/api/conference/${selectedBooking.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addItemForm),
      });
      if (!res.ok) { toast.error('Failed to add item'); return; }
      const updated = await fetch(`/api/conference/bookings`).then(r => r.json());
      mutateBookings(updated, false);
      const refreshed = updated.find((b: any) => b.id === selectedBooking.id);
      if (refreshed) setSelectedBooking(refreshed);
      setAddItemForm({ description: '', quantity: '1', unitPrice: '' });
      toast.success('Item added to event');
    } catch { toast.error('Error adding item'); }
    finally { setIsAddingItem(false); }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selectedBooking) return;
    try {
      await fetch(`/api/conference/${selectedBooking.id}/items?itemId=${itemId}`, { method: 'DELETE' });
      const updated = await fetch(`/api/conference/bookings`).then(r => r.json());
      mutateBookings(updated, false);
      const refreshed = updated.find((b: any) => b.id === selectedBooking.id);
      if (refreshed) setSelectedBooking(refreshed);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedBooking) return;
    setIsGeneratingInvoice(true);
    try {
      const res = await fetch(`/api/conference/${selectedBooking.id}/invoice`, { method: 'POST' });
      if (!res.ok) { toast.error('Failed to generate invoice'); return; }
      const invoice = await res.json();
      mutateBookings();
      toast.success('Invoice generated');
      router.push(`/invoice/${invoice.id}`);
    } catch { toast.error('Error generating invoice'); }
    finally { setIsGeneratingInvoice(false); }
  };

  const handleViewInvoice = async () => {
    if (!selectedBooking?.invoiceId) return;
    router.push(`/invoice/${selectedBooking.invoiceId}`);
  };

  const itemsTotal = (selectedBooking?.items ?? []).reduce((sum: number, i: any) => sum + i.totalPrice, 0);
  const grandTotal = (selectedBooking?.totalAmount ?? 0) + itemsTotal;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Events & Conference"
        description="Conference rooms, event bookings, and invoices."
        actions={
          <div className="flex flex-wrap gap-2">
            <ExportButton onClick={handleExport} disabled={!schedule.length} />
            <button
              onClick={() => router.push('/events/report')}
              className="inline-flex items-center gap-2 border border-border text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">assessment</span>
              Reports
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Book Event
            </button>
          </div>
        }
      />

      {/* Venue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingVenues ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse h-40" />
          ))
        ) : venues.map((venue: any) => (
          <div key={venue.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{venue.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Conference & event venue</p>
                </div>
                <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Daily rate</p>
                  <p className="text-sm font-medium text-foreground">RWF {(venue.pricePerDay ?? 0).toLocaleString()}/day</p>
                  <p className="text-[10px] text-muted-foreground">RWF {venue.pricePerHour?.toLocaleString()}/hr</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Capacity</p>
                  <p className="text-sm font-medium text-foreground">{venue.capacity} guests</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">event</span>
                Book Venue
              </button>
            </div>
          </div>
        ))}
        {!isLoadingVenues && venues.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">meeting_room</span>
            <p className="text-sm">No conference rooms configured</p>
          </div>
        )}
      </div>

      {/* Schedule + Detail Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Schedule List */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Event Schedule</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Click an event to manage items and generate invoices</p>
          </div>
          <div className="p-4">
            {schedule.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">event_note</span>
                <p className="text-sm">No scheduled events</p>
              </div>
            ) : (
              <div className="space-y-2">
                {schedule.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => openBookingDetail(b)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all hover:shadow-sm ${selectedBooking?.id === b.id ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:bg-muted/50'}`}
                  >
                    <div className="p-2 bg-background border border-border rounded-lg flex-shrink-0">
                      <span className="material-symbols-outlined text-muted-foreground text-[18px]">event</span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-foreground truncate">{b.guestName}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.conferenceRoom?.name} · {b.bookingType === 'DAILY' ? 'Full day' : 'Hourly'}
                        {(b.items?.length > 0) && ` · ${b.items.length} extra item${b.items.length !== 1 ? 's' : ''}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-xs font-medium text-foreground">
                        {new Date(b.startTime).toLocaleDateString()}
                      </p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {!selectedBooking ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground">
              <span className="material-symbols-outlined text-4xl block mb-3 opacity-30">event_note</span>
              <p className="text-sm">Select an event to manage</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{selectedBooking.guestName}</h3>
                    <p className="text-xs text-muted-foreground">{selectedBooking.conferenceRoom?.name}</p>
                    {selectedBooking.createdByName && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">Booked by {selectedBooking.createdByName}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto max-h-[600px]">
                {/* Booking Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Venue fee</span>
                    <span className="font-medium text-foreground">RWF {selectedBooking.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Contact</span>
                    <span className="text-foreground">{selectedBooking.guestContact || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Start</span>
                    <span className="text-foreground">{new Date(selectedBooking.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border">
                    <span className="text-muted-foreground">End</span>
                    <span className="text-foreground">{new Date(selectedBooking.endTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                {/* Linked Hotel Rooms */}
                {(() => {
                  const linkedIds: string[] = selectedBooking.linkedBookingIds ?? [];
                  // Use server-enriched linkedBookings array (always up to date)
                  const linkedBookings: any[] = selectedBooking.linkedBookings ?? [];
                  const canEdit = !['CANCELLED', 'INVOICED', 'CHECKED_OUT'].includes(selectedBooking.status);
                  const linkedIdSet = new Set(linkedIds);
                  const availableToLink = allHotelBookings.filter((b: any) =>
                    ['CONFIRMED', 'CHECKED_IN'].includes(b.status) && !linkedIdSet.has(b.id)
                  );
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">Linked Hotel Stays</p>
                        {canEdit && (
                          <button
                            onClick={() => setIsLinkingRoom(!isLinkingRoom)}
                            className="text-[10px] text-primary flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[12px]">{isLinkingRoom ? 'close' : 'add'}</span>
                            {isLinkingRoom ? 'Close' : 'Link Room'}
                          </button>
                        )}
                      </div>
                      {linkedIds.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No hotel rooms linked to this event</p>
                      ) : (
                        <div className="space-y-1">
                          {linkedIds.map((bid: string) => {
                            const b = linkedBookings.find((lb: any) => lb.id === bid);
                            return (
                              <div key={bid} className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg border border-border text-xs">
                                <span className="material-symbols-outlined text-[14px] text-muted-foreground">hotel</span>
                                <span className="flex-1">
                                  {b ? `Room ${b.room?.number} — ${b.guest?.name}` : `Room (loading…)`}
                                </span>
                                {b?.status && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${b.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                    {b.status === 'CHECKED_IN' ? 'In' : b.status === 'CHECKED_OUT' ? 'Out' : 'Conf'}
                                  </span>
                                )}
                                {canEdit && (
                                  <button
                                    onClick={() => handleUnlinkRoom(bid)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    title="Unlink room"
                                  >
                                    <span className="material-symbols-outlined text-[12px]">link_off</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {isLinkingRoom && (
                        <div className="mt-2 border border-border rounded-lg overflow-hidden">
                          <div className="px-3 py-1.5 bg-muted/50 border-b border-border">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Select hotel booking</p>
                          </div>
                          <div className="max-h-44 overflow-y-auto">
                            {availableToLink.length === 0 ? (
                              <p className="text-xs text-muted-foreground p-3 text-center italic">No active hotel stays to link</p>
                            ) : (
                              availableToLink.map((b: any) => (
                                <button
                                  key={b.id}
                                  onClick={() => handleLinkRoom(b.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors border-b border-border/50 last:border-0 text-left"
                                >
                                  <span className="material-symbols-outlined text-[14px] text-muted-foreground">hotel</span>
                                  <span className="flex-1">Room {b.room?.number} — {b.guest?.name}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${b.status === 'CHECKED_IN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{b.status === 'CHECKED_IN' ? 'In' : 'Conf'}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Extras / Food Items */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Food & Extras</p>
                  {(selectedBooking.items ?? []).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No extras added yet</p>
                  ) : (
                    <div className="space-y-1 mb-3">
                      {selectedBooking.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/40 rounded-lg border border-border">
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{item.description}</span>
                            <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground">RWF {item.totalPrice.toLocaleString()}</span>
                            <button onClick={() => handleRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Item Form */}
                  {selectedBooking.status !== 'INVOICED' && (
                    <form onSubmit={handleAddItem} className="space-y-2 pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Add Item</p>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Description (e.g. Primus Beer x6, Buffet lunch)"
                        value={addItemForm.description}
                        onChange={e => setAddItemForm({ ...addItemForm, description: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          className={inputClass}
                          placeholder="Qty"
                          value={addItemForm.quantity}
                          onChange={e => setAddItemForm({ ...addItemForm, quantity: e.target.value })}
                        />
                        <input
                          type="number"
                          min="0"
                          className={inputClass}
                          placeholder="Unit price (RWF)"
                          value={addItemForm.unitPrice}
                          onChange={e => setAddItemForm({ ...addItemForm, unitPrice: e.target.value })}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isAddingItem}
                        className="w-full py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        {isAddingItem ? 'Adding...' : 'Add to Event'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t border-border space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Venue fee</span>
                    <span>RWF {selectedBooking.totalAmount?.toLocaleString()}</span>
                  </div>
                  {itemsTotal > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Extras & food</span>
                      <span>RWF {itemsTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold pt-1 border-t border-border">
                    <span>Grand Total</span>
                    <span>RWF {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Booking Action Buttons */}
                {!['CANCELLED', 'CHECKED_OUT'].includes(selectedBooking.status) && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Manage Booking</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={openEditModal}
                        className="py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Edit
                      </button>
                      {selectedBooking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleBookingAction('CHECK_IN')}
                          disabled={isActioning}
                          className="py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px]">login</span>
                          Check In
                        </button>
                      )}
                      {selectedBooking.status === 'CHECKED_IN' && (
                        <button
                          onClick={() => handleBookingAction('CHECK_OUT')}
                          disabled={isActioning}
                          className="py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[14px]">logout</span>
                          Check Out
                        </button>
                      )}
                      {!['INVOICED'].includes(selectedBooking.status) && (
                        <button
                          onClick={() => setIsCancelModalOpen(true)}
                          className="py-2 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 col-span-full"
                        >
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {selectedBooking.status === 'CANCELLED' && (
                  <button
                    onClick={() => handleBookingAction('RESTORE')}
                    disabled={isActioning}
                    className="w-full py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">restore</span>
                    Restore Booking
                  </button>
                )}

                {/* Invoice Actions */}
                <div className="space-y-2">
                  {selectedBooking.invoiceId ? (
                    <button
                      onClick={handleViewInvoice}
                      className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      View Invoice
                    </button>
                  ) : !['CANCELLED'].includes(selectedBooking.status) ? (
                    <button
                      onClick={handleGenerateInvoice}
                      disabled={isGeneratingInvoice || selectedBooking.status === 'INVOICED'}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt</span>
                      {isGeneratingInvoice ? 'Generating...' : 'Generate Invoice'}
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConferenceBookingModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); mutateBookings(); }}
        />
      )}

      {/* Edit Booking Modal */}
      {isEditModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Edit Booking</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleEditBooking} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Guest / Organization Name</label>
                <input required type="text" className={inputClass} value={editForm.guestName} onChange={e => setEditForm({ ...editForm, guestName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Contact</label>
                  <input type="text" className={inputClass} value={editForm.guestContact} onChange={e => setEditForm({ ...editForm, guestContact: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email</label>
                  <input type="email" className={inputClass} value={editForm.guestEmail} onChange={e => setEditForm({ ...editForm, guestEmail: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Notes</label>
                <textarea rows={3} className={inputClass} value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Cancel Booking</h3>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">Cancel the booking for <span className="font-medium text-foreground">{selectedBooking.guestName}</span>?</p>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Reason (optional)</label>
                <input type="text" className={inputClass} placeholder="Reason for cancellation" value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsCancelModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Back</button>
                <button
                  onClick={() => handleBookingAction('CANCEL', cancelReason)}
                  disabled={isActioning}
                  className="flex-1 bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {isActioning ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
