'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';

export default function PosRestaurant() {
  const { data: menuItems, error } = useSWR('/api/pos/menu', fetcher);
  const [orderType, setOrderType] = useState('resident');
  const [cart, setCart] = useState<any[]>([]);
  const [residentRoom, setResidentRoom] = useState('');
  const [walkInName, setWalkInName] = useState('');
  const [walkInContact, setWalkInContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const safeItems = Array.isArray(menuItems) ? menuItems : [];
  const categories = ['All Items', ...Array.from(new Set(safeItems.map((item: any) => item.category)))];
  const filteredItems = safeItems.filter((item: any) => {
    const matchCat = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
    toast.success(`${item.name} added`, { duration: 1500 });
  };
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleFinalize = async () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    setIsSubmitting(true);
    try {
      const guestDescription = orderType === 'resident'
        ? `Room ${residentRoom}`
        : `${walkInName || 'Guest'} (${walkInContact || 'No Contact'})`;
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guestDescription, amount: cartTotal, status: 'PENDING',
          items: cart.map(item => ({ description: item.name, quantity: 1, price: item.price }))
        })
      });
      if (res.ok) {
        const invoice = await res.json();
        router.push(`/invoice/restaurant?id=${invoice.id}`);
      } else {
        toast.error('Failed to create invoice');
      }
    } catch {
      toast.error('Error creating invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Main */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 min-h-screen">
        <TopBar
          title="Restaurant POS"
          description="Point of Sale for  Hotel Restaurant & Bar."
          actions={
            <button
              className="lg:hidden relative p-2 rounded-lg bg-primary text-primary-foreground"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          }
        />

        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[18px]">search</span>
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 overflow-y-auto pb-24 lg:pb-4">
          {error ? (
            <div className="col-span-full p-12 text-center text-destructive text-sm">Failed to load menu.</div>
          ) : !menuItems ? (
            <div className="col-span-full p-12 text-center text-muted-foreground text-sm">Loading menu...</div>
          ) : filteredItems.length > 0 ? filteredItems.map((item: any) => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden text-left transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="h-24 w-full flex items-center justify-center bg-muted/50 group-hover:bg-muted transition-colors">
                <span className="material-symbols-outlined text-3xl text-muted-foreground/40">restaurant_menu</span>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{item.category}</p>
                <h3 className="text-sm font-medium text-foreground line-clamp-1 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">RWF {item.price.toLocaleString()}</span>
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-all">
                    <span className="material-symbols-outlined text-[14px] text-primary group-hover:text-primary-foreground">add</span>
                  </div>
                </div>
              </div>
            </button>
          )) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">restaurant</span>
              <p className="text-sm">No menu items found</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile overlay */}
      {isCartOpen && <div className="fixed inset-0 z-40 lg:hidden bg-foreground/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />}

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 z-50 flex flex-col bg-card border-l border-border transform transition-transform duration-300 lg:relative lg:w-80 lg:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-foreground">Order</h3>
            <button className="text-xs text-destructive hover:text-destructive/80 transition-colors" onClick={() => setCart([])}>Clear</button>
          </div>
          {/* Order type */}
          <div className="flex p-1 bg-muted border border-border rounded-lg gap-1 mb-4">
            {['resident', 'walkin'].map(t => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${orderType === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t === 'resident' ? 'Resident' : 'Walk-in'}
              </button>
            ))}
          </div>
          {orderType === 'resident' ? (
            <input className={inputClass} placeholder="Room Number..." value={residentRoom} onChange={e => setResidentRoom(e.target.value)} />
          ) : (
            <div className="space-y-2">
              <input className={inputClass} placeholder="Guest Name..." value={walkInName} onChange={e => setWalkInName(e.target.value)} />
              <input className={inputClass} placeholder="Contact..." value={walkInContact} onChange={e => setWalkInContact(e.target.value)} />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-30">shopping_cart</span>
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : cart.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted">
                <span className="material-symbols-outlined text-muted-foreground text-[16px]">restaurant</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">RWF {item.price.toLocaleString()}</p>
              </div>
              <button className="text-muted-foreground hover:text-destructive transition-colors" onClick={() => setCart(cart.filter((_, i) => i !== index))}>
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl font-semibold text-foreground">RWF {cartTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={handleFinalize}
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-primary text-primary-foreground text-sm font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">{isSubmitting ? 'sync' : 'receipt_long'}</span>
            {isSubmitting ? 'Processing...' : 'Finalize Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
