'use client';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import { countries } from '@/lib/countries';

export default function Bookings() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    idNumber: '',
    nationality: '',
    address: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    roomNumber: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.name,
          guestEmail: formData.email,
          guestPhone: formData.phone,
          roomNumber: formData.roomNumber,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          nationality: formData.nationality,
          totalAmount: 0 // In a real app, calculate based on room price and duration
        })
      });

      if (res.ok) {
        alert('Booking created successfully!');
        router.push('/');
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      alert('Failed to submit booking');
    }
  };

  return (
    <div className="flex-1 min-h-screen relative">
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .lg\\:ml-64 { margin-left: 0 !important; }
          main { margin-left: 0 !important; padding: 20px !important; }
          aside, nav, footer, button, .relative.no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .grid { display: block !important; }
          .bg-white, .bg-slate-900 { background: white !important; border-color: #eee !important; color: black !important; border: 1px solid #eee !important; shadow: none !important; }
          .dark\\:text-white { color: black !important; }
        }
      `}</style>


      <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <TopBar
          title="Guest Registration & Booking"
          description="Complete the guest profile and select reservation preferences to secure a booking."
        />
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-secondary font-semibold">
                  <span className="material-icons">person_add</span>
                  <h2>New Guest Registration</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                      <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="e.g. John Doe" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="+1 (555) 000-0000" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                      <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="john.doe@example.com" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">ID / Passport Number</label>
                      <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="A12345678" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nationality</label>
                      <select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" name="nationality" value={formData.nationality} onChange={handleChange}>
                        <option value="">Select a country</option>
                        {countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Permanent Address</label>
                      <textarea className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="Street, City, Postcode, Country" rows={3} name="address" value={formData.address} onChange={handleChange}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-primary font-semibold">
                  <span className="material-icons">event</span>
                  <h2>Reservation Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Check-in Date</label>
                        <div className="relative">
                          <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all pl-10 pr-4 py-2" type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
                          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Check-out Date</label>
                        <div className="relative">
                          <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all pl-10 pr-4 py-2" type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
                          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Room Type</label>
                      <select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" name="roomType" value={formData.roomType} onChange={handleChange}>
                        <option value="">Select Room Category</option>
                        <option value="standard">Standard Single (RWF 45,000/night)</option>
                        <option value="double">Deluxe Double (RWF 75,000/night)</option>
                        <option value="suite">Executive Suite (RWF 120,000/night)</option>
                        <option value="family">Family Room (RWF 150,000/night)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Room Number</label>
                      <input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="e.g. 101" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Special Requests</label>
                      <textarea className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all px-4 py-2" placeholder="e.g. Late check-in, dietary requirements, airport pick-up..." rows={4} name="specialRequests" value={formData.specialRequests} onChange={handleChange}></textarea>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Estimated Total</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">RWF 0</span>
                      </div>
                      <button className="w-full bg-primary hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2" type="submit">
                        <span className="material-icons">bookmark_add</span>
                        Book Room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3">
                <span className="material-icons text-amber-500">info</span>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-bold">Pro Tip:</span> Guests with corporate accounts receive a 10% discount automatically upon email verification.
                </p>
              </div>
            </div>
          </div>
        </form>
        <footer className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm pb-8">
          <p>© 2024 Casa Hotel. All rights reserved. Powered by Casa Hotel Management System v2.4</p>
        </footer>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => { }) }}>
          <span className="material-icons-outlined text-2xl">add</span>
        </button>
      </div>

    </div>
  );
}
