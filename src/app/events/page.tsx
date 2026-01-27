'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Events() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<div className="flex h-screen overflow-hidden">
{/* Sidebar Navigation */}
{/* Main Content Area */}
<main className="flex-1 flex flex-col overflow-hidden ml-64 min-h-screen">
{/* Top Navigation Bar */}
<header className="flex items-center justify-between px-8 py-4 bg-[#111418] border-b border-[#283039]">
<div className="flex items-center gap-6 flex-1">
<div className="flex flex-col">
<div className="flex items-center gap-2 mb-1">
<a className="text-[#9dabb9] text-xs font-medium hover:text-white" href="#">Management</a>
<span className="text-[#9dabb9] text-xs">/</span>
<span className="text-white text-xs font-medium">Conference Rooms</span>
</div>
<h2 className="text-white text-xl font-bold">Conference Scheduling</h2>
</div>
<div className="max-w-md w-full ml-4">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9]">search</span>
<input className="w-full bg-[#283039] border-none rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary placeholder:text-[#9dabb9]" placeholder="Search bookings, clients or rooms..."/>
</div>
</div>
</div>
<div className="flex items-center gap-4">
<button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
                    Add Booking
                </button>
<div className="flex items-center gap-2 border-l border-[#283039] pl-4">
<button className="p-2 text-[#9dabb9] hover:text-white bg-[#283039] rounded-lg">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="flex items-center gap-2 p-1.5 pr-3 text-[#9dabb9] hover:text-white bg-[#283039] rounded-lg">
<div className="w-7 h-7 rounded-full bg-cover bg-center" data-alt="User profile avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBm7ucyrtykI4Lf5Zzzdo7bdmaEYkEQ9kVi7zqd0xBUlRVxWOnWcSbjZPNuDHnw7Wh1RyI0jY4k2z5_A60zdEaRyb0XR91_LviVPKEh3M4WH6wFO4Ugtne0-6svC0V0QFO02hV2JR7dN7sq-XETe411BSgG5gOoSIrW_0PBDcG89l8JlrGTNrU33fuXfMyWJaAvD4aCOaoxy21CDB6k27jrtk0MmbB59LzTZnElwWQMxWMJKsQEbl1aqNiYLKti275tmJbDFqqHHGc')" }}></div>
<span className="text-sm font-medium">Alex Chen</span>
</button>
</div>
</div>
</header>
{/* Dashboard Content */}
<div className="flex-1 overflow-y-auto p-8 space-y-8">
{/* Room Setup Section */}
<section>
<div className="flex items-center justify-between mb-4">
<h3 className="text-lg font-bold">Room Setup &amp; Status</h3>
<button className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined text-[18px]">edit_square</span>
                        Manage Rooms
                    </button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
{/* Room Card 1 */}
<div className="bg-[#111418] border border-[#283039] rounded-xl p-4 flex flex-col gap-3">
<div className="flex justify-between items-start">
<div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Available</div>
<span className="text-[#9dabb9] font-medium text-sm">$200/hr</span>
</div>
<div>
<h4 className="font-bold text-white">Executive Boardroom</h4>
<p className="text-xs text-[#9dabb9] flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[14px]">groups</span> 12 Pax capacity
                            </p>
</div>
<div className="mt-2 flex gap-2">
<div className="h-1 flex-1 bg-green-500 rounded-full"></div>
<div className="h-1 flex-1 bg-[#283039] rounded-full"></div>
</div>
</div>
{/* Room Card 2 */}
<div className="bg-[#111418] border border-[#283039] rounded-xl p-4 flex flex-col gap-3">
<div className="flex justify-between items-start">
<div className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase">Occupied</div>
<span className="text-[#9dabb9] font-medium text-sm">$1,500/day</span>
</div>
<div>
<h4 className="font-bold text-white">Grand Ballroom</h4>
<p className="text-xs text-[#9dabb9] flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[14px]">groups</span> 250 Pax capacity
                            </p>
</div>
<div className="mt-2 flex gap-2">
<div className="h-1 flex-1 bg-primary rounded-full"></div>
<div className="h-1 flex-1 bg-primary rounded-full"></div>
</div>
</div>
{/* Room Card 3 */}
<div className="bg-[#111418] border border-[#283039] rounded-xl p-4 flex flex-col gap-3">
<div className="flex justify-between items-start">
<div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Available</div>
<span className="text-[#9dabb9] font-medium text-sm">$80/hr</span>
</div>
<div>
<h4 className="font-bold text-white">Focus Pod A</h4>
<p className="text-xs text-[#9dabb9] flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[14px]">groups</span> 4 Pax capacity
                            </p>
</div>
<div className="mt-2 flex gap-2">
<div className="h-1 flex-1 bg-green-500 rounded-full"></div>
<div className="h-1 flex-1 bg-[#283039] rounded-full"></div>
</div>
</div>
{/* Room Card 4 */}
<div className="bg-[#111418] border border-[#283039] rounded-xl p-4 flex flex-col gap-3">
<div className="flex justify-between items-start">
<div className="bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Maintenance</div>
<span className="text-[#9dabb9] font-medium text-sm">$120/hr</span>
</div>
<div>
<h4 className="font-bold text-white">Creative Studio</h4>
<p className="text-xs text-[#9dabb9] flex items-center gap-1 mt-1">
<span className="material-symbols-outlined text-[14px]">groups</span> 20 Pax capacity
                            </p>
</div>
<div className="mt-2 flex gap-2">
<div className="h-1 flex-1 bg-orange-500 rounded-full"></div>
<div className="h-1 flex-1 bg-[#283039] rounded-full"></div>
</div>
</div>
</div>
</section>
{/* Calendar Section */}
<section className="flex-1 flex flex-col">
<div className="bg-[#111418] border border-[#283039] rounded-xl overflow-hidden flex flex-col">
{/* Calendar Header */}
<div className="p-4 border-b border-[#283039] flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="flex items-center bg-[#283039] rounded-lg p-1">
<button className="px-3 py-1.5 text-xs font-bold rounded-md transition-all hover:bg-[#3b4754]">Day</button>
<button className="px-3 py-1.5 text-xs font-bold rounded-md bg-white text-black transition-all">Week</button>
<button className="px-3 py-1.5 text-xs font-bold rounded-md transition-all hover:bg-[#3b4754]">Month</button>
</div>
<div className="flex items-center gap-2">
<button className="p-1 hover:bg-[#283039] rounded"><span className="material-symbols-outlined">chevron_left</span></button>
<span className="text-sm font-bold">Oct 23 - Oct 29, 2023</span>
<button className="p-1 hover:bg-[#283039] rounded"><span className="material-symbols-outlined">chevron_right</span></button>
</div>
</div>
<div className="flex items-center gap-2">
<select className="bg-[#283039] border-none text-xs rounded-lg py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary">
<option>All Rooms</option>
<option>Executive Boardroom</option>
<option>Grand Ballroom</option>
</select>
<button className="bg-[#283039] p-2 rounded-lg text-[#9dabb9] hover:text-white">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
</button>
</div>
</div>
{/* Calendar Body (Weekly View Mockup) */}
<div className="overflow-x-auto">
<div className="min-w-[1000px]">
{/* Day Labels */}
<div className="calendar-grid border-b border-[#283039] bg-[#1a1e24]">
<div className="p-3"></div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Mon</p>
<p className="text-lg font-black">23</p>
</div>
<div className="p-3 text-center border-l border-[#283039] bg-primary/5">
<p className="text-[10px] text-primary font-bold uppercase">Tue</p>
<p className="text-lg font-black text-primary">24</p>
</div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Wed</p>
<p className="text-lg font-black">25</p>
</div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Thu</p>
<p className="text-lg font-black">26</p>
</div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Fri</p>
<p className="text-lg font-black">27</p>
</div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Sat</p>
<p className="text-lg font-black">28</p>
</div>
<div className="p-3 text-center border-l border-[#283039]">
<p className="text-[10px] text-[#9dabb9] font-bold uppercase">Sun</p>
<p className="text-lg font-black">29</p>
</div>
</div>
{/* Time Rows */}
<div className="relative">
{/* Example Time Grid */}
<div className="calendar-grid">
<div className="p-2 text-right text-[10px] text-[#9dabb9] font-bold">08:00 AM</div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l bg-primary/5"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
</div>
<div className="calendar-grid">
<div className="p-2 text-right text-[10px] text-[#9dabb9] font-bold">09:00 AM</div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l bg-primary/5"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
</div>
<div className="calendar-grid">
<div className="p-2 text-right text-[10px] text-[#9dabb9] font-bold">10:00 AM</div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l bg-primary/5"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
</div>
<div className="calendar-grid">
<div className="p-2 text-right text-[10px] text-[#9dabb9] font-bold">11:00 AM</div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l bg-primary/5"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
<div className="time-slot border-l"></div>
</div>
{/* Absolute Positioned Bookings */}
{/* Booking 1 */}
<div className="absolute top-[65px] left-[calc(80px+131px*0)] w-[128px] h-[110px] bg-primary rounded-lg p-2 shadow-lg z-10 border-l-4 border-white/30">
<p className="text-[10px] font-bold text-white/80 uppercase">09:00 - 11:00</p>
<p className="text-xs font-black truncate">Meta Summit</p>
<p className="text-[9px] text-white/70 italic mt-1">Grand Ballroom</p>
</div>
{/* Booking 2 */}
<div className="absolute top-[125px] left-[calc(80px+131px*2)] w-[128px] h-[80px] bg-orange-500 rounded-lg p-2 shadow-lg z-10 border-l-4 border-white/30">
<p className="text-[10px] font-bold text-white/80 uppercase">10:00 - 11:30</p>
<p className="text-xs font-black truncate">Legal Sync</p>
<p className="text-[9px] text-white/70 italic mt-1">Executive Pod</p>
</div>
{/* Booking 3 (Today/Active) */}
<div className="absolute top-[85px] left-[calc(80px+131px*1)] w-[128px] h-[150px] bg-white text-background-dark rounded-lg p-2 shadow-xl z-20 border-l-4 border-primary">
<div className="flex items-center justify-between mb-1">
<p className="text-[10px] font-bold text-primary uppercase">Current</p>
<div className="size-1.5 rounded-full bg-red-500 animate-pulse"></div>
</div>
<p className="text-xs font-black leading-tight">Alpha Corp Annual Meeting</p>
<p className="text-[9px] text-[#4a5568] mt-1">09:30 - 12:30</p>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
{/* Slide-over Add Booking Panel (Simulated Overlay) */}
<div className="fixed inset-y-0 right-0 w-96 bg-[#111418] border-l border-[#283039] shadow-2xl z-50 transform translate-x-full transition-transform duration-300">
{/* In a real scenario, this would be toggled by JS. Shown for UI layout context. */}
<div className="p-6 flex flex-col h-full">
<div className="flex items-center justify-between mb-8">
<h2 className="text-xl font-bold">New Booking</h2>
<button className="p-1 hover:bg-[#283039] rounded text-[#9dabb9]">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<form className="space-y-6">
<div>
<label className="block text-xs font-bold text-[#9dabb9] uppercase mb-2">Client Name</label>
<input className="w-full bg-[#283039] border-none rounded-lg p-3 text-sm focus:ring-primary" placeholder="Enter company or person name" type="text"/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold text-[#9dabb9] uppercase mb-2">Select Room</label>
<select className="w-full bg-[#283039] border-none rounded-lg p-3 text-sm focus:ring-primary">
<option>Grand Ballroom</option>
<option>Executive Boardroom</option>
</select>
</div>
        <div>
          <label className="block text-xs font-bold text-[#9dabb9] uppercase mb-2">Pax</label>
          <input className="w-full bg-[#283039] border-none rounded-lg p-3 text-sm focus:ring-primary" type="number" defaultValue={10}/>
        </div>
</div>
<div className="space-y-4">
<label className="block text-xs font-bold text-[#9dabb9] uppercase">Schedule</label>
<div className="bg-[#1a1e24] p-4 rounded-xl border border-[#283039]">
<div className="flex items-center gap-3 mb-3">
<span className="material-symbols-outlined text-primary">event</span>
<span className="text-sm font-medium">October 24, 2023</span>
</div>
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary">schedule</span>
<span className="text-sm font-medium">09:00 AM - 12:00 PM</span>
</div>
</div>
</div>
{/* Conflict Warning (Interactive description requirement) */}
<div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex gap-3">
<span className="material-symbols-outlined text-red-500">warning</span>
<div>
<p className="text-xs font-bold text-red-500">Conflict Detected</p>
<p className="text-[10px] text-red-400">Grand Ballroom is booked by "Alpha Corp" from 09:30 AM.</p>
</div>
</div>
<div className="mt-auto pt-6 border-t border-[#283039]">
<button className="w-full bg-[#283039] text-[#9dabb9] font-bold py-3 rounded-xl cursor-not-allowed opacity-50" disabled={true}>
                        Check Availability
                    </button>
<p className="text-center text-[10px] text-[#9dabb9] mt-3">All bookings are subject to facility terms and conditions.</p>
</div>
</form>
</div>
</div>
</div>

    </div>
  );
}
