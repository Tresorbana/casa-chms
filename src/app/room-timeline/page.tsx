'use client';
import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

export default function RoomTimeline() {
  const { data: rooms, isLoading } = useSWR('/api/rooms', fetcher, {
    onError: () => toast.error('Failed to load timeline'),
  });

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar title="Room Timeline" description="7-day view of room allocations." />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading timeline...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="flex border-b border-border bg-muted/50">
              <div className="w-40 flex-shrink-0 p-4 text-xs font-medium text-muted-foreground border-r border-border">Room</div>
              <div className="flex-1 flex">
                {days.map((date, i) => (
                  <div key={i} className="flex-1 min-w-[120px] p-4 text-center border-r border-border last:border-0">
                    <p className={`text-xs font-medium ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className={`text-xs mt-0.5 ${i === 0 ? 'text-primary font-semibold' : 'text-foreground/50'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="overflow-y-auto max-h-[70vh]">
              {rooms?.map((room: any) => (
                <div key={room.id} className="flex border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <div className="w-40 flex-shrink-0 p-4 border-r border-border bg-muted/20">
                    <p className="text-sm font-medium text-foreground">Room {room.number}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{room.type}</p>
                  </div>
                  <div className="flex-1 flex">
                    {days.map((date, i) => {
                      const nextDay = new Date(date);
                      nextDay.setDate(date.getDate() + 1);
                      const booking = room.bookings?.find((b: any) => {
                        const ci = new Date(b.checkIn);
                        const co = new Date(b.checkOut);
                        return ci < nextDay && co > date;
                      });
                      return (
                        <div key={i} className="flex-1 min-w-[120px] p-2 flex items-center justify-center min-h-[60px] border-r border-border last:border-0">
                          {booking ? (
                            <div className="w-full rounded-lg p-2 bg-blue-50 border-l-2 border-blue-400">
                              <p className="text-[10px] font-medium text-blue-700 truncate">{booking.guest?.name}</p>
                              <p className="text-[9px] text-blue-500 uppercase">{booking.status}</p>
                            </div>
                          ) : (
                            <div className="w-full h-7 flex items-center justify-center rounded-lg border border-dashed border-border">
                              <span className="material-symbols-outlined text-muted-foreground/30 text-sm">add</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {(!rooms || rooms.length === 0) && (
                <div className="py-16 text-center text-muted-foreground">
                  <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">hotel</span>
                  <p className="text-sm">No rooms found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
