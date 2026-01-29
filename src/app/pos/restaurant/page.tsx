'use client';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';

export default function PosRestaurant1() {
    const { data: menuItems, error } = useSWR('/api/pos/menu', fetcher);
    const [orderType, setOrderType] = useState('resident');
    const [cart, setCart] = useState<any[]>([]);
    const [residentRoom, setResidentRoom] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // Mobile cart toggle
    const router = useRouter();

    const switchType = (type: string) => {
        setOrderType(type);
    };

    const addToCart = (item: any) => {
        setCart([...cart, item]);
    };

    const handleFinalize = async () => {
        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        setIsSubmitting(true);
        try {
            const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            const total = subtotal * 1.18;

            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guestName: orderType === 'resident' ? `Room ${residentRoom}` : 'Walk-in Guest',
                    amount: total,
                    status: 'PENDING',
                    items: cart.map(item => ({
                        description: item.name,
                        quantity: 1, // Simplifying for now, we'd need a qty count in cart for real use
                        price: item.price
                    }))
                })
            });

            if (res.ok) {
                const invoice = await res.json();
                router.push(`/invoice/restaurant?id=${invoice.id}`);
            } else {
                alert('Failed to create invoice');
            }
        } catch (err) {
            alert('Error creating invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen relative flex flex-col lg:flex-row bg-cornsilk/10 dark:bg-slate-950">
            <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
                <div className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden">
                    <TopBar
                        title="Restaurant POS"
                        description="Professional Point of Sale for Casa Hotel Restaurant & Bar."
                        actions={
                            <button
                                className="lg:hidden relative p-2 bg-primary text-white rounded-xl shadow-lg"
                                onClick={() => setIsCartOpen(!isCartOpen)}
                            >
                                <span className="material-icons-outlined">shopping_cart</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                                        {cart.length}
                                    </span>
                                )}
                            </button>
                        }
                    />
                    <section className="flex-1 flex flex-col p-2 lg:p-6 overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex p-1 bg-white dark:bg-slate-800 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-700">
                                <button
                                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${orderType === 'resident' ? 'bg-olive-leaf text-white shadow-md' : 'text-slate-500 hover:text-olive-leaf'}`}
                                    onClick={() => switchType('resident')}
                                >
                                    Resident
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${orderType === 'walkin' ? 'bg-olive-leaf text-white shadow-md' : 'text-slate-500 hover:text-olive-leaf'}`}
                                    onClick={() => switchType('walkin')}
                                >
                                    Walk-in
                                </button>
                            </div>
                            {orderType === 'resident' && (
                                <div className="relative flex-1 max-w-sm">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">meeting_room</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-olive-leaf outline-none dark:text-white shadow-sm"
                                        placeholder="Room Number (e.g. 402)..."
                                        type="text"
                                        value={residentRoom}
                                        onChange={(e) => setResidentRoom(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="relative flex-1">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-olive-leaf outline-none dark:text-white shadow-sm" placeholder="Search menu items..." type="text" />
                            </div>
                        </div>

                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                            <button className="px-5 py-2 rounded-full bg-black-forest text-cornsilk text-sm font-bold shadow-md whitespace-nowrap">All Items</button>
                            {["Appetizers", "Main Course", "Wine & Spirits", "Cocktails", "Desserts"].map(cat => (
                                <button key={cat} className="px-5 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold whitespace-nowrap hover:border-olive-leaf hover:text-olive-leaf transition-colors text-slate-600 dark:text-slate-300">
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pr-2 pb-20 lg:pb-0">
                            {menuItems && Array.isArray(menuItems) ? menuItems.map((item: any) => (
                                <button key={item.id} className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-left" onClick={() => addToCart(item)}>
                                    <div className="h-32 w-full bg-cornsilk/30 dark:bg-slate-800 flex items-center justify-center group-hover:bg-cornsilk/50 transition-colors">
                                        <span className="material-icons text-5xl text-olive-leaf/40">restaurant_menu</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-olive-leaf transition-colors line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-slate-500 mt-1 mb-3">{item.category}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-copper font-black">RWF {item.price.toLocaleString()}</span>
                                            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-olive-leaf group-hover:text-white transition-all shadow-sm">
                                                <span className="material-icons-round text-sm">add</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )) : (
                                <div className="p-12 text-center col-span-full text-slate-400 flex flex-col items-center gap-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-leaf"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest">Loading menu...</span>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Mobile Cart Overlay */}
                {isCartOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCartOpen(false)}></div>
                )}

                <div className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 lg:relative lg:transform-none lg:w-96 border-l border-slate-100 dark:border-slate-800 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-xl italic text-slate-800 dark:text-white">Current Order</h3>
                            <button className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-wider" onClick={() => setCart([])}>Clear All</button>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                <p className="font-bold text-sm capitalize text-olive-leaf">{orderType}</p>
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                <p className="font-bold text-sm text-slate-800 dark:text-white">{orderType === 'resident' ? residentRoom || '---' : 'Walk-in'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center text-slate-400 py-20 flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                    <span className="material-icons-outlined text-4xl opacity-50">shopping_cart</span>
                                </div>
                                <p className="font-bold">Cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <div key={index} className="flex gap-3 group">
                                    <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                                        <span className="material-icons text-slate-300">restaurant</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm truncate text-slate-800 dark:text-white pr-2">{item.name}</h4>
                                            <p className="font-black text-sm text-copper whitespace-nowrap">{item.price.toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-2 truncate">{item.category}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-1 border border-slate-100 dark:border-slate-700">
                                                <button className="w-5 h-5 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded transition-colors shadow-sm">
                                                    <span className="material-icons-round text-[10px]">remove</span>
                                                </button>
                                                <span className="text-xs font-bold w-3 text-center">1</span>
                                                <button className="w-5 h-5 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded transition-colors shadow-sm">
                                                    <span className="material-icons-round text-[10px]">add</span>
                                                </button>
                                            </div>
                                            <button className="text-slate-300 hover:text-red-500 transition-colors p-1" onClick={() => setCart(cart.filter((_, i) => i !== index))}>
                                                <span className="material-icons-round text-lg">delete_outline</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>RWF {cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                <span>Tax (18% VAT)</span>
                                <span>RWF {(cart.reduce((sum, item) => sum + item.price, 0) * 0.18).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white items-baseline">
                                <span className="text-sm uppercase tracking-widest text-olive-leaf">Total</span>
                                <span className="text-2xl">RWF {(cart.reduce((sum, item) => sum + item.price, 0) * 1.18).toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            className="w-full bg-olive-leaf hover:bg-black-forest text-white font-bold py-4 rounded-2xl shadow-xl shadow-olive-leaf/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none transform active:scale-[0.98]"
                            onClick={handleFinalize}
                            disabled={isSubmitting || cart.length === 0}
                        >
                            <span className="material-icons-round">{isSubmitting ? 'sync' : 'receipt_long'}</span>
                            {isSubmitting ? 'Processing...' : 'Finalize Order'}
                        </button>
                    </div>
                </div>
            </main>
        </div >
    );
}
