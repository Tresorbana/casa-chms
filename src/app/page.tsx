'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import { AnimatedStatsCard } from '@/components/ui/animated-dashboard-card';

const RoomDetailsModal = dynamic(() => import('@/components/RoomDetailsModal'), { ssr: false });

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard?date=${selectedDate}`,
    fetcher
  );

  const stats = data?.stats ?? {};
  const rooms: any[] = data?.rooms ?? [];

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
    <div className="p-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gold/40">
      Loading System Data...
    </div>
  );
  if (error) return (
    <div className="p-8 text-center text-red-400 font-black">Connection Failure</div>
  );

  const revenueToday = stats.revenueToday ?? 0;
  const estimatedServices = Math.round(revenueToday * 0.28);
  const roomRevenue = revenueToday - estimatedServices;

  return (
    <div className="min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
      <TopBar
        title="Management Dashboard"
        description="Real-time hotel occupancy and revenue status."
        actions={
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-gold transition-colors">
                <span className="material-icons-outlined text-sm">calendar_today</span>
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto bg-navy-surface border border-gold/20 rounded-2xl pl-12 pr-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 shadow-sm hover:border-gold/35 transition-all cursor-pointer"
              />
            </div>
            <Link
              href="/bookings"
              className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-8 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-gold/20 hover:bg-gold-light hover:scale-[1.05] transition-all"
            >
              <span className="material-icons-outlined text-sm">add</span>
              New Reservation
            </Link>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-navy-surface p-8 rounded-[2rem] border border-gold/15 shadow-xl shadow-black/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold/60 to-transparent" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gold/10 text-gold rounded-2xl ring-1 ring-gold/20">
              <span className="material-icons-outlined text-2xl">bed</span>
            </div>
          </div>
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Target Occupancy</h3>
          <p className="text-4xl font-black italic tracking-tighter uppercase text-white">{(stats.occupancyRate || 0).toFixed(1)}%</p>
          <div className="w-full bg-white/[0.06] h-1.5 mt-6 rounded-full overflow-hidden">
            <div className="bg-gold h-full rounded-full transition-all duration-1000" style={{ width: `${stats.occupancyRate || 0}%` }} />
          </div>
        </div>

        <div className="bg-navy-surface p-8 rounded-[2rem] border border-gold/15 shadow-xl shadow-black/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold/60 to-transparent" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gold/10 text-gold rounded-2xl ring-1 ring-gold/20">
              <span className="material-icons-outlined text-2xl">payments</span>
            </div>
          </div>
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Revenue Performance</h3>
          <p className="text-3xl font-black italic tracking-tighter uppercase text-white">RWF {(stats.revenueToday || 0).toLocaleString()}</p>
        </div>

        <div className="bg-navy-surface p-8 rounded-[2rem] border border-gold/15 shadow-xl shadow-black/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gold/60 to-transparent" />
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-gold/10 text-gold rounded-2xl ring-1 ring-gold/20">
              <span className="material-icons-outlined text-2xl">pending_actions</span>
            </div>
          </div>
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Bookings</h3>
          <p className="text-4xl font-black italic tracking-tighter uppercase text-white">{stats.pendingReservations || 0}</p>
        </div>
      </div>

      {/* Revenue Overview + Room Grid — two-column on desktop */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Animated Revenue Card */}
        <div className="xl:w-72 flex-shrink-0">
          <AnimatedStatsCard
            title="Revenue Overview"
            primaryLabel="Room Revenue"
            secondaryLabel="F&B / Services"
            primaryValue={roomRevenue}
            secondaryValue={estimatedServices}
            primaryTrend="+15.2%"
            secondaryTrend="+8.7%"
            currencyPrefix="RWF"
            onMoreDetails={() => router.push('/reports')}
          />
        </div>

        {/* Room Grid */}
        <section className="flex-1 bg-navy-surface p-6 md:p-8 rounded-3xl border border-gold/15 shadow-2xl shadow-black/40 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase text-gold leading-none mb-1">Room Status Grid</h3>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                Live status for {new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[{ label: 'Available', color: 'bg-gold' }, { label: 'Occupied', color: 'bg-gold-light' }].map(status => (
                <div key={status.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <span className={`w-3 h-3 rounded-full ${status.color} opacity-80`} /> {status.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {sortedFloors.length === 0 ? (
              <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] text-white/25">
                No rooms found.
              </div>
            ) : sortedFloors.map(floorNum => (
              <div key={floorNum}>
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-lg font-black italic tracking-tighter text-gold uppercase">
                    {roomsByFloor[floorNum][0]?.floor?.name || `Floor ${floorNum}`}
                  </h4>
                  <div className="h-px flex-1 bg-gold/[0.12]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                  {roomsByFloor[floorNum].map((room: any) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className="relative group cursor-pointer aspect-square bg-black rounded-[1.5rem] border border-gold/[0.12] flex flex-col items-center justify-center p-3 hover:shadow-xl hover:shadow-gold/10 hover:border-gold/30 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                    >
                      <div className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${room.displayStatus === 'OCCUPIED' ? 'bg-gold' : 'bg-gold-light'} animate-pulse`} />
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Room</span>
                      <h5 className="text-2xl font-black italic tracking-tighter text-gold">{room.number}</h5>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1 truncate max-w-full px-2 text-center">
                        {room.displayStatus === 'OCCUPIED' && room.activeBooking
                          ? room.activeBooking.guest.name
                          : (room.displayStatus || '').toLowerCase()}
                      </p>
                      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-[1.5rem] flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                        <span className="text-gold font-black uppercase text-[9px] tracking-widest flex items-center gap-1.5">
                          <span className="material-icons-outlined text-sm">settings</span>
                          Details
                        </span>
                        {room.displayStatus === 'OCCUPIED' && (
                          <span className="text-gold/50 text-[8px] font-black uppercase tracking-tighter px-2 py-1 bg-gold/10 rounded-full border border-gold/20">
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
      </div>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onUpdate={() => mutate()}
        />
      )}

      <div className="mt-4 flex justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-widest">
        <p>© 2024 Casa Hotel Management System v3.0</p>
        <div className="flex gap-8">
          <a className="hover:text-gold/60 transition-colors" href="#">Status</a>
          <a className="hover:text-gold/60 transition-colors" href="#">Support</a>
        </div>
      </div>
    </div>
  );
}
