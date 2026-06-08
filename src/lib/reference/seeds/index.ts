import type { ExamSlug } from "@/types/edtech";
import type { MemoryCard, MemoryCardKind } from "../types";
import { MEMORY_CARDS } from "./cards";

export { MEMORY_CARDS };

export function getMemoryCardsForExam(examSlug: ExamSlug): MemoryCard[] {
  return MEMORY_CARDS.filter((c) => c.examSlug === examSlug).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export function getMemoryCardSubjects(examSlug: ExamSlug): string[] {
  const subjects = new Set(getMemoryCardsForExam(examSlug).map((c) => c.subject));
  return [...subjects].sort();
}

export function filterMemoryCards(
  cards: MemoryCard[],
  opts: { query?: string; subject?: string; kind?: MemoryCardKind | "all" }
): MemoryCard[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  return cards.filter((card) => {
    if (opts.subject && opts.subject !== "all" && card.subject !== opts.subject) return false;
    if (opts.kind && opts.kind !== "all" && card.kind !== opts.kind) return false;
    if (!q) return true;
    const haystack = [
      card.title,
      card.teaser,
      card.body,
      card.topic,
      card.subject,
      ...card.tags,
      ...(card.bullets ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
