'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function ConferenceSettings() {
  const { data: roomsData, isLoading } = useSWR('/api/conference', fetcher, {
    onError: () => toast.error('Failed to load conference rooms'),
  });
  const rooms = Array.isArray(roomsData) ? roomsData : [];
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', capacity: '', pricePerHour: '' });

  const handleSave = async () => {
    if (!formData.name || !formData.capacity || !formData.pricePerHour) return;
    try {
      const method = editingRoom ? 'PUT' : 'POST';
      const url = editingRoom ? `/api/conference/${editingRoom.id}` : '/api/conference';
      await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, capacity: parseInt(formData.capacity), pricePerHour: parseFloat(formData.pricePerHour) })
      });
      setIsAdding(false); setEditingRoom(null); setFormData({ name: '', capacity: '', pricePerHour: '' });
      mutate('/api/conference');
      toast.success(editingRoom ? 'Room updated' : 'Room added');
    } catch { toast.error('Failed to save room'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this conference room?')) return;
    try {
      await fetch(`/api/conference/${id}`, { method: 'DELETE' });
      mutate('/api/conference');
      toast.success('Room deleted');
    } catch { toast.error('Failed to delete room'); }
  };

  const startEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({ name: room.name, capacity: room.capacity.toString(), pricePerHour: room.pricePerHour.toString() });
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Conference Rooms"
        description="Manage conference halls and meeting spaces."
        actions={
          <button
            onClick={() => { setEditingRoom(null); setFormData({ name: '', capacity: '', pricePerHour: '' }); setIsAdding(true); }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-icons-outlined text-[18px]">add</span>
            Add Room
          </button>
        }
      />

      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">{editingRoom ? 'Edit Conference Room' : 'New Conference Room'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Room Name', key: 'name', type: 'text', placeholder: 'Grand Ballroom' },
              { label: 'Capacity (Pax)', key: 'capacity', type: 'number', placeholder: '100' },
              { label: 'Price per Hour (RWF)', key: 'pricePerHour', type: 'number', placeholder: '50000' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">{field.label}</label>
                <input
                  type={field.type} className={inputClass} placeholder={field.placeholder}
                  value={(formData as any)[field.key]}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              {editingRoom ? 'Update' : 'Save'}
            </button>
            <button onClick={() => { setIsAdding(false); setEditingRoom(null); }} className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room: any) => (
            <div key={room.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <span className="material-icons-outlined text-muted-foreground text-[22px]">meeting_room</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(room)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                    <span className="material-icons-outlined text-[18px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                    <span className="material-icons-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-3">{room.name}</h3>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium text-foreground">{room.capacity} pax</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="font-medium text-foreground">RWF {room.pricePerHour?.toLocaleString()}/hr</span>
                </div>
              </div>
            </div>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
              <span className="material-icons-outlined text-4xl text-muted-foreground/30 mb-3 block">meeting_room</span>
              <p className="text-sm text-muted-foreground">No conference rooms yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
