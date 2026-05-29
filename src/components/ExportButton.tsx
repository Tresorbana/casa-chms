'use client';

type ExportButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  variant?: 'primary' | 'outline';
};

export function ExportButton({
  onClick,
  disabled = false,
  label = 'Export Excel',
  variant = 'outline',
}: ExportButtonProps) {
  const base =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border border-border text-foreground hover:bg-accent';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${base}`}
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      {label}
    </button>
  );
}
