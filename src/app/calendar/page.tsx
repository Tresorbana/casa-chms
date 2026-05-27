'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import DayBookingsModal from '@/components/DayBookingsModal';
import ConferenceBookingModal from '@/components/ConferenceBookingModal';

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function OccupancyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConferenceModalOpen, setIsConferenceModalOpen] = useState(false);

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

  const { data: reportData, isLoading } = useSWR(
    `/api/reports?start=${startOfMonth}&end=${endOfMonth}`,
    fetcher,
    { onError: () => toast.error('Failed to load calendar data') }
  );

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const bookings = reportData?.records || [];

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[90px] bg-muted/30 border border-border" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    const isToday = d === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

    const activeBookings = bookings.filter((b: any) => {
      const ci = new Date(b.checkIn);
      const co = new Date(b.checkOut);
      return dateObj >= new Date(ci.setHours(0,0,0,0)) && dateObj <= new Date(co.setHours(0,0,0,0));
    });

    days.push(
      <div
        key={d}
        onClick={() => { setSelectedDate(dateObj); setSelectedBookings(activeBookings); setIsModalOpen(true); }}
        className={`min-h-[90px] p-2 border flex flex-col gap-1 transition-all hover:bg-accent cursor-pointer ${
          isToday ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/30 ring-inset' : 'bg-background border-border'
        }`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground/60'}`}>{d}</span>
          {activeBookings.length > 2 && (
            <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">+{activeBookings.length - 2}</span>
          )}
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden">
          {activeBookings.slice(0, 2).map((b: any) => (
            <div
              key={b.id}
              className={`text-[10px] px-1.5 py-0.5 rounded truncate border-l-2 ${
                b.type === 'CONFERENCE'
                  ? 'bg-purple-50 border-purple-400 text-purple-700'
                  : 'bg-blue-50 border-blue-400 text-blue-700'
              }`}
            >
              {b.type !== 'CONFERENCE' && <span className="opacity-60 mr-1">#{b.roomNumber}</span>}
              {b.guestName}
            </div>
          ))}
          {activeBookings.length === 0 && (
            <span className="text-[10px] text-muted-foreground/40 mt-1">Free</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Occupancy Calendar"
        description="Monthly view of room stays and availability."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConferenceModalOpen(true)}
              className="inline-flex items-center gap-2 border border-border bg-background text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">event</span>
              Book Event
            </button>
            <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
              <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))} className="p-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="px-4 text-sm font-medium text-foreground min-w-[150px] text-center">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <button onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))} className="p-2 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-muted-foreground text-sm">Loading calendar...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 border-b border-border bg-muted/50">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                <div key={day} className="py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">{days}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className="p-2 bg-muted rounded-lg">
            <span className="material-symbols-outlined text-foreground/60 text-[22px]">event_available</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Bookings</p>
            <p className="text-2xl font-semibold text-foreground">{bookings.length}</p>
          </div>
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <DayBookingsModal date={selectedDate} bookings={selectedBookings} onClose={() => setIsModalOpen(false)} />
      )}
      {isConferenceModalOpen && (
        <ConferenceBookingModal onClose={() => setIsConferenceModalOpen(false)} onSuccess={() => window.location.reload()} />
      )}
    </div>
  );
}
