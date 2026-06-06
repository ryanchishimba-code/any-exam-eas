/** Edge-safe admin dashboard path helpers (no Prisma). */
export const ADMIN_PREFIX = "/admin";
export const ADMIN_LOGIN_PATH = "/admin/login";

export function isAdminPath(path: string): boolean {
  if (path === ADMIN_LOGIN_PATH) return false;
  return path === ADMIN_PREFIX || path.startsWith(`${ADMIN_PREFIX}/`);
}

export function adminLoginUrl(callbackPath = ADMIN_PREFIX): string {
  const qs = new URLSearchParams({ callbackUrl: callbackPath });
  return `${ADMIN_LOGIN_PATH}?${qs.toString()}`;
}
