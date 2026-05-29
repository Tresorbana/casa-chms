export type ConferenceBookingType = 'HOURLY' | 'DAILY';

export function countBookingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 0;
  return Math.floor(diff / 86400000) + 1;
}

export function dailyRangeToTimes(startDate: string, endDate: string) {
  const startTime = new Date(startDate);
  startTime.setHours(0, 0, 0, 0);
  const endTime = new Date(endDate);
  endTime.setHours(23, 59, 59, 999);
  return { startTime, endTime };
}

export function calculateDailyTotal(pricePerDay: number, startDate: string, endDate: string) {
  const days = countBookingDays(startDate, endDate);
  return days * pricePerDay;
}
