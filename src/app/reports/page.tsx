'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import TopBar from '@/components/TopBar';
import { ExportButton } from '@/components/ExportButton';
import { exportWorkbook, sheetsFromReportData, type ExportSheet } from '@/lib/export-excel';

const REPORT_TYPES = [
  { id: 'OCCUPANCY',         label: 'Occupancy Report',              category: 'ROOMS' },
  { id: 'REVENUE_ROOMS',     label: 'Room Revenue',                  category: 'ROOMS' },
  { id: 'ROOMS_STATUS',      label: 'Room Status List',              category: 'ROOMS' },
  { id: 'ADR',               label: 'Avg Daily Rate (ADR)',          category: 'ROOMS' },
  { id: 'REVPAR',            label: 'RevPAR',                        category: 'ROOMS' },
  { id: 'RESERVATIONS',      label: 'Reservations & Cancellations',  category: 'ROOMS' },
  { id: 'BOOKING_SOURCE',    label: 'Booking Source',                category: 'ROOMS' },
  { id: 'GUEST_STAY',        label: 'Guest Stay Report',             category: 'ROOMS' },
  { id: 'RESTAURANT_SALES',  label: 'Restaurant Sales',              category: 'DINING' },
  { id: 'MENU_PERFORMANCE',  label: 'Menu Item Performance',         category: 'DINING' },
  { id: 'RESTAURANT_ORDERS', label: 'Order Report',                  category: 'DINING' },
  { id: 'INVENTORY',         label: 'Inventory & Stock',             category: 'INVENTORY' },
  { id: 'CONFERENCE',        label: 'Conference & Events',           category: 'EVENTS' },
  { id: 'RESTAURANT_EVENTS', label: 'Restaurant Events',             category: 'EVENTS' },
  { id: 'INVOICES',          label: 'All Invoices',                  category: 'FINANCE' },
  { id: 'EXTRA_SERVICES',    label: 'Extra Services Usage',          category: 'SERVICES' },
];

const CATEGORIES = ['ROOMS', 'DINING', 'INVENTORY', 'EVENTS', 'FINANCE', 'SERVICES'] as const;

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div className="p-2 bg-muted rounded-lg flex-shrink-0">
        <span className="material-symbols-outlined text-foreground/60 text-[22px]">{icon}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

const inputClass = "bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(REPORT_TYPES[0]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportingAll, setExportingAll] = useState(false);

  const { data, isLoading, error } = useSWR(
    `/api/reports/detailed?type=${selectedReport.id}&start=${dateRange.start}&end=${dateRange.end}`,
    fetcher,
    { onError: () => toast.error('Failed to load report') }
  );

  const handleExport = () => {
    if (!data) return;
    const sheets = sheetsFromReportData(selectedReport.label, data as Record<string, unknown>);
    exportWorkbook(sheets, `${selectedReport.label}_${new Date().toISOString().split('T')[0]}`);
    toast.success('Report exported');
  };

  const handleExportAll = async () => {
    setExportingAll(true);
    try {
      const qs = new URLSearchParams();
      if (dateRange.start) qs.set('start', dateRange.start);
      if (dateRange.end) qs.set('end', dateRange.end);
      const res = await fetch(`/api/reports/export?${qs.toString()}`);
      if (!res.ok) throw new Error('Export failed');
      const bundle = await res.json();
      const summaryRows = Object.entries(bundle.summary || {}).map(([Metric, Value]) => ({
        Metric,
        Value,
      }));
      const sheets: ExportSheet[] = [
        { name: 'Summary', rows: summaryRows },
        {
          name: 'Rooms',
          rows: (bundle.rooms || []).map((r: Record<string, unknown>) => ({
            Room: r.number,
            Type: r.type,
            Status: r.status,
            'Rate/night': r.price,
            Floor: r.floor,
            Guest: r.guest || '—',
            'Check-in': r.checkIn ? new Date(r.checkIn as string).toLocaleDateString() : '—',
            'Check-out': r.checkOut ? new Date(r.checkOut as string).toLocaleDateString() : '—',
          })),
        },
        {
          name: 'Inventory',
          rows: (bundle.inventory || []).map((i: Record<string, unknown>) => ({
            Item: i.name,
            Category: i.category,
            Stock: i.stock,
            Unit: i.unit,
            'Unit price': i.price,
            Value: i.value,
            Status: i.status,
          })),
        },
        {
          name: 'Restaurant',
          rows: (bundle.restaurant || []).map((inv: Record<string, unknown>) => ({
            'Invoice #': String(inv.id).slice(-8).toUpperCase(),
            Guest: inv.guestName,
            Amount: inv.amount,
            Status: inv.status,
            'Payment method': inv.paymentMethod || '—',
            Items: inv.items,
            Date: inv.date ? new Date(inv.date as string).toLocaleString() : '—',
          })),
        },
        {
          name: 'Bookings',
          rows: (bundle.bookings || []).map((b: Record<string, unknown>) => ({
            Guest: b.guest,
            Room: b.room,
            'Room type': b.roomType,
            'Check-in': b.checkIn ? new Date(b.checkIn as string).toLocaleDateString() : '—',
            'Check-out': b.checkOut ? new Date(b.checkOut as string).toLocaleDateString() : '—',
            Amount: b.totalAmount,
            Status: b.status,
          })),
        },
        {
          name: 'Conference',
          rows: (bundle.conference || []).map((c: Record<string, unknown>) => ({
            Guest: c.guestName,
            Venue: c.venue,
            Type: c.bookingType,
            Start: c.startTime ? new Date(c.startTime as string).toLocaleString() : '—',
            End: c.endTime ? new Date(c.endTime as string).toLocaleString() : '—',
            Amount: c.totalAmount,
            Status: c.status,
          })),
        },
        {
          name: 'Invoices',
          rows: (bundle.allInvoices || []).map((inv: Record<string, unknown>) => ({
            'Invoice #': String(inv.id).slice(-8).toUpperCase(),
            Guest: inv.guestName,
            Type: inv.type,
            Amount: inv.amount,
            Status: inv.status,
            'Payment method': inv.paymentMethod || '—',
            Date: inv.date ? new Date(inv.date as string).toLocaleString() : '—',
          })),
        },
        {
          name: 'Services',
          rows: (bundle.services || []).map((s: Record<string, unknown>) => ({
            Service: s.service,
            Guest: s.guest,
            Room: s.room,
            Qty: s.quantity,
            Amount: s.totalPrice,
            Status: s.status,
            Date: s.date ? new Date(s.date as string).toLocaleString() : '—',
          })),
        },
      ];
      exportWorkbook(sheets, `Full_Hotel_Report_${new Date().toISOString().split('T')[0]}`);
      toast.success('Full report exported (all modules)');
    } catch {
      toast.error('Failed to export full report');
    } finally {
      setExportingAll(false);
    }
  };

  const hasRecords = data?.records && Array.isArray(data.records) && data.records.length > 0;
  const hasBreakdown = data?.breakdown && Array.isArray(data.breakdown) && data.breakdown.length > 0;
  const hasSources = data?.sources && Array.isArray(data.sources) && data.sources.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 flex flex-col gap-6">
      <TopBar
        title="Reports"
        description="Business and operational analytics."
        actions={
          <div className="flex flex-wrap gap-2">
            <ExportButton
              onClick={handleExportAll}
              disabled={exportingAll}
              label={exportingAll ? 'Exporting…' : 'Export all'}
              variant="outline"
            />
            <ExportButton onClick={handleExport} disabled={!data} variant="primary" />
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-56 flex-shrink-0 space-y-4">
          {CATEGORIES.map(category => (
            <div key={category}>
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 px-2">{category}</h3>
              <div className="space-y-0.5">
                {REPORT_TYPES.filter(r => r.category === category).map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedReport.id === report.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {report.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">{selectedReport.label}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">View and analyze {selectedReport.label.toLowerCase()} data</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-1">From</label>
                <input type="date" className={inputClass} value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground px-1">To</label>
                <input type="date" className={inputClass} value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="p-6">
            {error ? (
              <div className="py-16 text-center text-destructive text-sm">
                <span className="material-symbols-outlined text-3xl block mb-2">error_outline</span>
                Failed to load report data.
              </div>
            ) : isLoading ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                <span className="material-symbols-outlined text-3xl block mb-2 animate-spin">refresh</span>
                Generating report...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedReport.id === 'OCCUPANCY' && (<>
                    <StatCard label="Occupancy Rate" value={`${(data?.occupancyRate || 0).toFixed(1)}%`} icon="pie_chart" />
                    <StatCard label="Occupied Rooms" value={data?.occupied || 0} icon="bed" />
                    <StatCard label="Vacant Rooms" value={data?.vacant || 0} icon="meeting_room" />
                  </>)}
                  {selectedReport.id === 'REVENUE_ROOMS' && <StatCard label="Total Room Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" />}
                  {selectedReport.id === 'ADR' && (<>
                    <StatCard label="Avg Daily Rate" value={`RWF ${Math.round(data?.adr || 0).toLocaleString()}`} icon="trending_up" />
                    <StatCard label="Rooms Sold" value={data?.roomsSold || 0} icon="sell" />
                    <StatCard label="Total Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" />
                  </>)}
                  {selectedReport.id === 'REVPAR' && (<>
                    <StatCard label="RevPAR" value={`RWF ${Math.round(data?.revPar || 0).toLocaleString()}`} icon="waterfall_chart" />
                    <StatCard label="Available Rooms" value={data?.totalRooms || 0} icon="apartment" />
                    <StatCard label="Total Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" />
                  </>)}
                  {selectedReport.id === 'RESTAURANT_SALES' && (<>
                    <StatCard label="Total Sales" value={`RWF ${(data?.totalSales || 0).toLocaleString()}`} icon="restaurant" />
                    <StatCard label="Transactions" value={data?.records?.length || 0} icon="receipt" />
                  </>)}
                  {selectedReport.id === 'EXTRA_SERVICES' && <StatCard label="Service Charges" value={data?.records?.length || 0} icon="spa" />}
                  {selectedReport.id === 'GUEST_STAY' && <StatCard label="Checked-Out Stays" value={data?.records?.length || 0} icon="luggage" />}
                  {selectedReport.id === 'RESERVATIONS' && <StatCard label="Status Groups" value={data?.breakdown?.length || 0} icon="assignment" />}
                  {selectedReport.id === 'BOOKING_SOURCE' && <StatCard label="Booking Channels" value={data?.sources?.length || 0} icon="source" />}
                  {selectedReport.id === 'MENU_PERFORMANCE' && <StatCard label="Menu Items Tracked" value={data?.records?.length || 0} icon="menu_book" />}
                  {selectedReport.id === 'RESTAURANT_ORDERS' && <StatCard label="Total Orders" value={data?.totalOrders || 0} icon="shopping_bag" />}
                  {selectedReport.id === 'INVENTORY' && (<>
                    <StatCard label="Total Items" value={data?.totalItems || 0} icon="inventory_2" />
                    <StatCard label="Low Stock" value={data?.lowStockItems || 0} icon="warning" />
                    <StatCard label="Stock Value" value={`RWF ${(data?.inventoryValue || 0).toLocaleString()}`} icon="payments" />
                  </>)}
                  {selectedReport.id === 'ROOMS_STATUS' && (<>
                    <StatCard label="Occupancy Rate" value={`${(data?.occupancyRate || 0).toFixed(1)}%`} icon="pie_chart" />
                    <StatCard label="Occupied" value={data?.occupied || 0} icon="bed" />
                    <StatCard label="Vacant" value={data?.vacant || 0} icon="meeting_room" />
                  </>)}
                  {selectedReport.id === 'CONFERENCE' && (<>
                    <StatCard label="Bookings" value={data?.totalBookings || 0} icon="event" />
                    <StatCard label="Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" />
                  </>)}
                  {selectedReport.id === 'RESTAURANT_EVENTS' && (<>
                    <StatCard label="Total Events" value={data?.totalEvents || 0} icon="celebration" />
                    <StatCard label="Completed" value={data?.completedEvents || 0} icon="check_circle" />
                    <StatCard label="Revenue" value={`RWF ${(data?.totalRevenue || 0).toLocaleString()}`} icon="payments" />
                  </>)}
                  {selectedReport.id === 'INVOICES' && (<>
                    <StatCard label="Total Invoices" value={data?.totalInvoices || 0} icon="receipt_long" />
                    <StatCard label="Paid" value={data?.paidInvoices || 0} icon="check_circle" />
                    <StatCard label="Unpaid" value={data?.unpaidInvoices || 0} icon="pending" />
                  </>)}
                </div>

                {/* Breakdown */}
                {(hasBreakdown || hasSources) && (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/50 px-5 py-3 border-b border-border">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {hasBreakdown ? 'Status Breakdown' : 'Booking Sources'}
                      </h3>
                    </div>
                    <div className="divide-y divide-border">
                      {(data.breakdown || data.sources || []).map((item: any, i: number) => {
                        const label = item.type || item.source || item.status || `Item ${i + 1}`;
                        const count = item._count?.id ?? 0;
                        const total = (data.breakdown || data.sources || []).reduce((s: number, x: any) => s + (x._count?.id ?? 0), 0);
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                          <div key={label} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">{i + 1}</div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-foreground uppercase">{label}</span>
                                <span className="text-sm text-foreground">{count} <span className="text-muted-foreground text-xs">({pct}%)</span></span>
                              </div>
                              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Records Table */}
                {hasRecords && (
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/50 px-5 py-3 border-b border-border flex items-center justify-between">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Records</h3>
                      <span className="text-xs text-muted-foreground">{data.records.length} entries</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[500px]">
                        <thead className="bg-muted/30 border-b border-border">
                          <tr>
                            {['Ref','Details','Amount','Date'].map((h, i) => (
                              <th key={h} className={`px-5 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider ${i >= 2 ? 'text-right' : ''}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {data.records.map((rec: any, idx: number) => {
                            const refStr = typeof rec.id === 'string' && rec.id.length > 6 ? `#${rec.id.slice(-6).toUpperCase()}` : `#${String(idx + 1).padStart(4, '0')}`;
                            const detailTitle = rec.details || `${rec.room?.type || ''} ${rec.room?.number || ''}`.trim() || '–';
                            return (
                              <tr key={rec.id || idx} className="hover:bg-muted/20 transition-colors">
                                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{refStr}</td>
                                <td className="px-5 py-4 text-sm text-foreground">{detailTitle}</td>
                                <td className="px-5 py-4 text-right text-sm font-medium text-foreground">
                                  {rec.totalAmount != null ? `RWF ${rec.totalAmount.toLocaleString()}` : '–'}
                                </td>
                                <td className="px-5 py-4 text-right text-xs text-muted-foreground">
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

                {!hasRecords && !hasBreakdown && !hasSources && (
                  <div className="text-center py-16 text-muted-foreground">
                    <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">inbox</span>
                    <p className="text-sm">No records found for the selected date range</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
