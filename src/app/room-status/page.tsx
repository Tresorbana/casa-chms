'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const STATUS_CONFIG: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  AVAILABLE: { dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  OCCUPIED:  { dot: 'bg-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/30',       text: 'text-blue-700 dark:text-blue-400',       border: 'border-blue-200 dark:border-blue-800' },
};

export default function RoomStatus() {
  const { data: rooms, isLoading } = useSWR('/api/rooms', fetcher, {
    onError: () => toast.error('Failed to load rooms'),
  });
  const [filter, setFilter] = useState('ALL');

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const stats = {
    total:     safeRooms.length,
    available: safeRooms.filter((r: any) => r.status === 'AVAILABLE').length,
    occupied:  safeRooms.filter((r: any) => r.status === 'OCCUPIED').length,
  };

  // Only show AVAILABLE and OCCUPIED rooms
  const visibleRooms = safeRooms.filter((r: any) => r.status === 'AVAILABLE' || r.status === 'OCCUPIED');
  const filteredRooms = visibleRooms.filter((r: any) => filter === 'ALL' || r.status === filter);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar title="Room Status" description="Real-time status of all hotel rooms." />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Rooms', value: stats.total, dot: '' },
          { label: 'Available',   value: stats.available, dot: 'bg-emerald-500' },
          { label: 'Occupied',    value: stats.occupied,  dot: 'bg-blue-500' },
        ].map(item => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            {item.dot && <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.dot}`} />}
            <div>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
              <p className="text-xl font-normal text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['ALL', 'AVAILABLE', 'OCCUPIED'] as const).map((s) => {
          const cfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG];
          const count = s === 'ALL' ? stats.total : stats[s.toLowerCase() as keyof typeof stats];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border ${
                filter === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
              }`}
            >
              {s !== 'ALL' && cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
              {s} {s !== 'ALL' && `(${count})`}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredRooms.map((room: any) => {
            const cfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG['AVAILABLE'];
            return (
              <div
                key={room.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${cfg.bg} ${cfg.border}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xl font-normal ${cfg.text}`}>{room.number}</span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 ${cfg.dot}`} />
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{room.type}</p>
                <p className={`text-xs ${cfg.text}`}>
                  {room.status === 'OCCUPIED' ? 'Occupied' : 'Available'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && filteredRooms.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <span className="material-symbols-outlined text-3xl text-muted-foreground/40 mb-2 block">hotel</span>
          <p className="text-sm text-muted-foreground">No rooms with this status</p>
        </div>
      )}
    </div>
  );
}
