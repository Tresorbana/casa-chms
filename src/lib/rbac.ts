export const ROLES = [
  'STAFF',
  'RECEPTIONIST',
  'WAITER',
  'BARMAN',
  'STORE_KEEPER',
  'FINANCE',
  'ADMIN',
  'SUPER_ADMIN',
] as const;

export type Role = (typeof ROLES)[number];

type RouteRule = {
  pattern: RegExp;
  methods?: string[];
  roles?: Role[];
  public?: boolean;
};

const AUTHENTICATED_ROLES: Role[] = [...ROLES];

const ADMIN_ROLES: Role[] = ['ADMIN', 'SUPER_ADMIN'];
const FINANCE_ROLES: Role[] = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'];
const RECEPTION_ROLES: Role[] = ['RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'];
const OPS_ROLES: Role[] = ['RECEPTIONIST', 'WAITER', 'BARMAN', 'STORE_KEEPER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'];
const SERVICE_ROLES: Role[] = ['BARMAN', 'ADMIN', 'SUPER_ADMIN'];
const MENU_ROLES: Role[] = ['WAITER', 'BARMAN', 'ADMIN', 'SUPER_ADMIN'];

const ROUTE_RULES: RouteRule[] = [
  { pattern: /^\/login$/, public: true },
  { pattern: /^\/api\/auth\/(login|logout)$/, public: true, methods: ['POST'] },
  { pattern: /^\/api\/inquiries$/, public: true, methods: ['POST', 'OPTIONS'] },

  { pattern: /^\/api\/users(?:\/.*)?$/, roles: ADMIN_ROLES },

  { pattern: /^\/settings(?:\/.*)?$/, roles: ADMIN_ROLES },
  { pattern: /^\/finance(?:\/.*)?$/, roles: FINANCE_ROLES },
  { pattern: /^\/reports(?:\/.*)?$/, roles: FINANCE_ROLES },
  { pattern: /^\/inventory(?:\/.*)?$/, roles: ['BARMAN', 'STORE_KEEPER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/pos\/restaurant(?:\/.*)?$/, roles: MENU_ROLES },
  { pattern: /^\/cms\/requests(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/inquiries(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/bookings(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/checkout(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/events(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/invoice(?:\/.*)?$/, roles: OPS_ROLES },

  { pattern: /^\/api\/dashboard$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/api\/auth\/me$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/api\/notifications(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/notifications(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/profile(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/calendar(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/room-status(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/room-timeline(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },
  { pattern: /^\/verify-routing(?:\/.*)?$/, roles: AUTHENTICATED_ROLES },

  { pattern: /^\/api\/bookings(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/api\/checkout(?:\/.*)?$/, roles: RECEPTION_ROLES },
  { pattern: /^\/api\/rooms$/, roles: AUTHENTICATED_ROLES, methods: ['GET'] },
  { pattern: /^\/api\/rooms(?:\/.*)?$/, roles: ADMIN_ROLES, methods: ['POST', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: /^\/api\/floors$/, roles: ADMIN_ROLES, methods: ['GET'] },
  { pattern: /^\/api\/floors(?:\/.*)?$/, roles: ADMIN_ROLES, methods: ['POST', 'PUT', 'PATCH', 'DELETE'] },
  { pattern: /^\/api\/inventory(?:\/.*)?$/, roles: ['BARMAN', 'STORE_KEEPER', 'FINANCE', 'ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/api\/invoices(?:\/.*)?$/, roles: OPS_ROLES },
  { pattern: /^\/api\/finance(?:\/.*)?$/, roles: FINANCE_ROLES },
  { pattern: /^\/api\/reports(?:\/.*)?$/, roles: FINANCE_ROLES },
  { pattern: /^\/api\/services\/charge$/, roles: OPS_ROLES },
  { pattern: /^\/api\/services(?:\/.*)?$/, roles: SERVICE_ROLES },
  { pattern: /^\/api\/pos\/menu(?:\/.*)?$/, roles: MENU_ROLES },
  { pattern: /^\/api\/conference(?:\/.*)?$/, roles: RECEPTION_ROLES },
];

const ROLE_ORDER: Record<Role, number> = {
  STAFF: 0,
  RECEPTIONIST: 1,
  WAITER: 1,
  BARMAN: 1,
  STORE_KEEPER: 1,
  FINANCE: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function normalizeRole(role: string | null | undefined): Role | null {
  return role && (ROLES as readonly string[]).includes(role) ? (role as Role) : null;
}

export function canAssignRole(actorRole: string | null | undefined, targetRole: string | null | undefined) {
  const actor = normalizeRole(actorRole);
  const target = normalizeRole(targetRole);

  if (!actor) return false;
  if (!target) return false;
  if (actor === 'SUPER_ADMIN') return true;
  if (actor === 'ADMIN') return target !== 'SUPER_ADMIN';
  return false;
}

function findRouteRule(pathname: string, method: string) {
  const normalizedMethod = method.toUpperCase();
  return ROUTE_RULES.find(rule => rule.pattern.test(pathname) && (!rule.methods || rule.methods.includes(normalizedMethod)));
}

export function canAccessRoute(role: string | null | undefined, pathname: string, method = 'GET') {
  const normalizedRole = normalizeRole(role);
  const matchedRule = findRouteRule(pathname, method);

  if (matchedRule?.public) {
    return true;
  }

  if (!normalizedRole) {
    return false;
  }

  if (!matchedRule?.roles) {
    return true;
  }

  return matchedRule.roles.includes(normalizedRole);
}

export function getRoleWeight(role: string | null | undefined) {
  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) return -1;
  return ROLE_ORDER[normalizedRole];
}
