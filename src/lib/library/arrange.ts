import type { MemoryCard } from "./types";

/**
 * Memory-card arrangement helpers.
 *
 * The Library used to render every card in one flat grid ordered by a
 * collision-prone `sortOrder`, which interleaved unrelated topics and made cards
 * feel "scattered." These pure helpers give every exam the same clean structure:
 * cards grouped into subject sections, deterministically ordered within each
 * section so related cards always sit together.
 */

export type MemoryCardGroup = {
  /** Display label for the section header (the card's `subject`). */
  subject: string;
  /** URL/DOM-safe key for jump links + React keys. */
  key: string;
  cards: MemoryCard[];
};

/** Slugify a subject label into a stable, DOM-safe key. */
export function subjectKey(subject: string): string {
  return (
    subject
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "other"
  );
}

/**
 * Deterministic order WITHIN a subject: topic A→Z, then the authored
 * `sortOrder`, then title. This keeps cards from the same topic adjacent and
 * makes the list stable even when `sortOrder` values collide.
 */
export function compareCardsWithinSubject(a: MemoryCard, b: MemoryCard): number {
  const byTopic = a.topic.localeCompare(b.topic, undefined, { sensitivity: "base" });
  if (byTopic !== 0) return byTopic;
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
}

/**
 * Group cards into subject sections, ordered alphabetically by subject so the
 * layout is predictable and easy to scan/find. Each section's cards are sorted
 * with {@link compareCardsWithinSubject}.
 */
export function groupCardsBySubject(cards: MemoryCard[]): MemoryCardGroup[] {
  const groups = new Map<string, MemoryCard[]>();
  for (const card of cards) {
    const subject = card.subject?.trim() || "Other";
    const list = groups.get(subject);
    if (list) list.push(card);
    else groups.set(subject, [card]);
  }

  return [...groups.entries()]
    .map(([subject, list]) => ({
      subject,
      key: subjectKey(subject),
      cards: [...list].sort(compareCardsWithinSubject),
    }))
    .sort((a, b) =>
      a.subject.localeCompare(b.subject, undefined, { sensitivity: "base" })
    );
}
