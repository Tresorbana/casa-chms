'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import ConferenceBookingModal from '@/components/ConferenceBookingModal';

export default function Events() {
  const { data: venuesData, isLoading: isLoadingVenues } = useSWR('/api/conference', fetcher, {
    onError: () => toast.error('Failed to load venues'),
  });
  const { data: bookingsData } = useSWR('/api/conference/bookings', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const venues = Array.isArray(venuesData) ? venuesData : [];
  const schedule = Array.isArray(bookingsData) ? bookingsData : [];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Events"
        description="Conference rooms, bookings, and event schedule."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Book Event
          </button>
        }
      />

      {/* Venue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingVenues ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse h-40" />
          ))
        ) : venues.map((venue: any, i: number) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{venue.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Conference venue</p>
                </div>
                <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Daily rate</p>
                  <p className="text-sm font-medium text-foreground">
                    RWF {(venue.pricePerDay ?? 0).toLocaleString()}/day
                  </p>
                  <p className="text-[10px] text-muted-foreground">RWF {venue.pricePerHour?.toLocaleString()}/hr</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">Capacity</p>
                  <p className="text-sm font-medium text-foreground">{venue.capacity} guests</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">event</span>
                Book Venue
              </button>
            </div>
          </div>
        ))}
        {!isLoadingVenues && venues.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">meeting_room</span>
            <p className="text-sm">No conference rooms configured</p>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Event Schedule</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Upcoming and active bookings</p>
        </div>
        <div className="p-6">
          {schedule.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">event_note</span>
              <p className="text-sm">No scheduled events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((b: any) => (
                <div key={b.id} className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border border-border">
                  <div className="p-2 bg-background border border-border rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">event</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.conferenceRoom?.name}
                      {b.bookingType === 'DAILY' ? ' · Full day' : ' · Hourly'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-foreground">
                      {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –{' '}
                      {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{new Date(b.startTime).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConferenceBookingModal onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); window.location.reload(); }} />
      )}
    </div>
  );
}
