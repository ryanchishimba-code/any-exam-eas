/** Cuid-compatible id for Drizzle inserts (matches Prisma default style). */
export function createId(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `c${t}${r}`;
}
