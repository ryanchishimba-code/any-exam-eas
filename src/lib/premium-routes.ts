/** Edge-safe premium route list (no Prisma). */
export const PREMIUM_PAGE_PREFIXES = [
  "/study",
  "/learn",
  "/generate",
  "/progress",
  "/checkout",
  "/dashboard",
  "/engine",
] as const;

export function isPremiumPage(path: string): boolean {
  return PREMIUM_PAGE_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}
