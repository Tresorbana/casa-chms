import { HOTEL_INFO } from '@/lib/hotel-info';

/** Tedeum Restaurant & Bar at The Kamdine Hotel */
export const TEDEUM_INFO = {
  name: 'Tedeum',
  subtitle: 'Restaurant & Bar',
  tagline: 'Dining & drinks at The Kamdine Hotel',
  parentHotel: HOTEL_INFO.name,
  location: HOTEL_INFO.locationNote,
  phone: HOTEL_INFO.phone,
} as const;
