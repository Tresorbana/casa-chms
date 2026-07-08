'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';

const EVENT_TYPES = [
  { value: 'GROUP_BOOKING', label: 'Group Booking' },
  { value: 'PRIVATE_DINNER', label: 'Private Dinner' },
  { value: 'BIRTHDAY', label: 'Birthday Party' },
  { value: 'ANNIVERSARY', label: 'Anniversary' },
  { value: 'CORPORATE', label: 'Corporate Event' },
  { value: 'WEDDING_RECEPTION', label: 'Wedding Reception' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-purple-50 text-purple-700 border-purple-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const inputClass =
  'w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all';

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground border-border'}`}>
      {status}
    </span>
  );
}

function eventTypeLabel(value: string) {
  return EVENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function RestaurantEventsPage() {
  const router = useRouter();
  const { data: events, mutate } = useSWR('/api/restaurant-events', fetcher);
  const { data: menuItems } = useSWR('/api/pos/menu', fetcher);

  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selected, setSelected] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemForm, setEditingItemForm] = useState({ description: '', quantity: '1', unitPrice: '' });
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    guestName: '',
    guestContact: '',
    guestEmail: '',
    eventType: 'GROUP_BOOKING',
    eventDate: '',
    startTime: '',
    endTime: '',
    partySize: '',
    specialRequests: '',
    notes: '',
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    guestName: '',
    guestContact: '',
    guestEmail: '',
    eventType: 'GROUP_BOOKING',
    eventDate: '',
    startTime: '',
    endTime: '',
    partySize: '',
    specialRequests: '',
    notes: '',
  });
  const [addItemForm, setAddItemForm] = useState({ description: '', quantity: '1', unitPrice: '' });
  const [menuSearch, setMenuSearch] = useState('');

  const allEvents: any[] = Array.isArray(events) ? events : [];
  const now = new Date();
  const upcoming = allEvents.filter((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED');
  const past = allEvents.filter((e) => e.status === 'COMPLETED' || e.status === 'CANCELLED');
  const displayed = tab === 'upcoming' ? upcoming : past;

  const safeMenuItems: any[] = Array.isArray(menuItems) ? menuItems : [];
  const filteredMenu = safeMenuItems.filter((m) =>
    m.name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const eventTotal = (event: any) =>
    (event?.items ?? []).reduce((s: number, i: any) => s + i.totalPrice, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.guestName || !createForm.eventDate || !createForm.startTime || !createForm.partySize) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (createForm.endTime && createForm.endTime <= createForm.startTime) {
      toast.error('End time must be after start time');
      return;
    }
    setIsSaving(true);
    try {
      // Combine eventDate + startTime into ISO datetime
      const startISO = new Date(`${createForm.eventDate}T${createForm.startTime}`).toISOString();
      const endISO = createForm.endTime
        ? new Date(`${createForm.eventDate}T${createForm.endTime}`).toISOString()
        : null;

      const res = await fetch('/api/restaurant-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          eventDate: new Date(createForm.eventDate).toISOString(),
          startTime: startISO,
          endTime: endISO,
        }),
      });
      if (!res.ok) { toast.error('Failed to create event'); return; }
      const created = await res.json();
      toast.success('Event created');
      setIsCreating(false);
      setCreateForm({ name: '', guestName: '', guestContact: '', guestEmail: '', eventType: 'GROUP_BOOKING', eventDate: '', startTime: '', endTime: '', partySize: '', specialRequests: '', notes: '' });
      await mutate();
      setSelected(created);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (event: any) => {
    const toDateInput = (iso: string) => new Date(iso).toISOString().slice(0, 10);
    const toTimeInput = (iso: string) => new Date(iso).toTimeString().slice(0, 5);
    setEditForm({
      name: event.name,
      guestName: event.guestName,
      guestContact: event.guestContact ?? '',
      guestEmail: event.guestEmail ?? '',
      eventType: event.eventType,
      eventDate: toDateInput(event.eventDate),
      startTime: toTimeInput(event.startTime),
      endTime: event.endTime ? toTimeInput(event.endTime) : '',
      partySize: String(event.partySize),
      specialRequests: event.specialRequests ?? '',
      notes: event.notes ?? '',
    });
    setIsEditing(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!editForm.name || !editForm.guestName || !editForm.eventDate || !editForm.startTime || !editForm.partySize) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (editForm.endTime && editForm.endTime <= editForm.startTime) {
      toast.error('End time must be after start time');
      return;
    }
    setIsSaving(true);
    try {
      const startISO = new Date(`${editForm.eventDate}T${editForm.startTime}`).toISOString();
      const endISO = editForm.endTime
        ? new Date(`${editForm.eventDate}T${editForm.endTime}`).toISOString()
        : null;
      const res = await fetch(`/api/restaurant-events/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          eventDate: new Date(editForm.eventDate).toISOString(),
          startTime: startISO,
          endTime: endISO,
        }),
      });
      if (!res.ok) { toast.error('Failed to update event'); return; }
      const updated = await res.json();
      toast.success('Event updated');
      setIsEditing(false);
      setSelected(updated);
      await mutate();
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (eventId: string, status: string) => {
    const res = await fetch(`/api/restaurant-events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { toast.error('Failed to update status'); return; }
    const updated = await res.json();
    toast.success(`Event marked as ${status}`);
    setSelected(updated);
    await mutate();
    setCancelConfirm(false);
  };

  const handleAddItem = async (description: string, unitPrice: number, overrideQty?: number) => {
    if (!selected) return;
    const qty = (overrideQty ?? parseInt(addItemForm.quantity)) || 1;
    const price = unitPrice || parseFloat(addItemForm.unitPrice) || 0;
    if (!description || !price) { toast.error('Fill in item details'); return; }
    setIsAddingItem(true);
    try {
      const res = await fetch(`/api/restaurant-events/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addItem: { description, quantity: qty, unitPrice: price } }),
      });
      if (!res.ok) { toast.error('Failed to add item'); return; }
      const updated = await res.json();
      setSelected(updated);
      setAddItemForm({ description: '', quantity: '1', unitPrice: '' });
      setMenuSearch('');
      await mutate();
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!selected) return;
    const res = await fetch(`/api/restaurant-events/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ removeItemId: itemId }),
    });
    if (!res.ok) { toast.error('Failed to remove item'); return; }
    const updated = await res.json();
    setSelected(updated);
    await mutate();
  };

  const startEditItem = (item: any) => {
    setEditingItemId(item.id);
    setEditingItemForm({ description: item.description, quantity: String(item.quantity), unitPrice: String(item.unitPrice) });
  };

  const handleSaveItem = async () => {
    if (!selected || !editingItemId) return;
    setIsSavingItem(true);
    try {
      const res = await fetch(`/api/restaurant-events/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editItem: { itemId: editingItemId, ...editingItemForm } }),
      });
      if (!res.ok) { toast.error('Failed to update item'); return; }
      const updated = await res.json();
      setSelected(updated);
      setEditingItemId(null);
      await mutate();
    } catch { toast.error('Error updating item'); }
    finally { setIsSavingItem(false); }
  };

  const handleFinalize = async () => {
    if (!selected) return;
    setIsFinalizing(true);
    try {
      const res = await fetch(`/api/restaurant-events/${selected.id}/finalize`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to finalize'); return; }
      toast.success('Event finalized — opening invoice');
      await mutate();
      router.push(`/invoice/restaurant?id=${data.invoiceId}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/restaurant-events/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) { toast.error('Failed to delete event'); return; }
      toast.success('Event deleted');
      setSelected(null);
      setDeleteConfirm(false);
      await mutate();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 lg:p-8 flex-1 flex flex-col">
        <TopBar
          title="Restaurant Events"
          description="Manage group bookings and private events at the restaurant."
          actions={
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Event
            </button>
          }
        />

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6 border border-border">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-6">
          {/* Event list */}
          <div className="space-y-3">
            {!events ? (
              <div className="text-center text-muted-foreground text-sm py-16">Loading events...</div>
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-30">celebration</span>
                <p className="text-sm">{tab === 'upcoming' ? 'No upcoming events' : 'No past events'}</p>
                {tab === 'upcoming' && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-4 text-xs text-primary hover:underline"
                  >
                    Create the first event
                  </button>
                )}
              </div>
            ) : (
              displayed.map((event: any) => (
                <button
                  key={event.id}
                  onClick={() => setSelected(event)}
                  className={`w-full text-left bg-card border rounded-xl p-4 hover:shadow-md transition-all ${selected?.id === event.id ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/30'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{event.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{eventTypeLabel(event.eventType)}</p>
                    </div>
                    <StatusBadge status={event.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {event.guestName}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {event.partySize} guests
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {formatDateTime(event.startTime)}
                    </span>
                  </div>
                  {event.items?.length > 0 && (
                    <p className="mt-2 text-xs font-medium text-foreground">
                      RWF {eventTotal(event).toLocaleString()} · {event.items.length} item{event.items.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden h-fit lg:sticky lg:top-4">
              <div className="p-4 border-b border-border flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{eventTypeLabel(selected.eventType)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selected.status} />
                  {selected.status !== 'CANCELLED' && (
                    <button
                      onClick={() => openEdit(selected)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit event"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  )}
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs border-b border-border">
                <Row icon="person" label="Organizer" value={selected.guestName} />
                {selected.guestContact && <Row icon="phone" label="Contact" value={selected.guestContact} />}
                {selected.guestEmail && <Row icon="mail" label="Email" value={selected.guestEmail} />}
                <Row icon="group" label="Party size" value={`${selected.partySize} guests`} />
                <Row icon="calendar_today" label="Date" value={formatDate(selected.eventDate)} />
                <Row icon="schedule" label="Start" value={formatDateTime(selected.startTime)} />
                {selected.endTime && <Row icon="schedule" label="End" value={formatDateTime(selected.endTime)} />}
                {selected.specialRequests && <Row icon="star" label="Special requests" value={selected.specialRequests} />}
                {selected.notes && <Row icon="notes" label="Notes" value={selected.notes} />}
              </div>

              {/* Items */}
              <div className="p-4 border-b border-border">
                <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Order Items</h4>
                {selected.items?.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No items added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selected.items.map((item: any) => (
                      <div key={item.id} className="rounded-lg border border-border overflow-hidden">
                        {editingItemId === item.id ? (
                          <div className="p-2 space-y-2 bg-muted/30">
                            <input
                              className={inputClass}
                              value={editingItemForm.description}
                              onChange={e => setEditingItemForm(f => ({ ...f, description: e.target.value }))}
                              placeholder="Description"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                className={inputClass}
                                type="number"
                                min="1"
                                value={editingItemForm.quantity}
                                onChange={e => setEditingItemForm(f => ({ ...f, quantity: e.target.value }))}
                                placeholder="Qty"
                              />
                              <input
                                className={inputClass}
                                type="number"
                                min="0"
                                value={editingItemForm.unitPrice}
                                onChange={e => setEditingItemForm(f => ({ ...f, unitPrice: e.target.value }))}
                                placeholder="Price (RWF)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="flex-1 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-accent transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveItem}
                                disabled={isSavingItem}
                                className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                              >
                                {isSavingItem ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 px-3 py-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{item.description}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {item.quantity} × RWF {item.unitPrice.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-foreground">
                                RWF {item.totalPrice.toLocaleString()}
                              </span>
                              {selected.status !== 'CANCELLED' && (
                                <>
                                  <button
                                    onClick={() => startEditItem(item)}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                    title="Edit item"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="pt-2 border-t border-border flex justify-between">
                      <span className="text-xs font-semibold text-foreground">Total</span>
                      <span className="text-sm font-bold text-foreground">RWF {eventTotal(selected).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Add item — available for all except CANCELLED */}
                {selected.status !== 'CANCELLED' && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Add from menu</p>
                    <input
                      className={inputClass}
                      placeholder="Search menu..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                    />
                    {menuSearch && filteredMenu.length > 0 && (
                      <div className="border border-border rounded-lg divide-y divide-border max-h-36 overflow-y-auto">
                        {filteredMenu.slice(0, 8).map((m: any) => (
                          <button
                            key={m.id}
                            onClick={() => handleAddItem(m.name, m.price, 1)}
                            className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted text-left transition-colors"
                          >
                            <span className="text-foreground truncate">{m.name}</span>
                            <span className="text-muted-foreground ml-2 flex-shrink-0">RWF {m.price.toLocaleString()}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-3">Or add custom item</p>
                    <input
                      className={inputClass}
                      placeholder="Item description"
                      value={addItemForm.description}
                      onChange={(e) => setAddItemForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className={inputClass}
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={addItemForm.quantity}
                        onChange={(e) => setAddItemForm((f) => ({ ...f, quantity: e.target.value }))}
                      />
                      <input
                        className={inputClass}
                        type="number"
                        placeholder="Price (RWF)"
                        min="0"
                        value={addItemForm.unitPrice}
                        onChange={(e) => setAddItemForm((f) => ({ ...f, unitPrice: e.target.value }))}
                      />
                    </div>
                    <button
                      onClick={() => handleAddItem(addItemForm.description, parseFloat(addItemForm.unitPrice))}
                      disabled={isAddingItem}
                      className="w-full bg-muted border border-border text-foreground text-xs font-medium py-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      {isAddingItem ? 'Adding...' : 'Add Item'}
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selected.status !== 'COMPLETED' && selected.status !== 'CANCELLED' && (
                <div className="p-4 space-y-2">
                  {selected.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStatusChange(selected.id, 'ACTIVE')}
                      className="w-full bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span>
                      Check In — Mark Active
                    </button>
                  )}
                  {selected.status === 'ACTIVE' && (
                    <button
                      onClick={handleFinalize}
                      disabled={isFinalizing || selected.items?.length === 0}
                      className="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">{isFinalizing ? 'sync' : 'receipt_long'}</span>
                      {isFinalizing ? 'Generating invoice...' : 'Finalize & Generate Invoice'}
                    </button>
                  )}
                  {!cancelConfirm ? (
                    <button
                      onClick={() => setCancelConfirm(true)}
                      className="w-full border border-destructive text-destructive text-xs font-medium py-2 rounded-lg hover:bg-destructive/5 transition-colors"
                    >
                      Cancel Event
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(selected.id, 'CANCELLED')}
                        className="flex-1 bg-destructive text-destructive-foreground text-xs font-medium py-2 rounded-lg hover:bg-destructive/90 transition-colors"
                      >
                        Confirm Cancel
                      </button>
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="flex-1 border border-border text-foreground text-xs font-medium py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        Keep Event
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selected.status === 'COMPLETED' && selected.invoiceId && (
                <div className="px-4 pt-0 pb-2">
                  <button
                    onClick={() => router.push(`/invoice/restaurant?id=${selected.invoiceId}`)}
                    className="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    View Invoice
                  </button>
                </div>
              )}

              <div className="p-4 border-t border-border">
                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="w-full border border-destructive/40 text-destructive text-xs font-medium py-2 rounded-lg hover:bg-destructive/5 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    Delete Event
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-center text-muted-foreground">This cannot be undone. Delete this event?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="flex-1 border border-border text-foreground text-xs font-medium py-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        Keep
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-destructive text-destructive-foreground text-xs font-medium py-2 rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center text-muted-foreground rounded-xl border border-dashed border-border h-64">
              <div className="text-center">
                <span className="material-symbols-outlined text-3xl block mb-2 opacity-30">touch_app</span>
                <p className="text-sm">Select an event to manage it</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Edit Event</h2>
              <button onClick={() => setIsEditing(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Event Name *</label>
                <input className={inputClass} placeholder="e.g. Smith Birthday Dinner" required value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Organizer Name *</label>
                  <input className={inputClass} placeholder="Guest name" required value={editForm.guestName} onChange={(e) => setEditForm((f) => ({ ...f, guestName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Contact</label>
                  <input className={inputClass} placeholder="Phone / WhatsApp" value={editForm.guestContact} onChange={(e) => setEditForm((f) => ({ ...f, guestContact: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input className={inputClass} type="email" placeholder="guest@email.com" value={editForm.guestEmail} onChange={(e) => setEditForm((f) => ({ ...f, guestEmail: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Event Type</label>
                  <select className={inputClass} value={editForm.eventType} onChange={(e) => setEditForm((f) => ({ ...f, eventType: e.target.value }))}>
                    {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Party Size *</label>
                  <input className={inputClass} type="number" min="1" placeholder="No. of guests" required value={editForm.partySize} onChange={(e) => setEditForm((f) => ({ ...f, partySize: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Event Date *</label>
                <input className={inputClass} type="date" required value={editForm.eventDate} onChange={(e) => setEditForm((f) => ({ ...f, eventDate: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Start Time *</label>
                  <input className={inputClass} type="time" required value={editForm.startTime} onChange={(e) => setEditForm((f) => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">End Time</label>
                  <input className={inputClass} type="time" value={editForm.endTime} onChange={(e) => setEditForm((f) => ({ ...f, endTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Special Requests</label>
                <textarea className={inputClass} rows={2} placeholder="Dietary requirements, decorations, seating preferences..." value={editForm.specialRequests} onChange={(e) => setEditForm((f) => ({ ...f, specialRequests: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Internal Notes</label>
                <textarea className={inputClass} rows={2} placeholder="Notes for staff..." value={editForm.notes} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-border text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">New Restaurant Event</h2>
              <button onClick={() => setIsCreating(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Event Name *</label>
                <input className={inputClass} placeholder="e.g. Smith Birthday Dinner" required value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Organizer Name *</label>
                  <input className={inputClass} placeholder="Guest name" required value={createForm.guestName} onChange={(e) => setCreateForm((f) => ({ ...f, guestName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Contact</label>
                  <input className={inputClass} placeholder="Phone / WhatsApp" value={createForm.guestContact} onChange={(e) => setCreateForm((f) => ({ ...f, guestContact: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input className={inputClass} type="email" placeholder="guest@email.com" value={createForm.guestEmail} onChange={(e) => setCreateForm((f) => ({ ...f, guestEmail: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Event Type</label>
                  <select className={inputClass} value={createForm.eventType} onChange={(e) => setCreateForm((f) => ({ ...f, eventType: e.target.value }))}>
                    {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Party Size *</label>
                  <input className={inputClass} type="number" min="1" placeholder="No. of guests" required value={createForm.partySize} onChange={(e) => setCreateForm((f) => ({ ...f, partySize: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Event Date *</label>
                <input className={inputClass} type="date" required value={createForm.eventDate} onChange={(e) => setCreateForm((f) => ({ ...f, eventDate: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Start Time *</label>
                  <input className={inputClass} type="time" required value={createForm.startTime} onChange={(e) => setCreateForm((f) => ({ ...f, startTime: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">End Time</label>
                  <input className={inputClass} type="time" value={createForm.endTime} onChange={(e) => setCreateForm((f) => ({ ...f, endTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Special Requests</label>
                <textarea className={inputClass} rows={2} placeholder="Dietary requirements, decorations, seating preferences..." value={createForm.specialRequests} onChange={(e) => setCreateForm((f) => ({ ...f, specialRequests: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Internal Notes</label>
                <textarea className={inputClass} rows={2} placeholder="Notes for staff..." value={createForm.notes} onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 border border-border text-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="material-symbols-outlined text-[14px] text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <span className="text-muted-foreground">{label}: </span>
        <span className="text-foreground font-medium">{value}</span>
      </div>
    </div>
  );
}
