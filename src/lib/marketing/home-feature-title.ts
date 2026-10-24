/** Short visible title for home feature wheel cards (2–4 words). */
export function homeFeatureShortTitle(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length <= 4) return title.trim();
  return words.slice(0, 3).join(" ");
}
