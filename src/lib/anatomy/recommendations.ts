import type { ExamSlug } from "@/types/edtech";
import { ANATOMY_STRUCTURES } from "./structures";

const byId = new Map(ANATOMY_STRUCTURES.map((s) => [s.id, s]));

const EXAM_FEATURED_IDS: Record<ExamSlug, string[]> = {
  nclex: ["heart", "lungs", "diaphragm", "kidneys", "brain", "spleen"],
  usmle: ["heart", "brain", "liver", "kidneys", "aorta", "pancreas"],
  naplex: ["liver", "kidneys", "heart", "thyroid", "lungs", "pancreas"],
  mpje: ["heart", "lungs", "liver", "kidneys", "thyroid", "brain"],
};

/** High-yield structures prioritized for the active exam. */
export function getFeaturedStructuresForExam(examSlug: ExamSlug) {
  const ids = EXAM_FEATURED_IDS[examSlug];
  return ids
    .map((id) => byId.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
}

/** Default tour id to suggest for first-time users per exam. */
export function getDefaultTourIdForExam(examSlug: ExamSlug): string {
  switch (examSlug) {
    case "nclex":
      return "nclex-respiratory-basics";
    case "usmle":
      return "usmle-heart-anatomy";
    case "naplex":
      return "gi-hepatobiliary";
    default:
      return "usmle-heart-anatomy";
  }
}

export function getStructuresWithMemoryCards() {
  return ANATOMY_STRUCTURES.filter((s) => s.memoryCardIds.length > 0);
}
