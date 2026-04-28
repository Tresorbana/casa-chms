'use client';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import ConferenceBookingModal from '@/components/ConferenceBookingModal';

export default function Events() {
  const { data: venuesData, isLoading: isLoadingVenues } = useSWR('/api/conference', fetcher);
  const { data: bookingsData, isLoading: isLoadingBookings } = useSWR('/api/conference/bookings', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const venues = Array.isArray(venuesData) ? venuesData.map((v: any) => ({
    name: v.name,
    rate: `RWF ${v.pricePerHour.toLocaleString()}/hr`,
    capacity: v.capacity,
    status: 'AVAILABLE'
  })) : [];

  const schedule = Array.isArray(bookingsData) ? bookingsData.map((b: any) => ({
    title: `Booking #${b.id.substring(0, 4)}`,
    time: `${new Date(b.startTime).getHours()}:00 - ${new Date(b.endTime).getHours()}:00`,
    venue: b.conferenceRoom.name,
    color: 'primary'
  })) : [];

  return (
    <div className="flex-1 min-h-screen p-4 lg:p-8 flex flex-col gap-8" style={{ background: '#000000' }}>
      <TopBar
        title="Event Operations"
        description="Coordinate ballroom bookings, conference room availability, and logistics."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gold text-black font-black uppercase text-[10px] tracking-[0.2em] px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-gold/20 hover:bg-gold-light hover:scale-[1.05] transition-all"
          >
            <span className="material-icons-outlined text-sm">add</span>
            Book Event
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {venues.map((venue, i) => (
          <div key={i} className="bg-navy-surface rounded-[2rem] border border-gold/15 overflow-hidden shadow-2xl shadow-black/30 group hover:scale-[1.02] transition-all relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <div className={`h-1 w-full ${venue.status === 'AVAILABLE' ? 'bg-gold/40' : venue.status === 'OCCUPIED' ? 'bg-gold-light/40' : 'bg-white/10'}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase text-gold group-hover:text-gold-light transition-colors">{venue.name}</h3>
                  <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mt-1">Venue Information</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${venue.status === 'AVAILABLE' ? 'bg-gold/10 text-gold border border-gold/25' :
                  venue.status === 'OCCUPIED' ? 'bg-gold-light/10 text-gold-light border border-gold-light/25' :
                    'bg-white/5 text-white/40 border border-white/10'
                  }`}>
                  {venue.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-gold/[0.1] pt-6">
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1 text-center">Base Rate</p>
                  <p className="text-sm font-black text-center text-gold uppercase tracking-tighter">{venue.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1 text-center">Capacity</p>
                  <p className="text-sm font-black text-center text-white uppercase tracking-tighter">{venue.capacity} GUESTS</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-8 py-4 bg-white/[0.04] hover:bg-gold hover:text-black transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gold/20 hover:border-gold flex items-center justify-center gap-2 text-white/50 hover:shadow-lg hover:shadow-gold/20"
              >
                <span className="material-icons-outlined text-sm">event</span> Book Venue
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="bg-navy-surface rounded-[2rem] border border-gold/15 overflow-hidden shadow-2xl shadow-black/30 flex-1 relative">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="px-8 py-6 border-b border-gold/[0.1] bg-black/20">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gold/60">Master Event Schedule</h3>
        </div>
        <div className="p-8">
          <div className="space-y-6 relative border-l-2 border-gold/[0.1] pl-8 ml-4">
            {schedule.map((ev, i) => (
              <div key={i} className="relative group">
                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gold ring-4 ring-black shadow-sm"></div>
                <div className="bg-white/[0.03] p-6 rounded-2xl border border-gold/[0.1] group-hover:border-gold/30 group-hover:bg-gold/[0.03] group-hover:shadow-lg group-hover:shadow-gold/5 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-lg italic tracking-tighter uppercase text-gold">{ev.title}</h4>
                      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mt-1">{ev.venue}</p>
                    </div>
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.1em] bg-gold/10 px-3 py-1 rounded-full border border-gold/20">{ev.time}</span>
                  </div>
                </div>
              </div>
            ))}
            {schedule.length === 0 && (
              <div className="text-center py-10 text-white/25 italic">
                <span className="material-icons-outlined text-4xl block mb-3 opacity-30">event_note</span>
                No scheduled events
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ConferenceBookingModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
