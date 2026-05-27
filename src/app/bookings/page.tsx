'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import { countries } from '@/lib/countries';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-all";
const labelClass = "text-xs font-medium text-muted-foreground";

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomNumberParam = searchParams.get('roomNumber');

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', idNumber: '', nationality: '',
    address: '', checkIn: '', checkOut: '', roomType: '',
    roomNumber: roomNumberParam || '', adults: 1, children: 0, specialRequests: ''
  });
  const [estimatedTotal, setEstimatedTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.roomType) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const rates: any = { standard: 45000, double: 75000, suite: 120000, family: 150000 };
      setEstimatedTotal(days > 0 ? days * (rates[formData.roomType] || 0) : 0);
    }
  }, [formData.checkIn, formData.checkOut, formData.roomType]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.name, guestEmail: formData.email,
          guestPhone: formData.phone, roomNumber: formData.roomNumber,
          checkIn: formData.checkIn, checkOut: formData.checkOut,
          nationality: formData.nationality, totalAmount: estimatedTotal
        })
      });
      if (res.ok) {
        toast.success('Booking created successfully');
        router.push('/');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create booking');
      }
    } catch {
      toast.error('Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <TopBar title="Guest Registration" description="Create a new booking and assign a room." />

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Guest Profile */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground text-[20px]">person_add</span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Guest Information</h2>
                  <p className="text-xs text-muted-foreground">Contact and identity details</p>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="John Doe" type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Phone Number</label>
                    <input className={inputClass} placeholder="+250 788 000 000" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Email Address</label>
                    <input className={inputClass} placeholder="guest@example.com" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>ID / Passport Number</label>
                    <input className={inputClass} placeholder="A12345678" type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={labelClass}>Nationality</label>
                    <select className={inputClass} name="nationality" value={formData.nationality} onChange={handleChange}>
                      <option value="">Select country...</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center gap-3">
                <span className="material-symbols-outlined text-muted-foreground text-[20px]">event</span>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Booking Details</h2>
                  <p className="text-xs text-muted-foreground">Dates and room assignment</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={labelClass}>Check In</label>
                    <input className={inputClass} type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>Check Out</label>
                    <input className={inputClass} type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Room Type</label>
                  <select className={inputClass} name="roomType" value={formData.roomType} onChange={handleChange} required>
                    <option value="">Select type...</option>
                    <option value="standard">Standard Single — RWF 45,000/night</option>
                    <option value="double">Deluxe Double — RWF 75,000/night</option>
                    <option value="suite">Executive Suite — RWF 120,000/night</option>
                    <option value="family">Family Room — RWF 150,000/night</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Room Number</label>
                  <input className={inputClass} placeholder="e.g. 101" type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} required />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-muted-foreground">Estimated Total</span>
                    <span className="text-xl font-semibold text-foreground">RWF {estimatedTotal.toLocaleString()}</span>
                  </div>
                  <button
                    className="w-full bg-primary text-primary-foreground text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><span className="material-symbols-outlined text-[18px] animate-spin">refresh</span> Creating...</>
                    ) : (
                      <><span className="material-symbols-outlined text-[18px]">check</span> Confirm Booking</>
                    )}
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
    <Suspense fallback={<div className="p-20 text-center text-sm text-muted-foreground">Loading...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
