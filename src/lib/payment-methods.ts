export const PAYMENT_METHODS = [
  { id: 'CASH', label: 'Cash' },
  { id: 'BANK_TRANSFER', label: 'Bank transfer' },
  { id: 'MOMO', label: 'Momo' },
  { id: 'CARD', label: 'Card' },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];

export function formatPaymentMethod(method: string | null | undefined): string {
  if (!method) return '—';
  const found = PAYMENT_METHODS.find((m) => m.id === method);
  return found?.label ?? method.replace(/_/g, ' ');
}

export function isValidPaymentMethod(method: string): method is PaymentMethodId {
  return PAYMENT_METHODS.some((m) => m.id === method);
}
