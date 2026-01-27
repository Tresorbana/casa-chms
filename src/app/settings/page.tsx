'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';

export default function Settings1() {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                }
            });

        fetch('/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                }
            });
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    const getUserInitials = (name: string) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="flex-1 min-h-screen relative">


            <TopBar
                title="Security & Control Center"
                description="Manage staff access, financial configurations, and monitor system activity logs."
                actions={
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md" onClick={() => { /* openAddUserModal() */ }}>
                        <span className="material-icons-outlined text-sm">person_add</span>
                        Create User
                    </button>
                }
            />
            <main className="p-4 lg:p-6 space-y-8 min-h-screen">
                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-slate-500 dark:text-slate-400">Manage staff access, financial configurations, and monitor activity.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export Log
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 rounded-lg transition-all shadow-sm">
                            <span className="material-symbols-outlined text-lg">save</span>
                            Save Changes
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">group</span>
                                    <h3 className="font-bold">User Management</h3>
                                </div>
                                <button className="text-sm font-medium text-secondary hover:underline flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">add_circle</span> Add Staff Account
                                </button>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[11px] tracking-widest font-bold">
                                            <th className="px-6 py-3">User &amp; Staff ID</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {users.map((u: any) => (
                                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold">{u.name}</div>
                                                    <div className="text-xs text-slate-500">{u.id.substring(0, 8).toUpperCase()} • {u.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 ${u.role === 'ADMIN' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'} rounded text-xs font-bold uppercase`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-secondary">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                                        Active
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-1 hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                                    <button className="p-1 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    <h3 className="font-bold">Tax &amp; Discount</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">VAT Rate (%)</label>
                                    <div className="relative">
                                        <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" type="number" value="15.00" readOnly />
                                        <span className="absolute right-4 top-2.5 text-slate-400">%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Charge (%)</label>
                                    <div className="relative">
                                        <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" type="number" value="5.00" readOnly />
                                        <span className="absolute right-4 top-2.5 text-slate-400">%</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">Enable Seasonal Discount</span>
                                            <span className="text-[10px] text-slate-500">Current: 10% Winter Promo</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input defaultChecked={true} className="sr-only peer" type="checkbox" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-900/40">
                                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                    <span className="material-symbols-outlined">warning</span>
                                    <span className="text-sm font-bold uppercase tracking-tight">Security Alert</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">You have <strong>3 failed login attempts</strong> from an unrecognized IP in the last 24 hours.</p>
                                <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors">REVIEW INCIDENTS</button>
                            </div>
                        </section>
                    </div>
                </div>
                <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h3 className="font-bold">Audit Log Viewer</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-lg">search</span>
                                <input className="pl-10 pr-4 py-1.5 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg w-full sm:w-64 focus:ring-primary focus:border-primary" placeholder="Search logs..." type="text" />
                            </div>
                            <select className="text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-lg py-1.5 focus:ring-primary focus:border-primary">
                                <option>All Actions</option>
                                <option>Logins</option>
                                <option>Settings Update</option>
                                <option>Data Export</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 uppercase text-[11px] tracking-widest font-bold">
                                    <th className="px-6 py-3">Timestamp</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Action Description</th>
                                    <th className="px-6 py-3">Module</th>
                                    <th className="px-6 py-3">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[13px]">
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-6 py-4 text-slate-500">2023-11-24 14:23:05</td>
                                    <td className="px-6 py-4 font-sans font-medium">Elena Rodriguez</td>
                                    <td className="px-6 py-4">Updated VAT rate from 14.0% to 15.0%</td>
                                    <td className="px-6 py-4"><span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">SETTINGS</span></td>
                                    <td className="px-6 py-4 text-slate-500">192.168.1.45</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-6 py-4 text-slate-500">2023-11-24 13:45:12</td>
                                    <td className="px-6 py-4 font-sans font-medium">Marcus Chen</td>
                                    <td className="px-6 py-4">Checked out Room #204 - Folio #9821</td>
                                    <td className="px-6 py-4"><span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">FRONT DESK</span></td>
                                    <td className="px-6 py-4 text-slate-500">192.168.1.102</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-6 py-4 text-slate-500">2023-11-24 12:10:55</td>
                                    <td className="px-6 py-4 font-sans font-medium">Elena Rodriguez</td>
                                    <td className="px-6 py-4">User 'Sarah Jenkins' marked as Inactive</td>
                                    <td className="px-6 py-4"><span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">SECURITY</span></td>
                                    <td className="px-6 py-4 text-slate-500">192.168.1.45</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-6 py-4 text-slate-500">2023-11-24 11:30:22</td>
                                    <td className="px-6 py-4 font-sans font-medium">System Admin</td>
                                    <td className="px-6 py-4">Weekly Sales Report exported as PDF</td>
                                    <td className="px-6 py-4"><span className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">REPORTING</span></td>
                                    <td className="px-6 py-4 text-slate-500">Localhost</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <p>Showing 1-4 of 1,245 log entries</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled={true}>Previous</button>
                            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 px-6 py-8">
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-2">
                        <img alt="Casa Hotel Logo Small" className="h-6 opacity-60 grayscale h-10 object-contain" src="logo.png" />
                        <p>© 2024 Casa Hotel Management System. All rights reserved.</p>
                    </div>
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">Support Portal</a>
                    </div>
                </div>
            </footer>

        </div >
    );
}
