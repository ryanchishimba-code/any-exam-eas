/** Edge-safe staff portal path helpers (no Prisma). */
export const INTERNAL_PREFIX = "/internal";
export const EMPLOYEE_LOGIN_PATH = "/employee/login";

export function isInternalPath(path: string): boolean {
  return path === INTERNAL_PREFIX || path.startsWith(`${INTERNAL_PREFIX}/`);
}
