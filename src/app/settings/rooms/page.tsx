'use client';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none transition-all";

export default function RoomSettings() {
  const { data: floorsData, isLoading } = useSWR('/api/floors', fetcher, {
    onError: () => toast.error('Failed to load floors'),
  });
  const floors = Array.isArray(floorsData) ? floorsData : [];
  const [isAddingFloor, setIsAddingFloor] = useState(false);
  const [newFloorNumber, setNewFloorNumber] = useState('');
  const [addingRoomToFloor, setAddingRoomToFloor] = useState<string | null>(null);
  const [newRoomData, setNewRoomData] = useState({ number: '', type: 'Standard', price: '' });

  const handleAddFloor = async () => {
    if (!newFloorNumber) return;
    try {
      await fetch('/api/floors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ number: newFloorNumber }) });
      setIsAddingFloor(false);
      setNewFloorNumber('');
      mutate('/api/floors');
      toast.success('Floor added');
    } catch { toast.error('Failed to add floor'); }
  };

  const handleDeleteFloor = async (id: string) => {
    if (!confirm('Delete this floor and all its rooms?')) return;
    try {
      await fetch(`/api/floors/${id}`, { method: 'DELETE' });
      mutate('/api/floors');
      toast.success('Floor deleted');
    } catch { toast.error('Failed to delete floor'); }
  };

  const handleAddRoom = async (floorId: string) => {
    if (!newRoomData.number || !newRoomData.price) return;
    try {
      await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newRoomData, floorId }) });
      setAddingRoomToFloor(null);
      setNewRoomData({ number: '', type: 'Standard', price: '' });
      mutate('/api/floors');
      toast.success('Room added');
    } catch { toast.error('Failed to add room'); }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    try {
      await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      mutate('/api/floors');
      toast.success('Room deleted');
    } catch { toast.error('Failed to delete room'); }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Rooms & Floors"
        description="Configure floors and rooms for your property."
        actions={
          <button
            onClick={() => setIsAddingFloor(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Floor
          </button>
        }
      />

      {isAddingFloor && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">New Floor</h3>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Floor number (e.g. 1)"
              className={inputClass}
              value={newFloorNumber}
              onChange={e => setNewFloorNumber(e.target.value)}
            />
            <button onClick={handleAddFloor} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">Save</button>
            <button onClick={() => setIsAddingFloor(false)} className="px-5 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-accent transition-colors whitespace-nowrap">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading floors...</div>
      ) : (
        <div className="space-y-4">
          {floors.map((floor: any) => (
            <div key={floor.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex justify-between items-center border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold">
                    {floor.number}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Floor {floor.number}</h3>
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {floor.rooms?.length || 0} rooms
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setAddingRoomToFloor(floor.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all" title="Add Room">
                    <span className="material-symbols-outlined text-[18px]">add_box</span>
                  </button>
                  <button onClick={() => handleDeleteFloor(floor.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" title="Delete Floor">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {addingRoomToFloor === floor.id && (
                <div className="px-5 py-4 flex flex-wrap gap-3 items-end border-b border-border bg-muted/20">
                  <div className="flex-1 min-w-[100px]">
                    <label className="text-xs text-muted-foreground block mb-1">Number</label>
                    <input className={inputClass} placeholder="101" value={newRoomData.number} onChange={e => setNewRoomData({ ...newRoomData, number: e.target.value })} />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="text-xs text-muted-foreground block mb-1">Type</label>
                    <select className={inputClass} value={newRoomData.type} onChange={e => setNewRoomData({ ...newRoomData, type: e.target.value })}>
                      <option>Standard</option><option>Deluxe</option><option>Suite</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="text-xs text-muted-foreground block mb-1">Price (RWF)</label>
                    <input type="number" className={inputClass} placeholder="45000" value={newRoomData.price} onChange={e => setNewRoomData({ ...newRoomData, price: e.target.value })} />
                  </div>
                  <button onClick={() => handleAddRoom(floor.id)} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Add Room</button>
                  <button onClick={() => setAddingRoomToFloor(null)} className="text-muted-foreground hover:text-foreground text-sm px-4 py-2.5 transition-colors">Cancel</button>
                </div>
              )}

              <div className="p-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {floor.rooms?.map((room: any) => (
                  <div key={room.id} className="relative group bg-muted/50 border border-border rounded-lg p-3 text-center hover:border-primary/30 transition-all">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">{room.type}</span>
                    <span className="text-base font-semibold text-foreground block">{room.number}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">RWF {room.price?.toLocaleString()}</span>
                  </div>
                ))}
                {(!floor.rooms || floor.rooms.length === 0) && (
                  <div className="col-span-full py-6 text-center text-muted-foreground text-xs">No rooms on this floor yet.</div>
                )}
              </div>
            </div>
          ))}

          {floors.length === 0 && (
            <div className="py-20 text-center border border-dashed border-border rounded-xl">
              <span className="material-symbols-outlined text-4xl text-muted-foreground/30 mb-3 block">layers</span>
              <p className="text-sm text-muted-foreground">No floors defined yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
