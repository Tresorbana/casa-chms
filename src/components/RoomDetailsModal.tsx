'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const inputClass =
  'w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all';

interface RoomDetailsModalProps {
  room: {
    id: string;
    number: string;
    type: string;
    price: number;
    floor?: { name?: string; number?: number };
    activeBooking?: {
      id: string;
      checkIn: string;
      checkOut: string;
      guest: { name: string };
    };
  };
  onClose: () => void;
  onUpdate: () => void;
}

export default function RoomDetailsModal({ room, onClose, onUpdate }: RoomDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    number: room.number,
    type: room.type,
    price: room.price,
  });
  const [isSaving, setIsSaving] = useState(false);

  const activeBooking = room.activeBooking;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: room.id, ...formData }),
      });
      if (res.ok) {
        onUpdate();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update room:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Room {room.number}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Room details and occupancy</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-5 flex-1 space-y-5">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Specifications</h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Room Type</p>
                {isEditing ? (
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={inputClass}
                  >
                    <option value="TWIN">Twin</option>
                    <option value="VIP">VIP</option>
                    <option value="EXECUTIVE">Executive</option>
                    <option value="SUITE">Suite</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-foreground">{room.type}</p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Daily Rate (RWF)</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className={inputClass}
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    RWF {room.price?.toLocaleString() || '—'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Category</p>
                <p className="text-sm font-medium text-foreground">
                  {room.floor?.name || `Category ${room.floor?.number}`}
                </p>
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>

          <div className="p-5 flex-1 bg-muted/30">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Active Occupancy
            </h4>

            {activeBooking ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Guest</p>
                    <p className="text-sm font-medium text-foreground">{activeBooking.guest.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Stay period</p>
                  <p className="text-sm text-foreground">
                    {new Date(activeBooking.checkIn).toLocaleDateString()} —{' '}
                    {new Date(activeBooking.checkOut).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/checkout?roomId=${room.id}`}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    Folio / pay
                  </Link>
                  <Link
                    href={`/checkout?roomId=${room.id}`}
                    className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Checkout
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto border border-dashed border-border">
                  <span className="material-symbols-outlined text-muted-foreground text-2xl">event_available</span>
                </div>
                <p className="text-sm text-muted-foreground">Room is vacant</p>
                <Link
                  href={`/bookings?roomNumber=${room.number}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Book now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
