/**
 * Browser analytics session ids are random UUIDs (sessionStorage).
 * DB UserSession ids are Prisma cuids from startUserSession().
 * Never run UserSession.updateMany against a client UUID — it always matches 0 rows
 * but still holds the only Prisma connection on Vercel.
 */

const CUID_RE = /^c[a-z0-9]{20,}$/i;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isClientAnalyticsSessionId(sessionId: string): boolean {
  return UUID_RE.test(sessionId.trim());
}

export function isDbUserSessionId(sessionId: string): boolean {
  const id = sessionId.trim();
  if (!id || isClientAnalyticsSessionId(id)) return false;
  return CUID_RE.test(id);
}
