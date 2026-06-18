import type { MemoryCard } from "./types";

/** Short preview for tiles when body is empty (tables, bullets-only). */
export function getMemoryCardPreview(card: MemoryCard): string {
  if (card.body.trim()) return card.body;
  if (card.bullets?.[0]) return card.bullets[0];
  if (card.table?.rows[0]?.length) {
    return card.table.rows[0].join(" · ");
  }
  return card.teaser;
}
