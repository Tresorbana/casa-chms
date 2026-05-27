'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

export default function Inventory() {
  const { data: items, isLoading, mutate } = useSWR('/api/inventory', fetcher, {
    onError: () => toast.error('Failed to load inventory'),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Housekeeping', stock: '0', unit: 'pcs', price: '0' });

  const filteredItems = items ? items.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const stats = {
    total: items?.length || 0,
    lowStock: items?.filter((i: any) => i.stock <= (i.minStock || 5)).length || 0,
    totalValue: items?.reduce((acc: number, i: any) => acc + (i.stock * i.price), 0) || 0,
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        mutate();
        setIsModalOpen(false);
        setNewItem({ name: '', category: 'Housekeeping', stock: '0', unit: 'pcs', price: '0' });
        toast.success('Item added successfully');
      } else {
        toast.error('Failed to add item');
      }
    } catch {
      toast.error('Error adding item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Inventory"
        description="Hotel supplies, linen, and housekeeping essentials."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-icons-outlined text-[18px]">add</span>
            Add Item
          </button>
        }
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Add Inventory Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-icons-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Item Name</label>
                <input required className={inputClass} placeholder="e.g. Bed Sheets" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                    {['Housekeeping','Linen','Food & Bev','Maintenance','Office'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit</label>
                  <input className={inputClass} placeholder="pcs, kg..." value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Initial Stock</label>
                  <input type="number" className={inputClass} value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit Price (RWF)</label>
                  <input type="number" className={inputClass} value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Items</p>
          <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-amber-200 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Low Stock Alerts</p>
          <p className="text-2xl font-semibold text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Inventory Value</p>
          <p className="text-2xl font-semibold text-foreground">RWF {stats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-semibold text-foreground">Item List</h3>
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[16px]">search</span>
            <input
              className="pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring w-52"
              placeholder="Filter items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading inventory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {['Item Name','Category','In Stock','Unit','Unit Price','Status',''].map((h, i) => (
                    <th key={h} className={`px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-foreground">{item.name}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground uppercase">{item.category}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{item.stock}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{item.unit}</td>
                    <td className="px-5 py-4 text-sm text-foreground">RWF {item.price.toFixed(0)}</td>
                    <td className="px-5 py-4">
                      {item.stock <= (item.minStock || 5) ? (
                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">Low Stock</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">Good</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <span className="material-icons-outlined text-[18px]">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
