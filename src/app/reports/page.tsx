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

  const { data, isLoading, error } = useSWR(
    `/api/reports/detailed?type=${selectedReport.id}&start=${dateRange.start}&end=${dateRange.end}`,
    fetcher
  );

  const handleExport = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    const exportData = Array.isArray(data.records) && data.records.length > 0
      ? data.records
      : Array.isArray(data.breakdown) && data.breakdown.length > 0
        ? data.breakdown
        : Array.isArray(data.sources) && data.sources.length > 0
          ? data.sources
          : [data];
    const sheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, sheet, 'Report');
    XLSX.writeFile(wb, `${selectedReport.label}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const hasRecords = data?.records && Array.isArray(data.records) && data.records.length > 0;
  const hasBreakdown = data?.breakdown && Array.isArray(data.breakdown) && data.breakdown.length > 0;
  const hasSources = data?.sources && Array.isArray(data.sources) && data.sources.length > 0;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 p-4 lg:p-8 flex flex-col gap-8">
      <TopBar
        title="Advanced Reporting"
        description="Comprehensive business and operational reports."
        actions={
          <button
            onClick={handleExport}
            disabled={!data}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
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
            <div className="flex gap-2 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">From</label>
                <input
                  type="date"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                  value={dateRange.start}
                  onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">To</label>
                <input
                  type="date"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                  value={dateRange.end}
                  onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="py-20 text-center text-red-400 font-bold">
              <span className="material-icons-outlined text-4xl block mb-3">error_outline</span>
              Failed to load report data. Please try again.
            </div>
          ) : isLoading ? (
            <div className="py-20 text-center text-slate-400 font-bold animate-pulse">
              <span className="material-icons-outlined text-4xl block mb-3 animate-spin">refresh</span>
              Generating Report...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedReport.id === 'OCCUPANCY' && (
                  <>
                    <StatCard label="Occupancy Rate" value={`${(data?.occupancyRate || 0).toFixed(1)}%`} icon="pie_chart" color="primary" />
                    <StatCard label="Occupied Rooms" value={data?.occupied || 0} icon="bed" color="secondary" />
                    <StatCard label="Vacant Rooms" value={data?.vacant || 0} icon="meeting_room" color="slate" />
                  </>
                )}
                {selectedReport.id === 'REVENUE_ROOMS' && (
                  <StatCard label="Total Room Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" color="primary" />
                )}
                {selectedReport.id === 'ADR' && (
                  <>
                    <StatCard label="Avg Daily Rate (ADR)" value={`RWF ${Math.round(data?.adr || 0).toLocaleString()}`} icon="trending_up" color="primary" />
                    <StatCard label="Rooms Sold" value={data?.roomsSold || 0} icon="sell" color="secondary" />
                    <StatCard label="Total Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" color="slate" />
                  </>
                )}
                {selectedReport.id === 'REVPAR' && (
                  <>
                    <StatCard label="RevPAR" value={`RWF ${Math.round(data?.revPar || 0).toLocaleString()}`} icon="waterfall_chart" color="primary" />
                    <StatCard label="Available Rooms" value={data?.totalRooms || 0} icon="apartment" color="secondary" />
                    <StatCard label="Total Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" color="slate" />
                  </>
                )}
                {selectedReport.id === 'RESERVATIONS' && (
                  <StatCard
                    label="Total Status Groups"
                    value={data?.breakdown?.length || 0}
                    icon="assignment"
                    color="primary"
                  />
                )}
                {selectedReport.id === 'BOOKING_SOURCE' && (
                  <StatCard
                    label="Booking Channels"
                    value={data?.sources?.length || 0}
                    icon="source"
                    color="primary"
                  />
                )}
                {selectedReport.id === 'GUEST_STAY' && (
                  <StatCard label="Checked-Out Stays" value={data?.records?.length || 0} icon="luggage" color="primary" />
                )}
                {selectedReport.id === 'RESTAURANT_SALES' && (
                  <>
                    <StatCard label="Total Sales" value={`RWF ${(data?.totalSales || 0).toLocaleString()}`} icon="restaurant" color="primary" />
                    <StatCard label="Transactions" value={data?.records?.length || 0} icon="receipt" color="secondary" />
                  </>
                )}
                {selectedReport.id === 'MENU_PERFORMANCE' && (
                  <StatCard label="Menu Items Tracked" value={data?.records?.length || 0} icon="menu_book" color="primary" />
                )}
                {selectedReport.id === 'RESTAURANT_ORDERS' && (
                  <StatCard label="Total Orders" value={data?.totalOrders || 0} icon="shopping_bag" color="primary" />
                )}
                {selectedReport.id === 'EXTRA_SERVICES' && (
                  <StatCard label="Service Charges" value={data?.records?.length || 0} icon="spa" color="primary" />
                )}
              </div>

              {/* Breakdown / Sources Panel */}
              {(hasBreakdown || hasSources) && (
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">
                      {hasBreakdown ? 'Status Breakdown' : 'Booking Sources'}
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {(data.breakdown || data.sources || []).map((item: any, i: number) => {
                      const label = item.type || item.source || item.status || `Item ${i + 1}`;
                      const count = item._count?.id ?? 0;
                      const total = (data.breakdown || data.sources || []).reduce((sum: number, x: any) => sum + (x._count?.id ?? 0), 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">{i + 1}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-sm text-slate-700 uppercase tracking-wide">{label}</span>
                              <span className="font-black text-slate-800 text-sm">{count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Data Table */}
              {hasRecords && (
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">Records</h3>
                    <span className="text-xs font-bold text-slate-400">{data.records.length} entries</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                        <tr>
                          <th className="p-4">Ref</th>
                          <th className="p-4">Details</th>
                          <th className="p-4 text-right">Amount</th>
                          <th className="p-4 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.records.map((rec: any, idx: number) => {
                          const refStr = typeof rec.id === 'string' && rec.id.length > 6
                            ? `#${rec.id.slice(-6).toUpperCase()}`
                            : `#${String(idx + 1).padStart(4, '0')}`;
                          const detailTitle = rec.details || `${rec.room?.type || ''} ${rec.room?.number || ''}`.trim() || '–';
                          const detailSub = rec.room?.type && !rec.details ? 'Booking Revenue' : rec.room?.type ? rec.room.type : '';
                          return (
                            <tr key={rec.id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-mono text-xs text-slate-400">{refStr}</td>
                              <td className="p-4">
                                <div className="font-bold text-slate-800">{detailTitle}</div>
                                {detailSub && detailSub !== detailTitle && (
                                  <div className="text-xs text-slate-400">{detailSub}</div>
                                )}
                              </td>
                              <td className="p-4 text-right font-black text-slate-700">
                                {rec.totalAmount != null ? `RWF ${rec.totalAmount.toLocaleString()}` : '–'}
                                {rec.quantity != null && (
                                  <div className="text-xs text-slate-400 font-normal">Qty: {rec.quantity}</div>
                                )}
                              </td>
                              <td className="p-4 text-right text-xs text-slate-500">
                                {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : '–'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!hasRecords && !hasBreakdown && !hasSources &&
                selectedReport.id !== 'RESTAURANT_ORDERS' &&
                selectedReport.id !== 'OCCUPANCY' &&
                selectedReport.id !== 'ADR' &&
                selectedReport.id !== 'REVPAR' &&
                selectedReport.id !== 'REVENUE_ROOMS' &&
                selectedReport.id !== 'RESTAURANT_SALES' && (
                  <div className="text-center py-20 text-slate-400 italic">
                    <span className="material-icons-outlined text-4xl block mb-3 opacity-30">inbox</span>
                    No records found for the selected date range.
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: 'primary' | 'secondary' | 'slate' }) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 ${color === 'primary'
            ? 'bg-primary shadow-primary/20'
            : color === 'secondary'
              ? 'bg-secondary shadow-secondary/20'
              : 'bg-slate-500 shadow-slate-500/20'
          }`}
      >
        <span className="material-icons-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
