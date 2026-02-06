'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import TopBar from '@/components/TopBar';
import * as XLSX from 'xlsx';

const REPORT_TYPES = [
  { id: 'OCCUPANCY', label: 'Occupancy Report', category: 'ROOMS' },
  { id: 'REVENUE_ROOMS', label: 'Room Revenue', category: 'ROOMS' },
  { id: 'ADR', label: 'Avg Daily Rate (ADR)', category: 'ROOMS' },
  { id: 'REVPAR', label: 'RevPAR', category: 'ROOMS' },
  { id: 'RESERVATIONS', label: 'Reservations & Cancellations', category: 'ROOMS' },
  { id: 'BOOKING_SOURCE', label: 'Booking Source', category: 'ROOMS' },
  { id: 'GUEST_STAY', label: 'Guest Stay Report', category: 'ROOMS' },
  { id: 'RESTAURANT_SALES', label: 'Restaurant Sales', category: 'DINING' },
  { id: 'MENU_PERFORMANCE', label: 'Menu Item Performance', category: 'DINING' },
  { id: 'RESTAURANT_ORDERS', label: 'Order Report', category: 'DINING' },
  { id: 'EXTRA_SERVICES', label: 'Extra Services Usage', category: 'SERVICES' },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { data, isLoading } = useSWR(
    `/api/reports/detailed?type=${selectedReport.id}&start=${dateRange.start}&end=${dateRange.end}`,
    fetcher
  );

  const handleExport = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    // Flatten data for export if necessary
    const cheatSheet = XLSX.utils.json_to_sheet(Array.isArray(data.records) ? data.records : [data]);
    XLSX.utils.book_append_sheet(wb, cheatSheet, "Report");
    XLSX.writeFile(wb, `${selectedReport.label}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
      <TopBar
        title="Advanced Reporting"
        description="Comprehensive business and operational reports."
        actions={
          <button
            onClick={handleExport}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-icons-outlined text-lg">download</span>
            Export Excel
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          {['ROOMS', 'DINING', 'SERVICES'].map(category => (
            <div key={category}>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">{category}</h3>
              <div className="space-y-1">
                {REPORT_TYPES.filter(r => r.category === category).map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedReport.id === report.id
                      ? 'bg-white text-primary shadow-md ring-1 ring-slate-200'
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                      }`}
                  >
                    {report.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-800">{selectedReport.label}</h2>
              <p className="text-sm font-medium text-slate-500">View and analyze {selectedReport.label.toLowerCase()} data.</p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Generating Report...</div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedReport.id === 'OCCUPANCY' && (
                  <>
                    <StatCard label="Occupancy Rate" value={`${data?.occupancyRate?.toFixed(1) || 0}%`} icon="pie_chart" color="primary" />
                    <StatCard label="Occupied Rooms" value={data?.occupied || 0} icon="bed" color="secondary" />
                    <StatCard label="Vacant Rooms" value={data?.vacant || 0} icon="meeting_room" color="slate" />
                  </>
                )}
                {(selectedReport.id === 'REVENUE_ROOMS' || selectedReport.id === 'RESTAURANT_SALES') && (
                  <StatCard label="Total Revenue" value={`RWF ${(data?.totalRevenue || data?.totalSales || 0).toLocaleString()}`} icon="payments" color="primary" />
                )}
                {selectedReport.id === 'ADR' && (
                  <>
                    <StatCard label="ADR" value={`RWF ${(data?.adr || 0).toLocaleString()}`} icon="trending_up" color="primary" />
                    <StatCard label="Rooms Sold" value={data?.roomsSold || 0} icon="sell" color="secondary" />
                  </>
                )}
                {selectedReport.id === 'REVPAR' && (
                  <>
                    <StatCard label="RevPAR" value={`RWF ${(data?.revPar || 0).toLocaleString()}`} icon="waterfall_chart" color="primary" />
                    <StatCard label="Available Rooms" value={data?.totalRooms || 0} icon="apartment" color="slate" />
                  </>
                )}
              </div>

              {/* Data Table */}
              {data?.records && Array.isArray(data.records) && data.records.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                        <th className="p-4">Reference</th>
                        <th className="p-4">Details</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.records.map((rec: any) => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="p-4 font-mono text-xs text-slate-400">#{rec.id.slice(-6).toUpperCase()}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{rec.room?.type} {rec.room?.number}</div>
                            <div className="text-xs text-slate-400">Booking Revenue</div>
                          </td>
                          <td className="p-4 text-right font-black text-slate-700">
                            RWF {rec.totalAmount?.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-xs text-slate-500">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Booking Sources / Breakdown */}
              {(data?.breakdown || data?.sources) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-2xl p-6">
                    <h3 className="font-bold mb-4">Breakdown</h3>
                    <div className="space-y-3">
                      {(data.breakdown || data.sources).map((item: any) => (
                        <div key={item.type || item.source} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="font-bold text-sm text-slate-600">{item.type || item.source}</span>
                          <span className="font-black text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200">
                            {item._count?.id || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!data || Object.keys(data).length === 0) && (
                <div className="text-center py-20 text-slate-400 italic">No data available for this report type.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: 'primary' | 'secondary' | 'slate' }) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color === 'primary' ? 'bg-primary shadow-primary/20' : color === 'secondary' ? 'bg-secondary shadow-secondary/20' : 'bg-slate-500 shadow-slate-500/20'}`}>
        <span className="material-icons-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
