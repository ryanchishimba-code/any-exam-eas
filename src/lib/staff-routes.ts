/** Edge-safe staff portal path helpers (no Prisma). */
export const INTERNAL_PREFIX = "/internal";

export function isInternalPath(path: string): boolean {
  return path === INTERNAL_PREFIX || path.startsWith(`${INTERNAL_PREFIX}/`);
}

export function staffLoginUrl(callbackPath = INTERNAL_PREFIX): string {
  return `/login?callbackUrl=${encodeURIComponent(callbackPath)}`;
}
