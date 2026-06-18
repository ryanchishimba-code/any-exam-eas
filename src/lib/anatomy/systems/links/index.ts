/**
 * Links system — bridges catalog structures to memory cards and practice.
 * No viewer dependency.
 */

import type { MemoryCard } from "@/lib/library/types";
import {
  anatomyPracticeHref,
  highYieldTopicHref,
  practiceTopicHref,
} from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";
import { getAnatomyStructure } from "../catalog";
import type { AnatomyStructure } from "../kernel/types";

export function getMemoryCardsForStructure(
  cards: MemoryCard[],
  structureId: string
): MemoryCard[] {
  const structure = getAnatomyStructure(structureId);
  if (!structure || structure.memoryCardIds.length === 0) return [];
  const cardMap = new Map(cards.map((c) => [c.id, c]));
  return structure.memoryCardIds
    .map((id) => cardMap.get(id))
    .filter((c): c is MemoryCard => Boolean(c));
}

export function getPracticeHrefForStructure(
  structure: AnatomyStructure,
  examSlug: ExamSlug
): string {
  return practiceTopicHref(examSlug, structure.practiceTopicSlug);
}

export function getAnatomyPracticeHref(examSlug: ExamSlug): string {
  return anatomyPracticeHref(examSlug);
}

export function getHighYieldHrefForStructure(
  structure: AnatomyStructure,
  examSlug: ExamSlug
): string | null {
  if (!structure.highYieldTopicSlug) return null;
  return highYieldTopicHref(examSlug, structure.highYieldTopicSlug);
}

export function getStructureStudyLinks(structure: AnatomyStructure, examSlug: ExamSlug) {
  return {
    practiceHref: getPracticeHrefForStructure(structure, examSlug),
    highYieldHref: getHighYieldHrefForStructure(structure, examSlug),
    anatomyPracticeHref: getAnatomyPracticeHref(examSlug),
  };
}
