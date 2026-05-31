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
  const { data: bookingsData } = useSWR('/api/bookings?status=CHECKED_IN', fetcher);

  const services = Array.isArray(servicesData) ? servicesData : [];
  const activeBookings = Array.isArray(bookingsData) ? bookingsData : [];

  const [modal, setModal] = useState<'create' | 'assign' | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', price: '', unit: 'session' });
  const [assignForm, setAssignForm] = useState({ type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateService = async () => {
    if (!createForm.name || !createForm.price) { toast.error('Name and price are required'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createForm.name, price: createForm.price, unit: createForm.unit }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Failed to create service');
        return;
      }
      mutate('/api/services');
      setModal(null);
      setCreateForm({ name: '', price: '', unit: 'session' });
      toast.success('Service created');
    } catch { toast.error('Failed to create service'); }
    finally { setIsSubmitting(false); }
  };

  const handleAssignService = async () => {
    if (!assignForm.serviceId) { toast.error('Please select a service'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/services/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });
      if (!res.ok) { toast.error('Failed to assign service'); return; }
      setModal(null);
      setAssignForm({ type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });
      toast.success('Service assigned');
    } catch { toast.error('Failed to assign service'); }
    finally { setIsSubmitting(false); }
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
        description="Create and manage extra charges, spa services, and add-ons."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setModal('assign')}
              className="inline-flex items-center gap-2 border border-border text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">assignment</span>
              Assign to Guest
            </button>
            <button
              onClick={() => setModal('create')}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Service
            </button>
          </div>
        }
      />

      {/* Create Service Modal */}
      {modal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Create New Service</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Service Name</label>
                <input type="text" className={inputClass} placeholder="e.g. Laundry, Airport Transfer" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Price (RWF)</label>
                  <input type="number" min="0" className={inputClass} placeholder="0" value={createForm.price} onChange={e => setCreateForm({ ...createForm, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit</label>
                  <select className={inputClass} value={createForm.unit} onChange={e => setCreateForm({ ...createForm, unit: e.target.value })}>
                    {['session','hour','day','item','kg','person','flat fee'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button onClick={handleCreateService} disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Creating...' : 'Create Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Service Modal */}
      {modal === 'assign' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Assign Service to Guest</h3>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex p-1 bg-muted border border-border rounded-lg gap-1">
                {['RESIDENT', 'WALKIN'].map(t => (
                  <button
                    key={t}
                    onClick={() => setAssignForm({ ...assignForm, type: t })}
                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${assignForm.type === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t === 'RESIDENT' ? 'Resident (Room)' : 'Walk-in'}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Select Service</label>
                <select className={inputClass} value={assignForm.serviceId} onChange={e => setAssignForm({ ...assignForm, serviceId: e.target.value })}>
                  <option value="">Choose a service...</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — RWF {s.price.toLocaleString()} / {s.unit}</option>)}
                </select>
              </div>
              {assignForm.type === 'RESIDENT' ? (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Active Room Booking</label>
                  <select className={inputClass} value={assignForm.bookingId} onChange={e => setAssignForm({ ...assignForm, bookingId: e.target.value })}>
                    <option value="">Select active booking...</option>
                    {activeBookings.map((b: any) => (
                      <option key={b.id} value={b.id}>Room {b.room?.number} – {b.guest?.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Guest Name</label>
                    <input type="text" className={inputClass} placeholder="Full Name" value={assignForm.guestName} onChange={e => setAssignForm({ ...assignForm, guestName: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Contact</label>
                    <input type="text" className={inputClass} placeholder="Phone" value={assignForm.guestContact} onChange={e => setAssignForm({ ...assignForm, guestContact: e.target.value })} />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quantity</label>
                <input type="number" min="1" className={inputClass} value={assignForm.quantity} onChange={e => setAssignForm({ ...assignForm, quantity: parseInt(e.target.value) })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button onClick={handleAssignService} disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Assigning...' : 'Confirm Charge'}
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
                  <span className="material-symbols-outlined text-muted-foreground text-[22px]">spa</span>
                </div>
                <button onClick={() => handleDelete(service.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground">RWF {service.price.toLocaleString()} <span className="text-muted-foreground/60">/ {service.unit}</span></p>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
              <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-3 block">spa</span>
              <p className="text-sm text-muted-foreground mb-3">No services yet</p>
              <button onClick={() => setModal('create')} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create your first service
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
