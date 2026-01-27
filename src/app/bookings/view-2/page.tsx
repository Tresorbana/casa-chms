'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Bookings2() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/bookings">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/bookings/view-2">View 2</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">New Guest Registration</h2>
<p className="text-slate-500 mt-1">Manage your bookings here.</p>
</div>
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
<input className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-primary focus:border-primary text-sm w-64 transition-all" placeholder="Search..." type="text"/>
</div>
<button className="p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg relative transition-colors">
<span className="material-icons-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</div>
</header>
<div className="mb-8">
<h1 className="text-3xl font-bold text-slate-900 dark:text-white">Booking &amp; Additional Services</h1>
<p className="mt-2 text-slate-600 dark:text-slate-400">Complete the guest profile and select reservation preferences to secure a booking.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
<div className="lg:col-span-7 space-y-8">
<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-secondary font-semibold">
<span className="material-symbols-outlined">person_add</span>
<h2>New Guest Registration</h2>
</div>
<div className="p-6">
<form className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. John Doe" type="text"/>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="+1 (555) 000-0000" type="tel"/>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="john.doe@example.com" type="email"/>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">ID / Passport Number</label>
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="A12345678" type="text"/>
</div>
<div className="space-y-1 md:col-span-2">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nationality</label>
<select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all">
<option value="">Select a country</option>
<option value="US">United States</option>
<option value="UK">United Kingdom</option>
<option value="KE">Kenya</option>
<option value="CA">Canada</option>
<option value="DE">Germany</option>
</select>
</div>
<div className="space-y-1 md:col-span-2">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Permanent Address</label>
<textarea className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="Street, City, Postcode, Country" rows={3}></textarea>
</div>
</div>
</form>
</div>
</div>
<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-secondary font-semibold">
<span className="material-symbols-outlined">add_to_photos</span>
<h2>Additional Services</h2>
</div>
<div className="p-6">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<label className="flex items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
<input className="h-5 w-5 text-secondary border-slate-300 rounded focus:ring-secondary transition-all" type="checkbox"/>
<div className="ml-4 flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Laundry Service</span>
<span className="text-sm font-medium text-secondary">KES 1,200</span>
</div>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full wash and press service</p>
</div>
</label>
<label className="flex items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
<input className="h-5 w-5 text-secondary border-slate-300 rounded focus:ring-secondary transition-all" type="checkbox"/>
<div className="ml-4 flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Wellness &amp; Spa</span>
<span className="text-sm font-medium text-secondary">KES 4,500</span>
</div>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Access to sauna and 1hr massage</p>
</div>
</label>
<label className="flex items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
<input className="h-5 w-5 text-secondary border-slate-300 rounded focus:ring-secondary transition-all" type="checkbox"/>
<div className="ml-4 flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Airport Transport</span>
<span className="text-sm font-medium text-secondary">KES 3,000</span>
</div>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Private shuttle to/from JKIA</p>
</div>
</label>
<label className="flex items-center p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
<input className="h-5 w-5 text-secondary border-slate-300 rounded focus:ring-secondary transition-all" type="checkbox"/>
<div className="ml-4 flex-1">
<div className="flex items-center justify-between">
<span className="text-sm font-semibold text-slate-900 dark:text-white">Car Wash</span>
<span className="text-sm font-medium text-secondary">KES 800</span>
</div>
<p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Full exterior and interior cleaning</p>
</div>
</label>
</div>
</div>
</div>
</div>
<div className="lg:col-span-5 space-y-8">
<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
<div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 text-primary font-semibold">
<span className="material-icons">event</span>
<h2>Reservation Details</h2>
</div>
<div className="p-6">
<div className="space-y-6">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Check-in Date</label>
<div className="relative">
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all pl-10" type="date"/>
<span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
</div>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Check-out Date</label>
<div className="relative">
<input className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all pl-10" type="date"/>
<span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
</div>
</div>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Room Type</label>
<select className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all">
<option value="">Select Room Category</option>
<option value="standard">Standard Single (KES 4,500/night)</option>
<option value="double">Deluxe Double (KES 7,500/night)</option>
<option value="suite">Executive Suite (KES 12,000/night)</option>
<option value="family">Family Room (KES 15,000/night)</option>
</select>
</div>
<div className="space-y-1">
<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Special Requests</label>
<textarea className="w-full rounded-md border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary focus:border-primary transition-all" placeholder="e.g. Late check-in, dietary requirements, airport pick-up..." rows={4}></textarea>
</div>
<div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
<div className="flex justify-between items-center text-sm">
<span className="text-slate-500">Room Subtotal</span>
<span className="text-slate-700 dark:text-slate-300">KES 0.00</span>
</div>
<div className="flex justify-between items-center text-sm">
<span className="text-slate-500">Additional Services</span>
<span className="text-slate-700 dark:text-slate-300">KES 0.00</span>
</div>
<div className="flex justify-between items-center pt-2">
<span className="text-slate-900 dark:text-white font-bold">Estimated Total</span>
<span className="text-2xl font-bold text-primary">KES 0.00</span>
</div>
<div className="pt-4 space-y-3">
<button className="w-full bg-primary hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
<span className="material-icons">bookmark_add</span>
                                    Book Room
                                </button>
<button className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" type="button">
                                    Save Draft
                                </button>
</div>
</div>
</div>
</div>
</div>
<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3">
<span className="material-icons text-amber-500">info</span>
<p className="text-sm text-amber-800 dark:text-amber-200">
<span className="font-bold">Pro Tip:</span> Guests with corporate accounts receive a 10% discount automatically upon email verification.
                </p>
</div>
</div>
</div>
<footer className="mt-12 text-center text-slate-500 dark:text-slate-400 text-sm pb-8">
<p>© 2024 Casa Hotel. All rights reserved. Powered by Casa Hotel Management System v2.4</p>
</footer>
</main>

<div className="fixed bottom-8 right-8 z-50">
<button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all" onClick={() => { openModal('New Entry', '<p>Add new entry form goes here.</p>', () => {}) }}>
<span className="material-icons-outlined text-2xl">add</span>
</button>
</div>

    </div>
  );
}
