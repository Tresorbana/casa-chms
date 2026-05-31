import { HOTEL_INFO } from '@/lib/hotel-info';

/** Restaurant & Bar at Ubumwe Hotel by Kamdine */
export const TEDEUM_INFO = {
  name: 'Restaurant & Bar',
  subtitle: HOTEL_INFO.name,
  tagline: 'Dining & drinks at Ubumwe Hotel by Kamdine',
  parentHotel: HOTEL_INFO.name,
  location: HOTEL_INFO.locationNote,
  phone: HOTEL_INFO.phone,
} as const;
