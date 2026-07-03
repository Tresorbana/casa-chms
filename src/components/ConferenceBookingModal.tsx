'use client';
import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { calculateDailyTotal, countBookingDays } from '@/lib/conference-booking';

const inputClass =
  'w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all';

type BookingMode = 'hourly' | 'daily';

interface ConferenceRoomOption {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  pricePerDay: number;
}

interface ConferenceBookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

interface AvailableRoom {
  id: string;
  number: string;
  type: string;
  price: number;
  floor?: { name?: string } | null;
}

export default function ConferenceBookingModal({ onClose, onSuccess, initialDate }: ConferenceBookingModalProps) {
  const { data: rooms } = useSWR<ConferenceRoomOption[]>('/api/conference', fetcher);
  const baseDate = initialDate ? new Date(initialDate) : new Date();

  const [bookingMode, setBookingMode] = useState<BookingMode>('daily');
  const [formData, setFormData] = useState({
    conferenceRoomId: '',
    guestName: '',
    guestContact: '',
    guestId: '',
    startTime: '',
    endTime: '',
    startDate: toDateInput(baseDate),
    endDate: toDateInput(baseDate),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomsToBook, setRoomsToBook] = useState<string[]>([]);

  // Fetch available rooms once dates are selected
  const availabilityKey = useMemo(() => {
    if (bookingMode === 'daily' && formData.startDate && formData.endDate) {
      return `/api/rooms/available?checkIn=${formData.startDate}&checkOut=${formData.endDate}`;
    }
    if (bookingMode === 'hourly' && formData.startTime && formData.endTime) {
      return `/api/rooms/available?checkIn=${formData.startTime}&checkOut=${formData.endTime}`;
    }
    return null;
  }, [bookingMode, formData.startDate, formData.endDate, formData.startTime, formData.endTime]);

  const { data: availableRoomsRaw } = useSWR<AvailableRoom[]>(availabilityKey, fetcher);
  const availableRooms = availableRoomsRaw ?? [];

  const toggleRoom = (id: string) =>
    setRoomsToBook((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectedRoom = useMemo(
    () => rooms?.find((r) => r.id === formData.conferenceRoomId),
    [rooms, formData.conferenceRoomId]
  );

  const suggestedDailyTotal = useMemo(() => {
    if (!selectedRoom?.pricePerDay || !formData.startDate || !formData.endDate) return 0;
    return calculateDailyTotal(selectedRoom.pricePerDay, formData.startDate, formData.endDate);
  }, [selectedRoom, formData.startDate, formData.endDate]);

  const dayCount = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    return countBookingDays(formData.startDate, formData.endDate);
  }, [formData.startDate, formData.endDate]);

  const calculatedHourlyTotal = useMemo(() => {
    if (!selectedRoom?.pricePerHour || !formData.startTime || !formData.endTime) return 0;
    const start = new Date(formData.startTime).getTime();
    const end = new Date(formData.endTime).getTime();
    if (end <= start) return 0;
    const hours = (end - start) / 3600000;
    return Math.ceil(hours) * selectedRoom.pricePerHour;
  }, [selectedRoom, formData.startTime, formData.endTime]);

  const autoTotal = bookingMode === 'daily' ? suggestedDailyTotal : calculatedHourlyTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload =
      bookingMode === 'daily'
        ? {
            conferenceRoomId: formData.conferenceRoomId,
            guestName: formData.guestName,
            guestContact: formData.guestContact,
            guestId: formData.guestId,
            bookingType: 'DAILY',
            startDate: formData.startDate,
            endDate: formData.endDate,
            totalAmount: autoTotal,
            roomsToBook,
          }
        : {
            conferenceRoomId: formData.conferenceRoomId,
            guestName: formData.guestName,
            guestContact: formData.guestContact,
            guestId: formData.guestId,
            bookingType: 'HOURLY',
            startTime: formData.startTime,
            endTime: formData.endTime,
            totalAmount: autoTotal,
            roomsToBook,
          };

    try {
      const res = await fetch('/api/conference/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create booking');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Book Event</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Reserve a conference room or venue</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg text-sm text-destructive bg-destructive/10 border border-destructive/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error_outline</span>
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Booking type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
              {(
                [
                  { id: 'daily' as const, label: 'Full day(s)' },
                  { id: 'hourly' as const, label: 'By hour' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBookingMode(opt.id)}
                  className={`py-2 rounded-md text-xs font-medium transition-colors ${
                    bookingMode === opt.id
                      ? 'bg-card text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Hall / Room</label>
            <select
              required
              className={inputClass}
              value={formData.conferenceRoomId}
              onChange={(e) => setFormData({ ...formData, conferenceRoomId: e.target.value })}
            >
              <option value="">Choose a room...</option>
              {rooms?.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Cap: {room.capacity})
                  {bookingMode === 'daily'
                    ? ` — RWF ${room.pricePerDay?.toLocaleString() ?? 0}/day`
                    : ` — RWF ${room.pricePerHour}/hr`}
                </option>
              ))}
            </select>
          </div>

          {bookingMode === 'daily' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Start date</label>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={formData.startDate}
                    onChange={(e) => { setFormData({ ...formData, startDate: e.target.value }); setRoomsToBook([]); }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">End date</label>
                  <input
                    required
                    type="date"
                    className={inputClass}
                    min={formData.startDate}
                    value={formData.endDate}
                    onChange={(e) => { setFormData({ ...formData, endDate: e.target.value }); setRoomsToBook([]); }}
                  />
                </div>
              </div>
              {selectedRoom && dayCount > 0 && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
                  {dayCount} day{dayCount !== 1 ? 's' : ''} × RWF {selectedRoom.pricePerDay.toLocaleString()}/day
                  {' '}= RWF {suggestedDailyTotal.toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Start time</label>
                <input
                  required
                  type="datetime-local"
                  className={inputClass}
                  value={formData.startTime}
                  onChange={(e) => { setFormData({ ...formData, startTime: e.target.value }); setRoomsToBook([]); }}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">End time</label>
                <input
                  required
                  type="datetime-local"
                  className={inputClass}
                  value={formData.endTime}
                  onChange={(e) => { setFormData({ ...formData, endTime: e.target.value }); setRoomsToBook([]); }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Guest name</label>
            <input
              required
              type="text"
              className={inputClass}
              placeholder="Who is booking?"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Contact phone</label>
              <input
                required
                type="text"
                className={inputClass}
                placeholder="+250..."
                value={formData.guestContact}
                onChange={(e) => setFormData({ ...formData, guestContact: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">ID / Passport</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Optional"
                value={formData.guestId}
                onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
              />
            </div>
          </div>

          {availabilityKey && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Book hotel rooms for attendees
                <span className="text-[10px] font-normal ml-1">(optional)</span>
              </label>
              {availableRooms.length === 0 ? (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
                  {availableRoomsRaw === undefined ? 'Checking availability…' : 'No rooms available for these dates'}
                </p>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                  {availableRooms.map((room) => (
                    <label
                      key={room.id}
                      className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors border-b border-border/50 last:border-0 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={roomsToBook.includes(room.id)}
                        onChange={() => toggleRoom(room.id)}
                        className="rounded border-border"
                      />
                      <span className="material-symbols-outlined text-[14px] text-muted-foreground">hotel</span>
                      <span className="flex-1">
                        Room {room.number}
                        {room.floor?.name ? ` · ${room.floor.name}` : ''}
                      </span>
                      <span className="text-muted-foreground">{room.type}</span>
                      <span className="font-medium text-foreground">RWF {room.price.toLocaleString()}/night</span>
                    </label>
                  ))}
                </div>
              )}
              {roomsToBook.length > 0 && (
                <p className="text-[10px] text-primary mt-1 font-medium">
                  {roomsToBook.length} room{roomsToBook.length !== 1 ? 's' : ''} will be booked for attendees
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total amount (RWF)</label>
            <div className="w-full bg-muted border border-border rounded-lg px-4 py-2.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {autoTotal > 0 ? `RWF ${autoTotal.toLocaleString()}` : '—'}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Auto-calculated</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
