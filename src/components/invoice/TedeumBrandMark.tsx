import { TEDEUM_INFO } from '@/lib/tedeum-info';

type TedeumBrandMarkProps = {
  centered?: boolean;
  showHotel?: boolean;
};

export function TedeumBrandMark({ centered = false, showHotel = true }: TedeumBrandMarkProps) {
  return (
    <div className={`flex items-start gap-4 ${centered ? 'flex-col items-center text-center' : ''}`}>
      <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
        <span className="material-symbols-outlined text-primary-foreground text-[30px]">restaurant</span>
      </div>
      <div className={centered ? 'flex flex-col items-center' : ''}>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{TEDEUM_INFO.name}</h1>
        <p className="text-sm font-medium text-primary">{TEDEUM_INFO.subtitle}</p>
        {showHotel && (
          <p className="text-xs text-slate-500 mt-1">
            at {TEDEUM_INFO.parentHotel} · {TEDEUM_INFO.location}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">{TEDEUM_INFO.tagline}</p>
      </div>
    </div>
  );
}
