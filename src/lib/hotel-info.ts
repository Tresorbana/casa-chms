/** Shared property branding for invoices, checkout, and print views */
export const HOTEL_INFO = {
  name: 'Ubumwe Hotel by Kamdine',
  aliases: ['Ubumwe Hotel', 'Kamdine'] as const,
  tagline: 'A quiet retreat on the shores of Lake Kivu',
  address: 'Rutsiro District',
  region: 'Western Province, Rwanda',
  locationNote: 'Along the shores of Lake Kivu',
  phone: '+250 783 237 031',
  email: 'reception@ubumwehotel.rw',
  description:
    'Ubumwe Hotel by Kamdine — well-maintained rooms, an on-site restaurant, and a highly-rated outdoor view, known for beautiful exterior views and a relaxing lake getaway.',
  amenities: [
    'On-site Restaurant & Bar',
    'Wheelchair accessible entrance & parking',
    'Family-friendly',
  ] as const,
} as const;

export function hotelDisplayName() {
  return HOTEL_INFO.name;
}

export function hotelFullLocation() {
  return `${HOTEL_INFO.address}, ${HOTEL_INFO.region}`;
}

/** Routes that render without sidebar or mobile tab bar (print-focused views) */
export function isChromelessRoute(pathname: string) {
  return (
    pathname.startsWith('/invoice/restaurant') ||
    pathname.startsWith('/invoice/preview') ||
    /^\/invoice\/[^/]+/.test(pathname)
  );
}
