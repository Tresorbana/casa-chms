'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import { ExportButton } from '@/components/ExportButton';
import { exportToExcel, inventoryExportRows } from '@/lib/export-excel';
import { useRouter } from 'next/navigation';

type Tab = 'stock' | 'movements';

const REASONS: Record<string, string> = {
  INITIAL: 'Initial Stock',
  PURCHASE: 'Purchase',
  MANUAL_ADJUSTMENT: 'Manual Adjustment',
  RESTAURANT_SALE: 'Restaurant Sale',
  WASTE: 'Waste / Spoilage',
};

export default function Inventory() {
  const router = useRouter();
  const { data: items, isLoading, mutate } = useSWR('/api/inventory', fetcher, {
    onError: () => toast.error('Failed to load inventory'),
  });
  const { data: movements, isLoading: movementsLoading } = useSWR('/api/inventory/movements', fetcher, {
    onError: () => toast.error('Failed to load movements'),
  });

  const [tab, setTab] = useState<Tab>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editItem, setEditItem] = useState({ name: '', category: 'Housekeeping', unit: 'pcs', price: '0', minStock: '10' });
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustReason, setAdjustReason] = useState('PURCHASE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: '', category: 'Housekeeping', stock: '0', unit: 'pcs', price: '0', minStock: '10' });

  const filteredItems = items ? items.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const stats = {
    total: items?.length || 0,
    lowStock: items?.filter((i: any) => i.stock <= (i.minStock || 5)).length || 0,
    totalValue: items?.reduce((acc: number, i: any) => acc + (i.stock * i.price), 0) || 0,
  };

  const movementList = Array.isArray(movements) ? movements : [];
  const stockIn = movementList.filter((m: any) => m.type === 'IN').reduce((sum: number, m: any) => sum + m.quantity, 0);
  const stockOut = movementList.filter((m: any) => m.type === 'OUT').reduce((sum: number, m: any) => sum + m.quantity, 0);

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
        setNewItem({ name: '', category: 'Housekeeping', stock: '0', unit: 'pcs', price: '0', minStock: '10' });
        toast.success('Item added');
      } else { toast.error('Failed to add item'); }
    } catch { toast.error('Error adding item'); }
    finally { setIsSubmitting(false); }
  };

  const quickAdjust = async (id: string, adjustment: number) => {
    setAdjustingId(id);
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      toast.success(adjustment > 0 ? 'Stock added' : 'Stock removed');
    } catch { toast.error('Failed to update stock'); }
    finally { setAdjustingId(null); }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditItem({
      name: item.name,
      category: item.category,
      unit: item.unit,
      price: String(item.price ?? 0),
      minStock: String(item.minStock ?? 10),
    });
    setIsEditModalOpen(true);
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editItem.name,
          category: editItem.category,
          unit: editItem.unit,
          price: Number(editItem.price),
          minStock: Number(editItem.minStock),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      setIsEditModalOpen(false);
      toast.success('Item updated');
    } catch {
      toast.error('Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAdjustModal = (item: any) => {
    setAdjustItem(item);
    setAdjustQty('');
    setAdjustType('IN');
    setAdjustReason('PURCHASE');
    setIsAdjustModalOpen(true);
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustQty || !adjustItem) return;
    const qty = parseInt(adjustQty);
    const adjustment = adjustType === 'IN' ? qty : -qty;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/inventory/${adjustItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment, reason: adjustReason }),
      });
      if (!res.ok) throw new Error('Failed');
      mutate();
      setIsAdjustModalOpen(false);
      toast.success(`Stock ${adjustType === 'IN' ? 'added' : 'removed'} for ${adjustItem.name}`);
    } catch { toast.error('Failed to update stock'); }
    finally { setIsSubmitting(false); }
  };

  const handleExport = () => {
    const rows = inventoryExportRows(filteredItems.length > 0 ? filteredItems : items || []);
    exportToExcel(rows, `Inventory_${new Date().toISOString().split('T')[0]}`, 'Inventory');
    toast.success('Inventory exported');
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Stock Management"
        description="Track supplies, stock movements, and low-stock alerts."
        actions={
          <div className="flex flex-wrap gap-2">
            <ExportButton onClick={handleExport} disabled={!items?.length} />
            <button
              onClick={() => router.push('/reports')}
              className="inline-flex items-center gap-2 border border-border text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">assessment</span>
              Reports
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Item
            </button>
          </div>
        }
      />

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Add Inventory Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Item Name</label>
                <input required className={inputClass} placeholder="e.g. Primus Beer, Bed Sheets" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                    {['Housekeeping', 'Linen', 'Food & Bev', 'Beverages', 'Maintenance', 'Office'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit</label>
                  <input className={inputClass} placeholder="pcs, bottles, kg..." value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Initial Stock</label>
                  <input type="number" className={inputClass} value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Min Alert</label>
                  <input type="number" className={inputClass} value={newItem.minStock} onChange={e => setNewItem({ ...newItem, minStock: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit Price</label>
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

      {/* Edit Item Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Edit Inventory Item</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleEditItem} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Item Name</label>
                <input required className={inputClass} value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
                  <select className={inputClass} value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                    {['Housekeeping', 'Linen', 'Food & Bev', 'Beverages', 'Maintenance', 'Office'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit</label>
                  <input className={inputClass} value={editItem.unit} onChange={e => setEditItem({ ...editItem, unit: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Min Alert</label>
                  <input type="number" className={inputClass} value={editItem.minStock} onChange={e => setEditItem({ ...editItem, minStock: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Unit Price</label>
                  <input type="number" className={inputClass} value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && adjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Adjust Stock</h3>
                <p className="text-xs text-muted-foreground">{adjustItem.name} — Current: {adjustItem.stock} {adjustItem.unit}</p>
              </div>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAdjust} className="p-5 space-y-4">
              <div className="flex p-1 bg-muted border border-border rounded-lg gap-1">
                {(['IN', 'OUT'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setAdjustType(t)}
                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${adjustType === t ? 'bg-background text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t === 'IN' ? '+ Stock In' : '− Stock Out'}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quantity</label>
                <input required type="number" min="1" className={inputClass} placeholder="Enter quantity" value={adjustQty} onChange={e => setAdjustQty(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Reason</label>
                <select className={inputClass} value={adjustReason} onChange={e => setAdjustReason(e.target.value)}>
                  {adjustType === 'IN'
                    ? [['PURCHASE', 'Purchase'], ['MANUAL_ADJUSTMENT', 'Manual Correction']].map(([v, l]) => <option key={v} value={v}>{l}</option>)
                    : [['WASTE', 'Waste / Spoilage'], ['MANUAL_ADJUSTMENT', 'Manual Correction']].map(([v, l]) => <option key={v} value={v}>{l}</option>)
                  }
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${adjustType === 'IN' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}>
                  {isSubmitting ? 'Saving...' : adjustType === 'IN' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Items</p>
          <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-amber-200 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Low Stock</p>
          <p className="text-2xl font-semibold text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="bg-card border border-emerald-200 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Stock In</p>
          <p className="text-2xl font-semibold text-emerald-600">{stockIn.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-red-200 rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Stock Out</p>
          <p className="text-2xl font-semibold text-red-600">{stockOut.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted border border-border rounded-lg w-fit">
        {(['stock', 'movements'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${tab === t ? 'bg-card text-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'stock' ? 'Current Stock' : 'Stock Movements'}
          </button>
        ))}
      </div>

      {/* Stock Tab */}
      {tab === 'stock' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">Item List</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[16px]">search</span>
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
                    {['Item Name', 'Category', 'Balance', 'Unit', 'Unit Price', 'Value', 'Status', ''].map((h, i) => (
                      <th key={h || i} className="px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
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
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">{item.stock}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{item.unit}</td>
                      <td className="px-5 py-4 text-sm text-foreground">RWF {item.price.toFixed(0)}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">RWF {(item.stock * item.price).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        {item.stock <= (item.minStock || 5) ? (
                          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium">Low Stock</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">Good</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-1">
                          <button type="button" disabled={adjustingId === item.id} onClick={() => quickAdjust(item.id, -1)}
                            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50" title="Remove 1">
                            <span className="material-symbols-outlined text-[18px]">remove</span>
                          </button>
                          <button type="button" disabled={adjustingId === item.id} onClick={() => quickAdjust(item.id, 1)}
                            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50" title="Add 1">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                          </button>
                          <button type="button" onClick={() => openEditModal(item)}
                            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Edit item">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button type="button" onClick={() => openAdjustModal(item)}
                            className="px-2 py-1.5 text-[10px] font-medium rounded-lg border border-border hover:bg-accent transition-colors" title="Adjust stock">
                            Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center text-muted-foreground text-sm">No items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Movements Tab */}
      {tab === 'movements' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Stock Movements</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All stock in and out transactions</p>
          </div>
          {movementsLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading movements...</div>
          ) : movementList.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">swap_vert</span>
              <p className="text-sm">No stock movements recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {['Date', 'Item', 'Type', 'Qty', 'Reason', 'Reference'].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movementList.map((m: any) => (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleDateString()} {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{m.item?.name}</td>
                      <td className="px-5 py-4">
                        {m.type === 'IN' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                            <span className="material-symbols-outlined text-[12px]">arrow_downward</span> IN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-medium">
                            <span className="material-symbols-outlined text-[12px]">arrow_upward</span> OUT
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-foreground">{m.quantity} {m.item?.unit}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{REASONS[m.reason] || m.reason || '—'}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground truncate max-w-[150px]">{m.reference || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
