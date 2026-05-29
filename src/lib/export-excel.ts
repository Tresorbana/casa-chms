import * as XLSX from 'xlsx';

export type ExportSheet = {
  name: string;
  rows: Record<string, unknown>[];
};

/** Sanitize sheet names for Excel (max 31 chars, no invalid chars) */
function safeSheetName(name: string, index: number) {
  const cleaned = name.replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 28);
  return cleaned || `Sheet${index + 1}`;
}

function rowsFromUnknown(data: unknown): Record<string, unknown>[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map((row) => flattenRow(row));
  }
  if (typeof data === 'object') {
    return [flattenRow(data)];
  }
  return [];
}

function flattenRow(row: unknown): Record<string, unknown> {
  if (row === null || row === undefined) return {};
  if (typeof row !== 'object') return { value: row };

  const out: Record<string, unknown> = {};
  const walk = (obj: Record<string, unknown>, prefix = '') => {
    for (const [key, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (val === null || val === undefined) {
        out[path] = '';
      } else if (val instanceof Date) {
        out[path] = val.toISOString();
      } else if (Array.isArray(val)) {
        out[path] = val.length > 0 ? JSON.stringify(val) : '';
      } else if (typeof val === 'object' && '_count' in (val as object)) {
        const c = val as { _count?: { id?: number } };
        out[path] = c._count?.id ?? 0;
      } else if (typeof val === 'object') {
        walk(val as Record<string, unknown>, path);
      } else {
        out[path] = val;
      }
    }
  };
  walk(row as Record<string, unknown>);
  return out;
}

/** Pick display-friendly columns for common report record shapes */
export function normalizeReportRecord(rec: Record<string, unknown>, index: number) {
  const ref =
    typeof rec.id === 'string' && rec.id.length > 6
      ? rec.id.slice(-8).toUpperCase()
      : String(index + 1).padStart(4, '0');

  const room = rec.room as { number?: string; type?: string } | undefined;
  const details =
    (rec.details as string) ||
    (rec.guestName as string) ||
    `${room?.type || ''} ${room?.number || ''}`.trim() ||
    (rec.description as string) ||
    '—';

  const sum = rec._sum as { price?: number } | undefined;
  const amount =
    rec.totalAmount ?? rec.amount ?? rec.revenue ?? rec.totalPrice ?? sum?.price ?? '';

  const dateVal =
    rec.createdAt ?? rec.date ?? rec.checkOut ?? rec.checkIn ?? rec.startTime ?? '';

  const row: Record<string, unknown> = {
    Ref: ref,
    Details: details,
    Amount: typeof amount === 'number' ? amount : amount,
    Date: dateVal ? new Date(dateVal as string | Date).toLocaleString() : '—',
  };

  if (rec.status) row.Status = rec.status;
  if (rec.type) row.Type = rec.type;
  if (rec.quantity != null) row.Quantity = rec.quantity;
  if (rec.paymentMethod) row['Payment method'] = rec.paymentMethod;
  if (room?.number) row.Room = room.number;
  if (rec.category) row.Category = rec.category;
  if (rec.stock != null) row.Stock = rec.stock;
  if (rec.unit) row.Unit = rec.unit;

  return row;
}

export function exportToExcel(
  rows: Record<string, unknown>[],
  filename: string,
  sheetName = 'Report'
) {
  const wb = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Message: 'No data' }]);
  XLSX.utils.book_append_sheet(wb, sheet, safeSheetName(sheetName, 0));
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportWorkbook(sheets: ExportSheet[], filename: string) {
  const wb = XLSX.utils.book_new();
  sheets.forEach((s, i) => {
    const rows = s.rows.length > 0 ? s.rows : [{ Message: 'No data for this section' }];
    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, sheet, safeSheetName(s.name, i));
  });
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/** Build export rows from a detailed report API response */
export function sheetsFromReportData(
  reportLabel: string,
  data: Record<string, unknown>
): ExportSheet[] {
  const sheets: ExportSheet[] = [];
  const summaryKeys = [
    'totalRevenue',
    'totalSales',
    'occupancyRate',
    'occupied',
    'vacant',
    'totalRooms',
    'adr',
    'revPar',
    'roomsSold',
    'totalOrders',
  ];
  const summaryRows: Record<string, unknown>[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (summaryKeys.includes(key) || (typeof val === 'number' && !Array.isArray(val))) {
      if (!['records', 'breakdown', 'sources'].includes(key)) {
        summaryRows.push({ Metric: key, Value: val });
      }
    }
  }
  if (summaryRows.length > 0) {
    sheets.push({ name: 'Summary', rows: summaryRows });
  }

  const breakdown = (data.breakdown || data.sources) as unknown[];
  if (Array.isArray(breakdown) && breakdown.length > 0) {
    sheets.push({
      name: 'Breakdown',
      rows: breakdown.map((item, i) => {
        const row = flattenRow(item);
        const label =
          (item as { type?: string; source?: string; status?: string }).type ||
          (item as { source?: string }).source ||
          (item as { status?: string }).status ||
          `Item ${i + 1}`;
        return {
          Label: label,
          Count: (item as { _count?: { id?: number } })._count?.id ?? 0,
          ...row,
        };
      }),
    });
  }

  const records = data.records as unknown[];
  if (Array.isArray(records) && records.length > 0) {
    sheets.push({
      name: 'Records',
      rows: records.map((rec, i) => normalizeReportRecord(flattenRow(rec), i)),
    });
  }

  if (sheets.length === 0) {
    sheets.push({ name: reportLabel.slice(0, 20), rows: rowsFromUnknown(data) });
  }

  return sheets;
}

export function inventoryExportRows(items: Array<{
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  minStock?: number;
}>) {
  return items.map((item) => ({
    'Item name': item.name,
    Category: item.category,
    'In stock': item.stock,
    Unit: item.unit,
    'Unit price (RWF)': item.price,
    'Min stock': item.minStock ?? 10,
    'Stock value (RWF)': item.stock * item.price,
    Status: item.stock <= (item.minStock || 5) ? 'Low stock' : 'Good',
  }));
}

export function roomExportRows(
  rooms: Array<{
    number: string;
    type: string;
    status: string;
    price: number;
    floor?: { name?: string; number?: number } | null;
    activeBooking?: {
      guest?: { name?: string };
      checkIn?: string;
      checkOut?: string;
    } | null;
  }>
) {
  return rooms.map((r) => ({
    Room: r.number,
    Type: r.type,
    Status: r.status,
    'Rate/night (RWF)': r.price,
    Floor: r.floor?.name || (r.floor?.number != null ? `Floor ${r.floor.number}` : '—'),
    Guest: r.activeBooking?.guest?.name || '—',
    'Check-in': r.activeBooking?.checkIn
      ? new Date(r.activeBooking.checkIn).toLocaleDateString()
      : '—',
    'Check-out': r.activeBooking?.checkOut
      ? new Date(r.activeBooking.checkOut).toLocaleDateString()
      : '—',
  }));
}

export function invoiceExportRows(
  invoices: Array<{
    id: string;
    guestName: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod?: string | null;
    date?: string;
  }>
) {
  return invoices.map((inv) => ({
    'Invoice #': inv.id.slice(-8).toUpperCase(),
    Guest: inv.guestName,
    Type: inv.type,
    'Amount (RWF)': inv.amount,
    Status: inv.status,
    'Payment method': inv.paymentMethod || '—',
    Date: inv.date ? new Date(inv.date).toLocaleString() : '—',
  }));
}

export function conferenceExportRows(
  bookings: Array<{
    guestName: string;
    conferenceRoom?: { name?: string };
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: string;
    bookingType?: string;
  }>
) {
  return bookings.map((b) => ({
    Guest: b.guestName,
    Venue: b.conferenceRoom?.name || '—',
    'Booking type': b.bookingType || 'HOURLY',
    Start: new Date(b.startTime).toLocaleString(),
    End: new Date(b.endTime).toLocaleString(),
    'Amount (RWF)': b.totalAmount,
    Status: b.status,
  }));
}
