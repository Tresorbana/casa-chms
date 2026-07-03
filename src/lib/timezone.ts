// Rwanda is UTC+2 (Africa/Kigali) — no daylight saving
const OFFSET_MS = 2 * 60 * 60 * 1000;

/** Convert a UTC Date to the Rwanda local Date (for reading year/month/day). */
export function toRwandaLocal(date: Date): Date {
  return new Date(date.getTime() + OFFSET_MS);
}

/**
 * Return the UTC timestamp that corresponds to the start of "today" in
 * Rwanda local time (i.e. midnight Kigali).
 */
export function startOfRwandaDay(utcNow?: Date): Date {
  const now = utcNow ?? new Date();
  const local = toRwandaLocal(now);
  // Treat local as UTC to read Y/M/D, then convert back to UTC midnight Kigali
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();
  return new Date(Date.UTC(y, m, d) - OFFSET_MS);
}

/** End of today in Rwanda time (23:59:59.999 Kigali). */
export function endOfRwandaDay(utcNow?: Date): Date {
  const start = startOfRwandaDay(utcNow);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

/**
 * Parse a "YYYY-MM-DD" date string as the start/end of that day in
 * Rwanda local time, returned as UTC timestamps for Postgres queries.
 */
export function rwandaDayBounds(dateStr: string): { gte: Date; lte: Date } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const gte = new Date(Date.UTC(y, m - 1, d) - OFFSET_MS);
  const lte = new Date(gte.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { gte, lte };
}
