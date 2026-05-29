import { HOTEL_INFO, hotelFullLocation } from '@/lib/hotel-info';

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
        <p className="text-[11px] text-slate-500 mt-0.5">
          Also known as {HOTEL_INFO.aliases.join(' · ')}
        </p>
        {showTagline && (
          <p className="text-xs font-medium text-primary/80 mt-1">{HOTEL_INFO.tagline}</p>
        )}
        {showContact && (
          <div className="mt-2 space-y-0.5 text-xs text-slate-500">
            <p>{hotelFullLocation()}</p>
            <p className="text-slate-400">{HOTEL_INFO.locationNote}</p>
            <p>{HOTEL_INFO.phone}</p>
            <p>{HOTEL_INFO.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
