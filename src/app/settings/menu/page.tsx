'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const CATEGORIES = [
  'Beverages',
  'Cassava Bread',
  'Ubumwe Hotel VIP',
  'Dessert',
  'Accompaniments',
  'Barbecue',
  'Drinks Soft',
  'Fish',
  'Pizza',
  'Pastes',
  'Vegetarian',
  'Main Red Meat',
  'Cold Starter',
  'Hot Starter',
  'Fresh Juice',
  'Eggs',
  'Cereales',
  'Breads',
  'Breakfast',
  'Tea Break',
  'Hot Drinks',
  'Sandwiches',
  'Snacks',
  'African Kitchen',
  'Appetizers',
  'Main Course',
  'Wine & Spirits',
  'Cocktails',
  'Soft Drinks',
  'Water & Juices',
];
const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function MenuSettings() {
  const { data: menuItems, isLoading } = useSWR('/api/pos/menu?all=true', fetcher, {
    onError: () => toast.error('Failed to load menu items'),
  });
  const { data: inventoryData } = useSWR('/api/inventory', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', category: 'Beverages', price: '', description: '', inventoryItemId: '' });

  const safeItems = Array.isArray(menuItems) ? menuItems : [];
  const inventoryItems = Array.isArray(inventoryData) ? inventoryData.filter((i: any) =>
    ['Food & Bev', 'Beverages'].includes(i.category)
  ) : [];

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Beverages', price: '', description: '', inventoryItemId: '' });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name ?? '',
      category: item.category ?? 'Beverages',
      price: item.price != null ? String(item.price) : '',
      description: item.description ?? '',
      inventoryItemId: item.inventoryItemId ?? '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(editingItem ? `/api/pos/menu/${editingItem.id}` : '/api/pos/menu', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inventoryItemId: formData.inventoryItemId || null,
        }),
      });
      if (res.ok) {
        mutate('/api/pos/menu?all=true');
        closeModal();
        toast.success(editingItem ? 'Menu item updated' : 'Menu item created');
      } else {
        const err = await res.json().catch(() => null);
        toast.error(err?.error || (editingItem ? 'Failed to update item' : 'Failed to create item'));
      }
    } catch {
      toast.error(editingItem ? 'Error updating item' : 'Error creating item');
    }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await fetch(`/api/pos/menu/${id}`, { method: 'DELETE' });
      mutate('/api/pos/menu?all=true');
      toast.success('Item deleted');
    } catch { toast.error('Failed to delete item'); }
  };

  const toggleAvailability = async (item: any) => {
    try {
      await fetch(`/api/pos/menu/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ available: !item.available }) });
      mutate('/api/pos/menu?all=true');
    } catch { toast.error('Failed to update availability'); }
  };

  const getInventoryName = (id: string | null) => {
    if (!id) return null;
    const item = inventoryItems.find((i: any) => i.id === id);
    return item?.name ?? null;
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Menu Management"
        description="Configure restaurant & bar menu items, pricing, and inventory links."
        actions={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Item
          </button>
        }
      />

      {inventoryItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          <span className="material-symbols-outlined text-[18px] flex-shrink-0">info</span>
          <p>Link menu items to inventory to automatically deduct stock when sold at the restaurant. Only Food &amp; Bev and Beverages categories are shown as options.</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {['Item Name', 'Category', 'Price', 'Stock Link', 'Status', ''].map((h, i) => (
                  <th key={h || i} className={`px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">Loading menu items...</td></tr>
              ) : safeItems.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center">
                  <span className="material-symbols-outlined text-3xl text-muted-foreground/30 block mb-2">restaurant_menu</span>
                  <p className="text-sm text-muted-foreground">No menu items found</p>
                </td></tr>
              ) : safeItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{item.name}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">RWF {item.price.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    {item.inventoryItemId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-[12px]">inventory_2</span>
                        {getInventoryName(item.inventoryItemId) || 'Linked'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase transition-all border ${item.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-muted text-muted-foreground border-border'}`}
                    >
                      {item.available ? 'Available' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        title="Edit item"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-sm font-semibold text-foreground">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Item Name</label>
                <input required type="text" className={inputClass} placeholder="e.g. Primus Beer, Grilled Salmon" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Price (RWF)</label>
                  <input required type="number" className={inputClass} placeholder="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                </div>
              </div>
              {inventoryItems.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    Link to Inventory Item <span className="text-muted-foreground/60 font-normal">(optional — deducts stock when sold)</span>
                  </label>
                  <select className={inputClass} value={formData.inventoryItemId} onChange={e => setFormData({ ...formData, inventoryItemId: e.target.value })}>
                    <option value="">No stock tracking</option>
                    {inventoryItems.map((i: any) => (
                      <option key={i.id} value={i.id}>{i.name} ({i.stock} {i.unit} in stock)</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description</label>
                <textarea className={inputClass} rows={2} placeholder="Brief description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'none' }} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
