'use client';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    const addToCart = (item: any) => setCart(prev => [...prev, item]);
    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    const handleFinalize = async () => {
        if (cart.length === 0) { alert('Cart is empty'); return; }
        setIsSubmitting(true);
        try {
            const guestDescription = orderType === 'resident' ? `Room ${residentRoom}` : `${walkInName || 'Guest'} (${walkInContact || 'No Contact'})`;
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestName: guestDescription, amount: cartTotal, status: 'PENDING', items: cart.map(item => ({ description: item.name, quantity: 1, price: item.price })) })
            });
            if (res.ok) { const invoice = await res.json(); router.push(`/invoice/restaurant?id=${invoice.id}`); }
            else alert('Failed to create invoice');
        } catch { alert('Error creating invoice'); }
        finally { setIsSubmitting(false); }
    };

    const inputStyle = { background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', color: 'white' };

    return (
        <div className="flex-1 min-h-screen relative flex flex-col lg:flex-row" style={{ background: '#000000' }}>
            {/* Main content */}
            <main className="flex-1 flex flex-col overflow-hidden min-h-screen p-4 lg:p-8">
                <TopBar
                    title="Restaurant POS"
                    description="Point of Sale for Casa Hotel Restaurant & Bar."
                    actions={
                        <button className="lg:hidden relative p-2 rounded-xl bg-gold text-black" onClick={() => setIsCartOpen(!isCartOpen)}>
                            <span className="material-icons-outlined">shopping_cart</span>
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    }
                />

                {/* Search + categories */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-[18px]">search</span>
                        <input className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none" style={inputStyle}
                            placeholder="Search menu items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat: any) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-gold text-black shadow-gold-sm' : 'text-white/40 hover:text-white/70'}`}
                            style={selectedCategory !== cat ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pb-24 lg:pb-4">
                    {error ? (
                        <div className="col-span-full p-12 text-center text-red-400 font-bold">Failed to load menu.</div>
                    ) : !menuItems ? (
                        <div className="col-span-full p-12 text-center text-white/30 text-sm">Loading menu...</div>
                    ) : filteredItems.length > 0 ? filteredItems.map((item: any) => (
                        <button key={item.id} onClick={() => addToCart(item)}
                            className="group flex flex-col rounded-2xl overflow-hidden text-left transition-all hover:border-gold/30 hover:-translate-y-0.5 hover:shadow-gold-sm"
                            style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="h-28 w-full flex items-center justify-center bg-gold/[0.03] group-hover:bg-gold/[0.06] transition-colors">
                                <span className="material-icons-outlined text-4xl text-gold/25">restaurant_menu</span>
                            </div>
                            <div className="p-4">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{item.category}</p>
                                <h3 className="font-bold text-sm text-white/80 group-hover:text-white transition-colors line-clamp-1 mb-3">{item.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-gold font-black text-sm">RWF {item.price.toLocaleString()}</span>
                                    <div className="w-7 h-7 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                                        <span className="material-icons-outlined text-[14px] text-gold group-hover:text-black">add</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    )) : (
                        <div className="col-span-full py-24 text-center text-white/25">
                            <span className="material-icons-outlined text-5xl block mb-3 opacity-30">restaurant</span>
                            <p className="font-black text-sm uppercase tracking-widest">No menu items found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile overlay */}
            {isCartOpen && <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setIsCartOpen(false)} />}

            {/* Cart sidebar */}
            <div className={`fixed inset-y-0 right-0 w-80 z-50 flex flex-col transform transition-transform duration-300 lg:relative lg:w-96 lg:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-black text-lg text-white uppercase tracking-tighter">Order</h3>
                        <button className="text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors" onClick={() => setCart([])}>Clear</button>
                    </div>
                    {/* Order type toggle */}
                    <div className="flex p-1 rounded-xl gap-1 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {['resident', 'walkin'].map(t => (
                            <button key={t} onClick={() => setOrderType(t)}
                                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${orderType === t ? 'bg-gold text-black' : 'text-white/40 hover:text-white'}`}>
                                {t === 'resident' ? 'Resident' : 'Walk-in'}
                            </button>
                        ))}
                    </div>
                    {orderType === 'resident' ? (
                        <input className="w-full rounded-xl px-4 py-2.5 text-sm font-bold outline-none" style={inputStyle} placeholder="Room Number..." value={residentRoom} onChange={e => setResidentRoom(e.target.value)} />
                    ) : (
                        <div className="space-y-2">
                            <input className="w-full rounded-xl px-4 py-2.5 text-sm font-bold outline-none" style={inputStyle} placeholder="Guest Name..." value={walkInName} onChange={e => setWalkInName(e.target.value)} />
                            <input className="w-full rounded-xl px-4 py-2.5 text-sm font-bold outline-none" style={inputStyle} placeholder="Contact..." value={walkInContact} onChange={e => setWalkInContact(e.target.value)} />
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-white/20 py-16 flex flex-col items-center gap-3">
                            <span className="material-icons-outlined text-4xl opacity-30">shopping_cart</span>
                            <p className="font-bold text-sm">Cart is empty</p>
                        </div>
                    ) : cart.map((item, index) => (
                        <div key={index} className="flex gap-3 group">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gold/[0.06]">
                                <span className="material-icons-outlined text-gold/40 text-[18px]">restaurant</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm text-white/70 truncate pr-2">{item.name}</h4>
                                    <p className="font-black text-xs text-gold whitespace-nowrap">RWF {item.price.toLocaleString()}</p>
                                </div>
                                <p className="text-[9px] text-white/25 mt-0.5">{item.category}</p>
                            </div>
                            <button className="text-white/15 hover:text-red-400 transition-colors" onClick={() => setCart(cart.filter((_, i) => i !== index))}>
                                <span className="material-icons-outlined text-[16px]">close</span>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex justify-between items-baseline mb-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total</span>
                        <span className="text-2xl font-black text-gold">RWF {cartTotal.toLocaleString()}</span>
                    </div>
                    <button onClick={handleFinalize} disabled={isSubmitting || cart.length === 0}
                        className="w-full bg-gold text-black font-black py-4 rounded-2xl shadow-gold hover:bg-gold-light transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                        <span className="material-icons-outlined text-base">{isSubmitting ? 'sync' : 'receipt_long'}</span>
                        {isSubmitting ? 'Processing...' : 'Finalize Order'}
                    </button>
                </div>
            </div>
        </div>
    );
}
