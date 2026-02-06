'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import { countries } from '@/lib/countries';

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomNumberParam = searchParams.get('roomNumber');

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
    roomNumber: roomNumberParam || '',
    adults: 1,
    children: 0,
    specialRequests: ''
  });

  const [estimatedTotal, setEstimatedTotal] = useState(0);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.roomType) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      const rates: any = {
        standard: 45000,
        double: 75000,
        suite: 120000,
        family: 150000
      };

      if (days > 0) {
        setEstimatedTotal(days * (rates[formData.roomType] || 0));
      } else {
        setEstimatedTotal(0);
      }
    }
  }, [formData.checkIn, formData.checkOut, formData.roomType]);

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
          totalAmount: estimatedTotal
        })
      });

      if (res.ok) {
        alert('Booking created successfully! Command updated.');
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
    <div className="flex-1 min-h-screen relative bg-slate-50 p-4 lg:p-8">
      <TopBar
        title="Bookings & Assignment"
        description="Manage guest bookings and room assignments."
      />

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter uppercase">Guest Entity Profile</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric & Contact Matrix</p>
                </div>
                <span className="material-icons-outlined text-primary">person_add</span>
              </div>
              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. John Doe" type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal Number</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="+1 (555) 000-0000" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Electronic Mail</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="john.doe@example.com" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Certificate</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="A12345678" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality Origin</label>
                    <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" name="nationality" value={formData.nationality} onChange={handleChange}>
                      <option value="">Select Origin...</option>
                      {countries.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter uppercase">Allocation Specs</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal & Spatial Parameters</p>
                </div>
                <span className="material-icons-outlined text-primary">event</span>
              </div>
              <div className="p-6 md:p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Cycle</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Cycle</label>
                    <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Type</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" name="roomType" value={formData.roomType} onChange={handleChange} required>
                    <option value="">Select Category...</option>
                    <option value="standard">Standard Single (RWF 45,000/night)</option>
                    <option value="double">Deluxe Double (RWF 75,000/night)</option>
                    <option value="suite">Executive Suite (RWF 120,000/night)</option>
                    <option value="family">Family Room (RWF 150,000/night)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Number</label>
                  <input className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 101" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Yield</span>
                    <span className="text-2xl font-black text-slate-800 italic tracking-tighter">RWF {estimatedTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all transform hover:scale-[1.02]" type="submit">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function Bookings() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Initializing Registration Matrix...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
