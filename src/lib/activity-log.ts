import { prisma } from '@/lib/db';

export type ActivityStatus = 'OK' | 'FAILED' | 'DENIED';

export type ActivityInput = {
  user?: { id?: string | null; name?: string | null; role?: string | null } | null;
  action: string;
  category?: string;
  entity?: string | null;
  entityId?: string | null;
  method?: string | null;
  path?: string | null;
  metadata?: Record<string, unknown> | null;
  status?: ActivityStatus;
  request?: Request | null;
};

function extractClientMeta(req?: Request | null) {
  if (!req) return { ipAddress: null, userAgent: null };
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;
  const userAgent = req.headers.get('user-agent') || null;
  return { ipAddress: ip, userAgent };
}

export async function recordActivity(input: ActivityInput) {
  const { ipAddress, userAgent } = extractClientMeta(input.request);
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.user?.id ?? null,
        userName: input.user?.name ?? null,
        userRole: input.user?.role ?? null,
        action: input.action,
        category: input.category ?? 'GENERAL',
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        method: input.method ?? null,
        path: input.path ?? null,
        metadata: (input.metadata ?? null) as never,
        ipAddress,
        userAgent,
        status: input.status ?? 'OK',
      },
    });
  } catch (error) {
    console.error('[activity-log] failed to write log', error);
  }
}
