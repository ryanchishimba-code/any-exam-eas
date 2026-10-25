/**
 * Links system — bridges catalog structures to memory cards and practice.
 * No viewer dependency.
 */

import type { MemoryCard } from "@/lib/library/types";
import {
  anatomyPracticeHref,
  highYieldTopicHref,
} from "@/lib/edtech/practice-links";
import { resolveAnatomyStructurePractice } from "@/lib/anatomy/structure-practice";
import { practiceTopicHref } from "@/lib/edtech/practice-links-core";
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
  const { subjectId, filters } = resolveAnatomyStructurePractice(
    examSlug,
    structure.practiceTopicSlug
  );
  return practiceTopicHref(examSlug, subjectId, 10, undefined, filters);
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
