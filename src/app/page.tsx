'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { toast } from 'sonner';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import { HOTEL_INFO } from '@/lib/hotel-info';

const RoomDetailsModal = dynamic(() => import('@/components/RoomDetailsModal'), { ssr: false });

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  OCCUPIED:    { label: 'Occupied',    dot: 'bg-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  AVAILABLE:   { label: 'Available',   dot: 'bg-emerald-500',bg: 'bg-emerald-50',text: 'text-emerald-700' },
  MAINTENANCE: { label: 'Maintenance', dot: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700' },
  CHECKOUT:    { label: 'Checkout',    dot: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
};

function StatCard({
  icon, label, value, sub,
}: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-muted rounded-lg">
          <span className="material-symbols-outlined text-foreground/70 text-[22px]">{icon}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/dashboard?date=${selectedDate}`,
    fetcher,
    {
      onError: () => toast.error('Failed to load dashboard data'),
    }
  );

  const stats = data?.stats ?? {};
  const rooms: any[] = data?.rooms ?? [];
  const role: string = data?.role ?? 'STAFF';
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
  const isFinance = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isReception = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'].includes(role);
  const isRestaurant = ['WAITER', 'BARMAN', 'ADMIN', 'SUPER_ADMIN'].includes(role);

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

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
          <p className="text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-destructive">
          <span className="material-symbols-outlined text-4xl">error_outline</span>
          <p className="text-sm font-medium">Failed to load dashboard</p>
          <button
            onClick={() => mutate()}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const revenueToday = stats.revenueToday ?? 0;
  const restaurantRevenueToday = stats.restaurantRevenueToday ?? 0;
  const checkinsToday = stats.checkinsToday ?? 0;
  const checkoutsToday = stats.checkoutsToday ?? 0;
  const eventsToday = stats.eventsToday ?? 0;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Dashboard"
        description="Real-time hotel occupancy and revenue overview."
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">
                calendar_today
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer"
              />
            </div>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Reservation
            </Link>
          </div>
        }
      />

      {/* Stat Cards — role-based */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-element">
        {isReception && (
          <StatCard
            icon="bed"
            label="Occupancy Rate"
            value={`${(stats.occupancyRate || 0).toFixed(1)}%`}
            sub={`${rooms.filter((r: any) => r.displayStatus === 'OCCUPIED').length} of ${rooms.length} rooms`}
          />
        )}
        {isReception && (
          <StatCard
            icon="login"
            label="Check-ins Today"
            value={String(checkinsToday)}
            sub="Expected arrivals"
          />
        )}
        {isReception && (
          <StatCard
            icon="logout"
            label="Check-outs Today"
            value={String(checkoutsToday)}
            sub="Due departures"
          />
        )}
        {isReception && (
          <StatCard
            icon="event"
            label="Events Today"
            value={String(eventsToday)}
            sub="Confirmed & active"
          />
        )}
        {isFinance && (
          <StatCard
            icon="payments"
            label="Revenue Today"
            value={`RWF ${revenueToday.toLocaleString()}`}
            sub="Paid invoices"
          />
        )}
        {isFinance && (
          <StatCard
            icon="restaurant"
            label="Restaurant Today"
            value={`RWF ${restaurantRevenueToday.toLocaleString()}`}
            sub="F&B invoices"
          />
        )}
        {isRestaurant && !isFinance && !isReception && (
          <StatCard
            icon="restaurant"
            label="Restaurant Revenue"
            value={`RWF ${restaurantRevenueToday.toLocaleString()}`}
            sub="Today's F&B"
          />
        )}
        {isRestaurant && !isFinance && !isReception && (
          <StatCard
            icon="receipt_long"
            label="POS Activity"
            value="Active"
            sub="Restaurant & Bar open"
          />
        )}
        {!isReception && !isFinance && !isRestaurant && (
          <StatCard
            icon="hotel"
            label={HOTEL_INFO.name}
            value="Online"
            sub="System operational"
          />
        )}
      </div>

      {/* Finance revenue split — only finance/admin */}
      {isFinance && revenueToday > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 animate-element animate-delay-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue Today</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Paid invoices breakdown</p>
            </div>
            <button
              onClick={() => router.push('/reports')}
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Full report
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          <div className="flex gap-6 mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Room Revenue</p>
              <p className="text-lg font-bold text-foreground">RWF {(revenueToday - restaurantRevenueToday).toLocaleString()}</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Restaurant & Bar</p>
              <p className="text-lg font-bold text-foreground">RWF {restaurantRevenueToday.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: revenueToday > 0 ? `${((revenueToday - restaurantRevenueToday) / revenueToday) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}

      {/* Room Status Grid — reception / admin only */}
      {(isReception || isAdmin) && <section className="bg-card border border-border rounded-xl p-6 animate-element animate-delay-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">Room Status Grid</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_CONFIG).map(([, cfg]) => (
              <div key={cfg.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {sortedFloors.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              <span className="material-symbols-outlined block text-3xl mb-2 opacity-40">hotel</span>
              No rooms found
            </div>
          ) : (
            sortedFloors.map(floorNum => (
              <div key={floorNum}>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    {roomsByFloor[floorNum][0]?.floor?.name || `Category ${floorNum}`}
                  </h4>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] text-muted-foreground">
                    {roomsByFloor[floorNum].length} rooms
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                  {roomsByFloor[floorNum].map((room: any) => {
                    const cfg = STATUS_CONFIG[room.displayStatus] ?? STATUS_CONFIG['AVAILABLE'];
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`group relative aspect-square rounded-xl border border-border flex flex-col items-center justify-center p-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer ${cfg.bg}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dot} mb-1.5`} />
                        <p className="text-sm font-bold text-foreground">{room.number}</p>
                        <p className={`text-[9px] font-medium uppercase tracking-wide mt-0.5 ${cfg.text}`}>
                          {room.displayStatus === 'OCCUPIED' && room.activeBooking
                            ? room.activeBooking.guest.name.split(' ')[0]
                            : cfg.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>}

      {/* Restaurant shortcut for barman/waiter */}
      {isRestaurant && !isReception && !isAdmin && (
        <div className="bg-card border border-border rounded-xl p-6 animate-element animate-delay-100">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/pos/restaurant')}
              className="flex flex-col items-center gap-3 p-6 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-primary text-4xl">restaurant</span>
              <span className="text-sm font-medium text-foreground">Open POS</span>
            </button>
            <button
              onClick={() => router.push('/inventory')}
              className="flex flex-col items-center gap-3 p-6 bg-muted border border-border rounded-xl hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-muted-foreground text-4xl">inventory_2</span>
              <span className="text-sm font-medium text-foreground">Stock</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-2 border-t border-border">
        <p>© 2026 {HOTEL_INFO.name}</p>
        <div className="flex gap-6">
          <a className="hover:text-foreground transition-colors" href="#">Status</a>
          <a className="hover:text-foreground transition-colors" href="#">Support</a>
        </div>
      </div>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onUpdate={() => mutate()}
        />
      )}
    </div>
  );
}
