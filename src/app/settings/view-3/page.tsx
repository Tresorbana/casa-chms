'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Settings3() {
  return (
    <div className="flex-1 min-h-screen relative">
      

<nav className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
<div className="flex items-center gap-4">
<img alt="Casa Hotel Logo" className="h-10 object-contain" src="logo.png"/>
<div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
<h1 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-white">Admin Audit Log &amp; User Controls</h1>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
<span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
<span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin Privileges</span>
</div>
<button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" onClick={() => { document.documentElement.classList.toggle('dark') }}>
<span className="material-symbols-outlined dark:hidden">dark_mode</span>
<span className="material-symbols-outlined hidden dark:block">light_mode</span>
</button>
<div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
<div className="text-right hidden sm:block">
<p className="text-sm font-semibold">Super Admin</p>
<p className="text-xs text-slate-500 uppercase tracking-tighter font-bold">Root Access</p>
</div>
<div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    SA
                </div>
</div>
</div>
</nav>
<main className="max-w-7xl mx-auto p-6 space-y-8 ml-64 min-h-screen">
<div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 p-6"><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-center mr-2">Views:</span><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/settings">View 1</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" href="/settings/view-2">View 2</a><a className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap bg-primary text-white shadow-sm" href="/settings/view-3">View 3</a></div><header className="flex justify-between items-center mb-10 px-8 pt-8">
<div>
<h2 className="text-3xl font-bold text-slate-800 dark:text-white">System Oversight &amp; User Governance</h2>
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
<h2 className="text-2xl font-bold tracking-tight">System Oversight &amp; User Governance</h2>
<p className="text-slate-500 dark:text-slate-400">Manage multi-role accounts and monitor enterprise-wide activity logs.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all font-medium text-sm">
<span className="material-symbols-outlined text-lg">download</span>
                    Export Full Report
                </button>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-lg transition-all shadow-sm font-medium text-sm">
<span className="material-symbols-outlined text-lg">sync</span>
                    Refresh Data
                </button>
</div>
</div>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
<div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
<span className="material-symbols-outlined text-primary">group_add</span>
<h3 className="font-bold">User Management &amp; Role Creation</h3>
</div>
<div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Accounts: 12</div>
</div>
<div className="p-6">
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
<div className="space-y-1.5">
<label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
<input className="w-full filter-input py-2" placeholder="e.g. Robert Smith" type="text"/>
</div>
<div className="space-y-1.5">
<label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
<input className="w-full filter-input py-2" placeholder="email@casahotel.com" type="email"/>
</div>
<div className="space-y-1.5">
<label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assign Role</label>
<select className="w-full filter-input py-2">
<option value="">Select Role</option>
<option value="admin">Administrator</option>
<option value="receptionist">Receptionist</option>
<option value="restaurant">Restaurant Staff</option>
</select>
</div>
<button className="bg-secondary text-white py-2 px-4 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-lg">person_add</span>
                        Create Account
                    </button>
</div>
<div className="mt-8 overflow-hidden rounded-lg border border-slate-100 dark:border-slate-800">
<table className="w-full text-left text-sm">
<thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
<tr>
<th className="px-6 py-3">User Member</th>
<th className="px-6 py-3 text-center">Assigned Role</th>
<th className="px-6 py-3">Last Login</th>
<th className="px-6 py-3 text-right">Controls</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">ER</div>
<div>
<div className="font-semibold">Elena Rodriguez</div>
<div className="text-[11px] text-slate-400">elena.r@casahotel.com</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-center">
<span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-tight">Administrator</span>
</td>
<td className="px-6 py-4 text-slate-500 text-xs">Today, 08:42 AM</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-xl">manage_accounts</span></button>
<button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">no_accounts</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">MC</div>
<div>
<div className="font-semibold">Marcus Chen</div>
<div className="text-[11px] text-slate-400">m.chen@casahotel.com</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-center">
<span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase tracking-tight">Receptionist</span>
</td>
<td className="px-6 py-4 text-slate-500 text-xs">Yesterday, 11:15 PM</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-xl">manage_accounts</span></button>
<button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">no_accounts</span></button>
</div>
</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">JD</div>
<div>
<div className="font-semibold">Jean Dupont</div>
<div className="text-[11px] text-slate-400">j.dupont@casahotel.com</div>
</div>
</div>
</td>
<td className="px-6 py-4 text-center">
<span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-tight text-nowrap">Restaurant Staff</span>
</td>
<td className="px-6 py-4 text-slate-500 text-xs">2 days ago</td>
<td className="px-6 py-4 text-right">
<div className="flex justify-end gap-2">
<button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-xl">manage_accounts</span></button>
<button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-xl">no_accounts</span></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">history_edu</span>
<h3 className="font-bold">Enhanced Audit Log</h3>
</div>
</div>
<div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<div className="space-y-1.5">
<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filter by User Role</label>
<select className="w-full filter-input">
<option value="all">All Roles</option>
<option value="admin">Admin Only</option>
<option value="receptionist">Receptionist Only</option>
<option value="restaurant">Restaurant Only</option>
</select>
</div>
<div className="space-y-1.5">
<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Action Type</label>
<select className="w-full filter-input">
<option value="all">All Actions</option>
<option value="checkin">Check-in</option>
<option value="billing">Billing &amp; Refunds</option>
<option value="menuedit">Menu Edits</option>
<option value="statuschange">Status Changes</option>
<option value="security">Security Overrides</option>
</select>
</div>
<div className="space-y-1.5">
<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Range Start</label>
<input className="w-full filter-input" type="datetime-local"/>
</div>
<div className="space-y-1.5">
<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Range End</label>
<input className="w-full filter-input" type="datetime-local"/>
</div>
</div>
<div className="mt-4 flex flex-wrap items-center gap-4">
<div className="flex-1 relative">
<span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
<input className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg w-full focus:ring-primary focus:border-primary" placeholder="Search by Entity ID, IP Address, or specific action keywords..." type="text"/>
</div>
<button className="flex items-center gap-2 px-6 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm">
                        Apply Advanced Filters
                    </button>
<button className="text-xs font-bold text-slate-500 hover:text-primary uppercase tracking-wider">Reset</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left text-sm whitespace-nowrap">
<thead>
<tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[11px] tracking-widest font-bold">
<th className="px-6 py-3">Timestamp</th>
<th className="px-6 py-3">User (Role)</th>
<th className="px-6 py-3">Action</th>
<th className="px-6 py-3">Entity / ID</th>
<th className="px-6 py-3">IP Address</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[13px]">
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-25 09:15:22</td>
<td className="px-6 py-4">
<div className="font-sans font-medium">Elena Rodriguez</div>
<div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Admin</div>
</td>
<td className="px-6 py-4 font-sans">Updated VAT rate from 15% to 12%</td>
<td className="px-6 py-4"><span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">FIN-CONFIG</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.45</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-25 08:42:05</td>
<td className="px-6 py-4">
<div className="font-sans font-medium">Marcus Chen</div>
<div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Receptionist</div>
</td>
<td className="px-6 py-4 font-sans">Check-in Guest: Jonathan Wick</td>
<td className="px-6 py-4"><span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">BK-8821</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.102</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-25 07:30:11</td>
<td className="px-6 py-4">
<div className="font-sans font-medium">Jean Dupont</div>
<div className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter text-nowrap">Restaurant Staff</div>
</td>
<td className="px-6 py-4 font-sans">Menu Edit: Changed Price of 'Wagyu Steak'</td>
<td className="px-6 py-4"><span className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">MENU-402</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.201</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 18:22:45</td>
<td className="px-6 py-4">
<div className="font-sans font-medium">Marcus Chen</div>
<div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Receptionist</div>
</td>
<td className="px-6 py-4 font-sans">Status Change: Room #104 (Maintenance)</td>
<td className="px-6 py-4"><span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold">ROOM-104</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.102</td>
</tr>
<tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
<td className="px-6 py-4 text-slate-500">2023-11-24 16:10:55</td>
<td className="px-6 py-4">
<div className="font-sans font-medium">Elena Rodriguez</div>
<div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">Admin</div>
</td>
<td className="px-6 py-4 font-sans">Authorized Refund Override for Order #R-990</td>
<td className="px-6 py-4"><span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">SEC-AUTH</span></td>
<td className="px-6 py-4 text-slate-500">192.168.1.45</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
<p>Displaying entries for the last 24 hours (1,248 total events recorded)</p>
<div className="flex gap-2">
<button className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled={true}>Previous</button>
<button className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next Page</button>
</div>
</div>
</section>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
<section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
<div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">payments</span>
<h3 className="font-bold">Financial Controllers</h3>
</div>
</div>
<div className="p-6 space-y-6">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1.5">
<label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hotel VAT (%)</label>
<div className="relative">
<input className="w-full filter-input" type="number" value="12.00"/>
<span className="absolute right-4 top-2 text-slate-400 text-sm">%</span>
</div>
</div>
<div className="space-y-1.5">
<label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service Charge (%)</label>
<div className="relative">
<input className="w-full filter-input" type="number" value="5.00"/>
<span className="absolute right-4 top-2 text-slate-400 text-sm">%</span>
</div>
</div>
</div>
<div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between">
<div>
<p className="text-sm font-semibold">Front Desk Discounts</p>
<p className="text-[11px] text-slate-500">Allows receptionists to apply up to 10% promo</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked={true} className="sr-only peer" type="checkbox"/>
<div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
</label>
</div>
</div>
</section>
<section className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 p-6 flex flex-col justify-center">
<div className="flex gap-4">
<div className="bg-amber-100 dark:bg-amber-900/50 p-2 h-fit rounded-lg">
<span className="material-symbols-outlined text-amber-600">security_update_warning</span>
</div>
<div className="space-y-2">
<p className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">Critical System Notice</p>
<p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">Inventory management modules and warehouse logistical configurations have been migrated to the centralized Supply Chain Portal. Admin users can access that module via the "App Switcher" in the main dashboard.</p>
<button className="text-[11px] font-bold text-amber-700 dark:text-amber-300 underline underline-offset-4 hover:text-amber-600">Review System Migration Logs</button>
</div>
</div>
</section>
</div>
</main>
<footer className="mt-12 border-t border-slate-200 dark:border-slate-800 px-6 py-8">
<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
<div className="flex items-center gap-2">
<img alt="Casa Hotel Logo Small" className="h-6 opacity-60 grayscale h-10 object-contain" src="logo.png"/>
<p>© 2023 Casa Hotel Management System. Administrator Control Hub.</p>
</div>
<div className="flex gap-6 font-medium">
<a className="hover:text-primary transition-colors" href="#">Security Protocols</a>
<a className="hover:text-primary transition-colors" href="#">Admin Documentation</a>
<a className="hover:text-primary transition-colors" href="#">System Status</a>
</div>
</div>
</footer>

    </div>
  );
}
