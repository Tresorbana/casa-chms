'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
    totalAmount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (bookingMode !== 'daily' || !selectedRoom?.pricePerDay) return;
    if (formData.totalAmount !== '' && formData.conferenceRoomId) return;
    if (dayCount > 0) {
      setFormData((prev) => ({ ...prev, totalAmount: String(suggestedDailyTotal) }));
    }
  }, [bookingMode, selectedRoom, suggestedDailyTotal, dayCount, formData.conferenceRoomId, formData.totalAmount]);

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
            totalAmount: formData.totalAmount || suggestedDailyTotal,
          }
        : {
            conferenceRoomId: formData.conferenceRoomId,
            guestName: formData.guestName,
            guestContact: formData.guestContact,
            guestId: formData.guestId,
            bookingType: 'HOURLY',
            startTime: formData.startTime,
            endTime: formData.endTime,
            totalAmount: formData.totalAmount,
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
              onChange={(e) => setFormData({ ...formData, conferenceRoomId: e.target.value, totalAmount: '' })}
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
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">End time</label>
                <input
                  required
                  type="datetime-local"
                  className={inputClass}
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total amount (RWF)</label>
            <input
              required
              type="number"
              className={inputClass}
              placeholder={bookingMode === 'daily' ? 'Auto-calculated from daily rate' : 'Enter pricing'}
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            />
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
