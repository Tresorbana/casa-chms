'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function ServicesSettings() {
  const { data: servicesData, isLoading } = useSWR('/api/services', fetcher, {
    onError: () => toast.error('Failed to load services'),
  });
  const services = Array.isArray(servicesData) ? servicesData : [];
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', unit: 'session', type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });

  const handleCharge = async () => {
    if (!formData.serviceId) { toast.error('Please select a service'); return; }
    try {
      await fetch('/api/services/charge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      setIsAdding(false);
      setFormData({ ...formData, serviceId: '', bookingId: '', guestName: '', guestContact: '' });
      toast.success('Service charged successfully');
    } catch { toast.error('Failed to charge service'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      mutate('/api/services');
      toast.success('Service deleted');
    } catch { toast.error('Failed to delete service'); }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Services"
        description="Manage extra charges, spa services, and add-ons."
        actions={
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-icons-outlined text-[18px]">add</span>
            Assign Service
          </button>
        }
      />

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Assign Service</h3>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-icons-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex p-1 bg-muted border border-border rounded-lg gap-1">
                {['RESIDENT', 'WALKIN'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${formData.type === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t === 'RESIDENT' ? 'Resident' : 'Walk-in'}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Select Service</label>
                <select className={inputClass} value={formData.serviceId} onChange={e => setFormData({ ...formData, serviceId: e.target.value })}>
                  <option value="">Choose a service...</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — RWF {s.price.toLocaleString()}</option>)}
                </select>
              </div>
              {formData.type === 'RESIDENT' ? (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Room / Guest</label>
                  <select className={inputClass} value={formData.bookingId} onChange={e => setFormData({ ...formData, bookingId: e.target.value })}>
                    <option value="">Select active room...</option>
                    <option value="mock-booking-id">Room 101 - John Doe</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Guest Name</label>
                    <input type="text" className={inputClass} placeholder="Full Name" value={formData.guestName} onChange={e => setFormData({ ...formData, guestName: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Contact</label>
                    <input type="text" className={inputClass} placeholder="Phone" value={formData.guestContact} onChange={e => setFormData({ ...formData, guestContact: e.target.value })} />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quantity</label>
                <input type="number" min="1" className={inputClass} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button onClick={handleCharge} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Confirm Charge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: any) => (
            <div key={service.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <span className="material-icons-outlined text-muted-foreground text-[22px]">spa</span>
                </div>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <span className="material-icons-outlined text-[18px]">delete</span>
                </button>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground">RWF {service.price.toLocaleString()} <span className="text-muted-foreground/60">/ {service.unit}</span></p>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
              <span className="material-icons-outlined text-4xl text-muted-foreground/30 mb-3 block">spa</span>
              <p className="text-sm text-muted-foreground">No services registered yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
