import { HOTEL_INFO } from '@/lib/hotel-info';

/** Tedeum Restaurant & Bar at Ubumwe Hotel by Kamdine */
export const TEDEUM_INFO = {
  name: 'Tedeum',
  subtitle: 'Restaurant & Bar',
  tagline: 'Dining & drinks at Ubumwe Hotel by Kamdine',
  parentHotel: HOTEL_INFO.name,
  location: HOTEL_INFO.locationNote,
  phone: HOTEL_INFO.phone,
} as const;
