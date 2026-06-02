'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import { MarkPaidDialog } from '@/components/invoice/MarkPaidDialog';
import { type PaymentMethodId, formatPaymentMethod } from '@/lib/payment-methods';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function ServicesSettings() {
  const { data: servicesData, isLoading } = useSWR('/api/services', fetcher, {
    onError: () => toast.error('Failed to load services'),
  });
  // Use checkout API which correctly returns all currently in-house guests (CONFIRMED + CHECKED_IN with checkIn <= now)
  const { data: checkoutData } = useSWR('/api/checkout', fetcher);

  const services = Array.isArray(servicesData) ? servicesData : [];
  const activeBookings: any[] = Array.isArray(checkoutData?.occupied) ? checkoutData.occupied : [];

  const [modal, setModal] = useState<'create' | 'assign' | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', price: '', unit: 'session' });
  const [assignForm, setAssignForm] = useState({ type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);
  const [payDialog, setPayDialog] = useState<{ open: boolean; invoiceId: string | null }>({ open: false, invoiceId: null });

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
    if (assignForm.type === 'RESIDENT' && !assignForm.bookingId) { toast.error('Please select an active booking'); return; }
    if (assignForm.type === 'WALKIN' && (!assignForm.guestName || !assignForm.guestContact)) { toast.error('Guest name and contact are required'); return; }
    setIsSubmitting(true);
    try {
      const payload = assignForm.type === 'RESIDENT'
        ? { serviceId: assignForm.serviceId, bookingId: assignForm.bookingId, quantity: assignForm.quantity }
        : { serviceId: assignForm.serviceId, guestName: assignForm.guestName, guestContact: assignForm.guestContact, quantity: assignForm.quantity };

      const res = await fetch('/api/services/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { toast.error('Failed to assign service'); return; }
      const data = await res.json();
      setModal(null);
      setAssignForm({ type: 'RESIDENT', serviceId: '', bookingId: '', guestName: '', guestContact: '', quantity: 1 });

      if (assignForm.type === 'WALKIN' && data.invoiceId) {
        setLastInvoiceId(data.invoiceId);
        setPayDialog({ open: true, invoiceId: data.invoiceId });
      } else {
        toast.success('Service added to guest folio');
      }
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

  const handleConfirmPayment = async (method: PaymentMethodId) => {
    if (!payDialog.invoiceId) return;
    const res = await fetch(`/api/invoices/${payDialog.invoiceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PAID', paymentMethod: method }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to confirm payment');
    }
    toast.success(`Payment confirmed via ${formatPaymentMethod(method)}`, {
      action: { label: 'View Invoice', onClick: () => window.open(`/invoice/${payDialog.invoiceId}`, '_blank') },
    });
    setPayDialog({ open: false, invoiceId: null });
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

      {lastInvoiceId && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">receipt_long</span>
          <p className="text-sm text-emerald-800 flex-1">Walk-in invoice generated successfully.</p>
          <a
            href={`/invoice/${lastInvoiceId}`}
            target="_blank"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            View Invoice →
          </a>
          <button onClick={() => setLastInvoiceId(null)} className="text-emerald-500 hover:text-emerald-700">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

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
                    onClick={() => setAssignForm({ ...assignForm, type: t, bookingId: '', guestName: '', guestContact: '' })}
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
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Active Room Booking
                    {activeBookings.length === 0 && (
                      <span className="ml-2 text-amber-600">(no guests currently checked in)</span>
                    )}
                  </label>
                  <select className={inputClass} value={assignForm.bookingId} onChange={e => setAssignForm({ ...assignForm, bookingId: e.target.value })}>
                    <option value="">
                      {activeBookings.length === 0 ? 'No active guests — use Walk-in tab' : 'Select active booking...'}
                    </option>
                    {activeBookings.map((b: any) => (
                      <option key={b.bookingId} value={b.bookingId}>
                        Room {b.roomNumber} – {b.guestName}
                      </option>
                    ))}
                  </select>
                  {activeBookings.length === 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      No guests have checked in yet. Switch to the <button className="text-primary hover:underline" onClick={() => setAssignForm({ ...assignForm, type: 'WALKIN' })}>Walk-in tab</button> to charge a non-resident.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
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
                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="material-symbols-outlined text-blue-500 text-[16px] mt-0.5">info</span>
                    <p className="text-xs text-blue-700">An invoice will be generated automatically for walk-in service charges.</p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quantity</label>
                <input type="number" min="1" className={inputClass} value={assignForm.quantity} onChange={e => setAssignForm({ ...assignForm, quantity: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button onClick={handleAssignService} disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Processing...' : assignForm.type === 'WALKIN' ? 'Charge & Generate Invoice' : 'Add to Folio'}
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

      <MarkPaidDialog
        open={payDialog.open}
        onClose={() => setPayDialog({ open: false, invoiceId: null })}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
}
