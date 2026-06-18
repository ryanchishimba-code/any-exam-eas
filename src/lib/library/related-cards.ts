import type { MemoryCard } from "./types";

/** Cards related by topic or shared practice subject. */
export function getRelatedMemoryCards(
  card: MemoryCard,
  library: MemoryCard[],
  limit = 3
): MemoryCard[] {
  const sameExam = library.filter((c) => c.examSlug === card.examSlug && c.id !== card.id);
  const scored = sameExam.map((c) => {
    let score = 0;
    if (c.topic === card.topic) score += 3;
    if (c.subject === card.subject) score += 2;
    if (c.practiceTopicSlug === card.practiceTopicSlug) score += 2;
    const tagOverlap = c.tags.filter((t) => card.tags.includes(t)).length;
    score += tagOverlap;
    return { card: c, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.card.sortOrder - b.card.sortOrder)
    .slice(0, limit)
    .map((s) => s.card);
}
