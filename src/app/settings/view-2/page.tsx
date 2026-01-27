'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Settings2() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
<div className="flex items-center gap-4">
<img alt="Casa Hotel Logo" className="h-10 object-contain" src="logo.png"/>
<div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
<h1 className="text-lg font-semibold tracking-tight">Receptionist System Settings</h1>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
<span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">System Secure</span>
</div>
<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-symbols-outlined dark:hidden">dark_mode</span>
<span className="material-symbols-outlined hidden dark:block">light_mode</span>
</button>
<div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold">Admin User</p>
<p className="text-xs text-slate-500">Super Administrator</p>
</div>
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                AU
            </div>
</div>
</div>
</nav>
<main className="max-w-7xl mx-auto p-6 space-y-8 ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/settings">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/settings/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/settings/view-3">View 3</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">Access &amp; Financial Controls</h2>
<p className="text-slate-500 mt-1">Manage your settings here.</p>
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
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
<div>
<h2 className="text-2xl font-bold">Access &amp; Financial Controls</h2>
<p className="text-slate-500 dark:text-slate-400">Configure front-desk permissions, VAT rates, and monitor receptionist operational logs.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
<span className="material-symbols-outlined text-lg">download</span>
                Export Logs
            </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-lg transition-all shadow-sm">
<span className="material-symbols-outlined text-lg">save</span>
                Save Configuration
            </button>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2 space-y-6">
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">person_search</span>
<h3 className="font-bold">Staff Access Management</h3>
</div>
<button className="text-sm font-medium text-secondary hover:underline flex items-center gap-1">
<span className="material-symbols-outlined text-sm">person_add</span> Create New Account
                    </button>
</div>
<div className="p-0">
<table className="w-full text-left text-sm">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[11px] tracking-widest font-bold">
<th className="px-6 py-3">Staff Member</th>
<th className="px-6 py-3">Role Identity</th>
<th className="px-6 py-3">Access Status</th>
<th className="px-6 py-3 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4">
<div className="font-semibold">Elena Rodriguez</div>
<div className="text-xs text-slate-500">CH-4059 • elena.r@casahotel.com</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded text-xs font-bold uppercase">Administrator</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-1.5 text-secondary font-medium">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
                                    Active Access
                                </div>
</td>
<td className="px-6 py-4 text-right">
<button className="p-1 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
<button className="p-1 hover:text-red-500"><span className="material-symbols-outlined">lock_reset</span></button>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4">
<div className="font-semibold">Marcus Chen</div>
<div className="text-xs text-slate-500">CH-4102 • m.chen@casahotel.com</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 rounded text-xs font-bold uppercase">Receptionist</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-1.5 text-secondary font-medium">
<div className="w-2 h-2 rounded-full bg-secondary"></div>
                                    Active Access
                                </div>
</td>
<td className="px-6 py-4 text-right">
<button className="p-1 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
<button className="p-1 hover:text-red-500"><span className="material-symbols-outlined">lock_reset</span></button>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
<div className="space-y-6">
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">receipt_long</span>
<h3 className="font-bold">Tax &amp; Discount Rules</h3>
</div>
</div>
<div className="p-6 space-y-4">
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">VAT Rate (%)</label>
<div className="relative">
<input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" type="number" value="15.00"/>
<span className="absolute right-4 top-2.5 text-slate-400">%</span>
</div>
<p className="text-[10px] text-slate-400">Applies to all booking and restaurant folios.</p>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Service Charge (%)</label>
<div className="relative">
<input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" type="number" value="5.00"/>
<span className="absolute right-4 top-2.5 text-slate-400">%</span>
</div>
</div>
<div className="pt-2">
<div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
<div className="flex flex-col">
<span className="text-sm font-semibold">Enable Front Desk Discounts</span>
<span className="text-[10px] text-slate-500">Allow receptionists to apply promos</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked={true} className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
</label>
</div>
</div>
</div>
</section>
<section className="bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
<div className="flex gap-3">
<span className="material-symbols-outlined text-blue-500">info</span>
<div className="space-y-1">
<p className="text-sm font-bold text-blue-900 dark:text-blue-300">Policy Update</p>
<p className="text-xs text-blue-700 dark:text-blue-400">Inventory management tools have been moved to the Warehouse Management System.</p>
</div>
</div>
</section>
</div>
</div>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">clinical_notes</span>
<h3 className="font-bold">Receptionist Audit Log</h3>
</div>
<div className="flex items-center gap-3">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
<input className="pl-10 pr-4 py-1.5 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg w-full sm:w-64 focus:ring-primary focus:border-primary" placeholder="Filter by receptionist or action..." type="text"/>
</div>
<select className="text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg py-1.5 focus:ring-primary focus:border-primary">
<option>Receptionist Actions</option>
<option>Billing &amp; Payments</option>
<option>Guest Data Edits</option>
<option>Room Status Changes</option>
<option>Admin Overrides</option>
</select>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left text-sm whitespace-nowrap">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[11px] tracking-widest font-bold">
<th className="px-6 py-3">Timestamp</th>
<th className="px-6 py-3">Receptionist / Admin</th>
<th className="px-6 py-3">Operational Action</th>
<th className="px-6 py-3">Target / Entity</th>
<th className="px-6 py-3">Network IP</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[13px]">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 16:45:12</td>
<td className="px-6 py-4 font-sans font-medium">Marcus Chen</td>
<td className="px-6 py-4">Processed Checkout &amp; Applied 5% Senior Discount</td>
<td className="px-6 py-4"><span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">BILLING</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.102</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 16:30:05</td>
<td className="px-6 py-4 font-sans font-medium">Marcus Chen</td>
<td className="px-6 py-4">Modified Room Status: #302 (Clean to Occupied)</td>
<td className="px-6 py-4"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">ROOM OPS</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.102</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 15:10:55</td>
<td className="px-6 py-4 font-sans font-medium">Elena Rodriguez</td>
<td className="px-6 py-4">Updated Guest Profile: Jane Doe (Email Correction)</td>
<td className="px-6 py-4"><span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">GUEST DATA</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.45</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 14:00:22</td>
<td className="px-6 py-4 font-sans font-medium">Marcus Chen</td>
<td className="px-6 py-4">Issued Refund for Restaurant Folio #R-2931</td>
<td className="px-6 py-4"><span className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">RESTAURANT</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.102</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
<p>Showing 1-4 of 892 operations logged today</p>
<div className="flex gap-2">
<button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled={true}>Previous</button>
<button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
</div>
</div>
</section>
</main>
<footer className="mt-12 border-t border-slate-200 dark:border-slate-800 px-6 py-8">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
<div className="flex items-center gap-2">
<img alt="Casa Hotel Logo Small" className="h-6 opacity-60 grayscale h-10 object-contain" src="logo.png"/>
<p>© 2023 Casa Hotel Management System. Front Desk Module.</p>
</div>
<div className="flex gap-6">
<a className="hover:text-primary transition-colors" href="#">Security Policy</a>
<a className="hover:text-primary transition-colors" href="#">Receptionist Guide</a>
<a className="hover:text-primary transition-colors" href="#">Support</a>
</div>
</div>
</footer>

    </div>
  );
}
