/** Edge-safe premium route list (no Prisma). */
export const PREMIUM_PAGE_PREFIXES = [
  "/dashboard",
  "/question-bank",
  "/analytics",
  "/study",
  "/learn",
  "/generate",
  "/progress",
  "/checkout",
  "/engine",
  "/exams",
  "/practice",
  "/mpje",
  "/full-exam",
  "/study-hub",
  "/studygub",
] as const;

export function isPremiumPage(path: string): boolean {
  return PREMIUM_PAGE_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
}
