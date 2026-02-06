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
    // Determine status based on bookings? For now default to AVAILABLE or calculate dynamically if possible. 
    // Since we don't have real-time status logic in this view yet, we'll assume available or fetch from a 'status' field if valid.
    // For this 'view', let's mock the status or derive it. 
    // Actually, let's just default to AVAILABLE unless we find a booking NOW.
    status: 'AVAILABLE'
  })) : [];

  const schedule = Array.isArray(bookingsData) ? bookingsData.map((b: any) => ({
    title: `Booking #${b.id.substring(0, 4)}`, // Or b.guestName if allowed publicly
    time: `${new Date(b.startTime).getHours()}:00 - ${new Date(b.endTime).getHours()}:00`,
    venue: b.conferenceRoom.name,
    color: 'primary'
  })) : [];

  return (
    <div className="flex-1 min-h-screen p-4 lg:p-8 flex flex-col gap-8 bg-slate-50">
      <TopBar
        title="Event Operations"
        description="Coordinate ballroom bookings, conference room availability, and logistics."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white font-black uppercase text-[10px] tracking-[0.2em] px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all"
          >
            <span className="material-icons-outlined text-sm">add</span>
            Book Event
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {venues.map((venue, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl group hover:scale-[1.02] transition-all">
            <div className={`h-3 w-full ${venue.status === 'AVAILABLE' ? 'bg-copper' : venue.status === 'OCCUPIED' ? 'bg-olive-leaf' : 'bg-slate-400'}`}></div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-olive-leaf transition-colors">{venue.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Venue Information</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${venue.status === 'AVAILABLE' ? 'bg-copper/10 text-copper' :
                  venue.status === 'OCCUPIED' ? 'bg-olive-leaf/10 text-olive-leaf' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                  {venue.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-center">Base Rate</p>
                  <p className="text-sm font-black text-center text-slate-700 uppercase tracking-tighter">{venue.rate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-center">Capacity</p>
                  <p className="text-sm font-black text-center text-slate-700 uppercase tracking-tighter">{venue.capacity} GUESTS</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-8 py-4 bg-slate-50 hover:bg-primary hover:text-white transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2 group-hover:border-primary/20"
              >
                <span className="material-icons-outlined text-sm">event</span> Book Venue
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl flex-1">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Master Event Schedule</h3>
        </div>
        <div className="p-8">
          <div className="space-y-6 relative border-l-2 border-slate-100 pl-8 ml-4">
            {schedule.map((ev, i) => (
              <div key={i} className="relative group grayscale hover:grayscale-0 transition-all">
                <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full ${ev.color === 'primary' ? 'bg-olive-leaf' : ev.color === 'secondary' ? 'bg-copper' : 'bg-blue-500'} ring-4 ring-white shadow-sm`}></div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group-hover:border-primary/30 group-hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-lg italic tracking-tighter uppercase text-slate-800">{ev.title}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{ev.venue}</p>
                    </div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.1em] bg-primary/10 px-3 py-1 rounded-full">{ev.time}</span>
                  </div>
                </div>
              </div>
            ))}
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
