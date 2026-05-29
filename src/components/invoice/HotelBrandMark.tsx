import { HOTEL_INFO } from '@/lib/hotel-info';

type HotelBrandMarkProps = {
  size?: 'sm' | 'md';
  centered?: boolean;
  showTagline?: boolean;
  showContact?: boolean;
};

export function HotelBrandMark({
  size = 'md',
  centered = false,
  showTagline = true,
  showContact = false,
}: HotelBrandMarkProps) {
  const iconBox = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  const iconSize = size === 'sm' ? 'text-[26px]' : 'text-[32px]';
  const titleClass = size === 'sm' ? 'text-xl' : 'text-2xl';

  return (
    <div className={`flex items-start gap-4 ${centered ? 'flex-col items-center text-center' : ''}`}>
      <div
        className={`${iconBox} rounded-xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0`}
      >
        <span className={`material-symbols-outlined text-primary-foreground ${iconSize}`}>home</span>
      </div>
      <div className={centered ? 'flex flex-col items-center' : ''}>
        <h1 className={`${titleClass} font-semibold text-slate-900 tracking-tight`}>{HOTEL_INFO.name}</h1>
        {showTagline && (
          <p className="text-xs font-medium text-primary/80 mt-0.5">{HOTEL_INFO.tagline}</p>
        )}
        {showContact && (
          <div className="mt-2 space-y-0.5 text-xs text-slate-500">
            <p>{HOTEL_INFO.address}</p>
            <p>{HOTEL_INFO.city}</p>
            <p>
              {HOTEL_INFO.phone} · {HOTEL_INFO.email}
            </p>
            <p>{HOTEL_INFO.tin}</p>
          </div>
        )}
      </div>
    </div>
  );
}
