'use client';
import React from 'react';

interface Booking {
  id: string;
  type?: 'ROOM' | 'CONFERENCE';
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  revenue: number;
  status: string;
}

interface DayBookingsModalProps {
  date: Date;
  bookings: Booking[];
  onClose: () => void;
}

export default function DayBookingsModal({ date, bookings, onClose }: DayBookingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Daily Bookings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {bookings.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">event_busy</span>
              <p className="text-sm">No bookings for this date</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-lg border border-border bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          booking.type === 'CONFERENCE'
                            ? 'bg-violet-100 text-violet-700 border border-violet-200'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}
                      >
                        {booking.type === 'CONFERENCE' ? booking.roomNumber : `Room ${booking.roomNumber}`}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{booking.roomType}</span>
                    </div>
                    <h4 className="text-sm font-medium text-foreground truncate">{booking.guestName}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Revenue</p>
                    <p className="text-sm font-medium text-foreground">RWF {booking.revenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {new Date(booking.checkIn).toLocaleDateString()} —{' '}
                    {new Date(booking.checkOut).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        booking.type === 'CONFERENCE' ? 'bg-violet-500' : 'bg-primary'
                      }`}
                    />
                    {booking.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex justify-between items-center bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
