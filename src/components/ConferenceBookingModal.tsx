'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const inputClass =
  'w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all';

interface ConferenceBookingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
}

export default function ConferenceBookingModal({ onClose, onSuccess, initialDate }: ConferenceBookingModalProps) {
  const { data: rooms } = useSWR('/api/conference', fetcher);
  const [formData, setFormData] = useState({
    conferenceRoomId: '',
    guestName: '',
    guestContact: '',
    guestId: '',
    guestEmail: '',
    startTime: initialDate ? new Date(initialDate.setHours(9, 0, 0, 0)).toISOString().slice(0, 16) : '',
    endTime: initialDate ? new Date(initialDate.setHours(17, 0, 0, 0)).toISOString().slice(0, 16) : '',
    totalAmount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/conference/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Book Event</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Reserve a conference room or venue</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
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
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Hall / Room</label>
            <select
              required
              className={inputClass}
              value={formData.conferenceRoomId}
              onChange={(e) => setFormData({ ...formData, conferenceRoomId: e.target.value })}
            >
              <option value="">Choose a room...</option>
              {rooms?.map((room: { id: string; name: string; capacity: number; pricePerHour: number }) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Cap: {room.capacity}) — RWF {room.pricePerHour}/hr
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Start Time</label>
              <input
                required
                type="datetime-local"
                className={inputClass}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">End Time</label>
              <input
                required
                type="datetime-local"
                className={inputClass}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Guest Name</label>
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
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Contact Phone</label>
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
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Total Amount (RWF)</label>
            <input
              required
              type="number"
              className={inputClass}
              placeholder="Enter pricing"
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
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
