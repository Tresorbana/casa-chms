'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';

// Lazy-load the modal — not included in initial JS bundle
const RoomDetailsModal = dynamic(() => import('@/components/RoomDetailsModal'), { ssr: false });

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard?date=${selectedDate}`,
    fetcher
  );

  const stats = data?.stats ?? {};
  const rooms: any[] = data?.rooms ?? [];

  // Memoize rooms-by-floor grouping so it doesn't recompute on every keystroke
  const { sortedFloors, roomsByFloor } = useMemo(() => {
    const roomsByFloor: Record<number, any[]> = {};
    rooms.forEach((room) => {
      const floorNum = room.floor?.number ?? 0;
      if (!roomsByFloor[floorNum]) roomsByFloor[floorNum] = [];
      roomsByFloor[floorNum].push(room);
    });
    const sortedFloors = Object.keys(roomsByFloor).map(Number).sort((a, b) => a - b);
    return { sortedFloors, roomsByFloor };
  }, [rooms]);

  if (isLoading || !data) return (
    <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
      Loading System Data...
    </div>
  );
  if (error) return (
    <div className="p-8 text-center text-red-400 font-black">Connection Failure</div>
  );

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-slate-50 flex flex-col gap-8">
      <TopBar
        title="Management Dashboard"
        description="Real-time hotel occupancy and revenue status."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-icons-outlined text-sm">calendar_today</span>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-2.5 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary shadow-sm hover:shadow-md transition-all cursor-pointer"
              />
            </div>
            <Link
              href="/bookings"
              className="bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] px-8 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
            >
              <span className="material-icons-outlined text-sm">add</span>
              New Reservation
            </Link>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
              <span className="material-icons-outlined text-2xl">bed</span>
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Target Occupancy</h3>
          <p className="text-4xl font-black italic tracking-tighter uppercase">{(stats.occupancyRate || 0).toFixed(1)}%</p>
          <div className="w-full bg-slate-100 h-2 mt-6 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${stats.occupancyRate || 0}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <span className="material-icons-outlined text-2xl">payments</span>
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Revenue Performance</h3>
          <p className="text-4xl font-black italic tracking-tighter uppercase">RWF {(stats.revenueToday || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
              <span className="material-icons-outlined text-2xl">pending_actions</span>
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Bookings</h3>
          <p className="text-4xl font-black italic tracking-tighter uppercase">{stats.pendingReservations || 0}</p>
        </div>
      </div>

      {/* Room Grid */}
      <section className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800 leading-none mb-2">Room Status Grid</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Live hotel room status for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[{ label: 'Available', color: 'secondary' }, { label: 'Occupied', color: 'primary' }].map(status => (
              <div key={status.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className={`w-3 h-3 rounded-full bg-${status.color}`} /> {status.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {sortedFloors.length === 0 ? (
            <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              No rooms found.
            </div>
          ) : sortedFloors.map(floorNum => (
            <div key={floorNum}>
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">
                  {roomsByFloor[floorNum][0]?.floor?.name || `Floor ${floorNum}`}
                </h4>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {roomsByFloor[floorNum].map((room: any) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className="relative group cursor-pointer aspect-square bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center p-6 hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
                  >
                    <div className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${room.displayStatus === 'OCCUPIED' ? 'bg-primary' : 'bg-secondary'} animate-pulse`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Room</span>
                    <h5 className="text-3xl font-black italic tracking-tighter text-slate-800">{room.number}</h5>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3 truncate max-w-full px-2">
                      {room.displayStatus === 'OCCUPIED' && room.activeBooking
                        ? room.activeBooking.guest.name
                        : (room.displayStatus || '').toLowerCase()}
                    </p>
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] flex flex-col items-center justify-center gap-3 backdrop-blur-md">
                      <span className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">settings</span>
                        Room Details
                      </span>
                      {room.displayStatus === 'OCCUPIED' && (
                        <span className="text-primary-foreground/60 text-[8px] font-black uppercase tracking-tighter px-3 py-1 bg-white/10 rounded-full">
                          Active Booking
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Management Modal — lazy-loaded, zero cost until opened */}
      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onUpdate={() => mutate()}
        />
      )}

      <div className="mt-8 flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
        <p>© 2024 Casa Hotel Management System v3.0</p>
        <div className="flex gap-8">
          <a className="hover:text-primary transition-colors" href="#">Status</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </div>
    </div>
  );
}
