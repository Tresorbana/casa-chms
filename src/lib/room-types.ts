export const ROOM_TYPES = ['TWIN', 'VIP', 'EXECUTIVE', 'SUITE', 'FAMILY'] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

const LEGACY_ROOM_TYPE_MAP: Record<string, RoomType> = {
  STANDARD: 'TWIN',
  DOUBLE: 'VIP',
  DELUXE: 'VIP',
  EXECUTIVE: 'EXECUTIVE',
  SUITE: 'SUITE',
  FAMILY: 'FAMILY',
  TWIN: 'TWIN',
  VIP: 'VIP',
};

export function normalizeRoomType(value: string | null | undefined): RoomType | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return LEGACY_ROOM_TYPE_MAP[normalized] ?? null;
}
