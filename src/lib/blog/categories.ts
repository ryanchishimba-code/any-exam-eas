/** Preferred chip order on /blog. Unknown categories sort after these. */
export const BLOG_CATEGORY_ORDER = [
  "NCLEX",
  "NAPLEX",
  "USMLE",
  "PANCE",
  "AANP FNP",
  "NPTE-PT",
  "All boards",
] as const;

export function sortBlogCategories(categories: string[]): string[] {
  const rank = new Map<string, number>(BLOG_CATEGORY_ORDER.map((name, index) => [name, index]));
  return [...new Set(categories)].sort((a, b) => {
    const ra = rank.get(a) ?? 100;
    const rb = rank.get(b) ?? 100;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
}
