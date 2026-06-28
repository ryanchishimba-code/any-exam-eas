import { cleanOptionText } from "@/lib/question-format";
import type { BankItem } from "@/lib/question-bank";
import type { StudyQuestion } from "./types";

export type DifficultyBand = "easy" | "medium" | "hard";

/** Every practice and full-exam session must satisfy these quality gates. */
export const SESSION_QUALITY_REQUIREMENTS = {
  exactCount:
    "Return exactly the user-selected count — full exam, sprint, or custom bank length.",
  strongDistractors:
    "Each MCQ has four distinct, board-plausible distractors — never generic placeholders.",
  boardReflective:
    "Each item has a substantive stem, teaching rationale, and aligned answer choices — board-exam caliber.",
} as const;

export {
  examQuestionMeetsBoardBar,
  rawQuestionMeetsBoardBar,
  rawQuestionMeetsRelaxedBoardBar,
  studyQuestionMeetsBoardBar,
} from "@/lib/exam-prep/board-serve-quality";

export function resolveDifficultyBand(item: {
  difficulty?: number;
  difficultyLabel?: string;
}): DifficultyBand {
  const label = item.difficultyLabel?.toLowerCase();
  if (label?.includes("easy")) return "easy";
  if (label?.includes("hard")) return "hard";
  if (typeof item.difficulty === "number") {
    if (item.difficulty <= 2) return "easy";
    if (item.difficulty >= 4) return "hard";
    return "medium";
  }
  return "medium";
}

export function normOptionKey(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

/** Stable fingerprint for a question's answer-choice set (order-independent). */
export function optionsFingerprint(options: string[] | undefined): string {
  if (!options?.length) return "";
  return [...options]
    .map((o) => normOptionKey(o))
    .filter(Boolean)
    .sort()
    .join("\0");
}


/** 0–1 overlap score for answer-choice similarity (identical sets or mirrored individual options). */
export function optionChoiceSimilarity(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const fa = optionsFingerprint(a);
  const fb = optionsFingerprint(b);
  if (fa && fa === fb) return 1;

  let matched = 0;
  const used = new Set<number>();
  for (const optA of a) {
    const na = normOptionKey(optA);
    if (!na) continue;
    for (let j = 0; j < b.length; j++) {
      if (used.has(j)) continue;
      const nb = normOptionKey(b[j]!);
      if (!nb) continue;
      if (na === nb) {
        matched++;
        used.add(j);
        break;
      }
    }
  }
  return matched / Math.max(a.length, b.length);
}

export const OPTION_SIMILARITY_THRESHOLD = 0.55;

export function optionsAreTooSimilar(
  a: string[] | undefined,
  b: string[] | undefined,
  threshold = OPTION_SIMILARITY_THRESHOLD
): boolean {
  if (!a?.length || !b?.length) return false;
  return optionChoiceSimilarity(a, b) >= threshold;
}

export function hasAdjacentSimilarOptions<T>(
  items: T[],
  getOptions: (item: T) => string[],
  threshold = OPTION_SIMILARITY_THRESHOLD
): boolean {
  return hasWindowSimilarOptions(items, getOptions, 2, threshold);
}

/** True when any pair within a sliding window shares overlapping answer choices. */
export function hasWindowSimilarOptions<T>(
  items: T[],
  getOptions: (item: T) => string[],
  windowSize = 7,
  threshold = OPTION_SIMILARITY_THRESHOLD
): boolean {
  if (items.length <= 1 || windowSize <= 1) return false;

  for (let i = 0; i < items.length; i++) {
    const end = Math.min(items.length, i + windowSize);
    for (let j = i + 1; j < end; j++) {
      if (optionsAreTooSimilar(getOptions(items[i]!), getOptions(items[j]!), threshold)) {
        return true;
      }
    }
  }
  return false;
}

export function assessDifficultyMix<T>(
  items: T[],
  bandFn: (item: T) => DifficultyBand = resolveDifficultyBand as (item: T) => DifficultyBand
): { easy: number; medium: number; hard: number; isVaried: boolean } {
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const item of items) counts[bandFn(item)]++;
  const bandsPresent = [counts.easy, counts.medium, counts.hard].filter((n) => n > 0).length;
  return {
    ...counts,
    isVaried: items.length < 3 ? true : bandsPresent >= 2,
  };
}

/** Round-robin sample across difficulty bands before spreading. */
export function balanceDifficultyMix<T>(
  items: T[],
  limit: number,
  bandFn: (item: T) => DifficultyBand = resolveDifficultyBand as (item: T) => DifficultyBand
): T[] {
  if (items.length <= limit) return items;

  const buckets: Record<DifficultyBand, T[]> = {
    easy: [],
    medium: [],
    hard: [],
  };
  for (const item of items) buckets[bandFn(item)].push(item);

  const out: T[] = [];
  const order: DifficultyBand[] = ["medium", "easy", "hard"];

  while (out.length < limit) {
    let progressed = false;
    for (const band of order) {
      if (out.length >= limit) break;
      const next = buckets[band].shift();
      if (next) {
        out.push(next);
        progressed = true;
      }
    }
    if (!progressed) {
      for (const band of order) {
        while (buckets[band].length && out.length < limit) {
          out.push(buckets[band].shift()!);
        }
      }
      break;
    }
  }

  return out;
}

export function enforceSessionCount<T>(items: T[], limit: number): T[] {
  return items.slice(0, Math.max(0, limit));
}

export { hasGenericPlaceholderOptions } from "@/lib/question-format";

export function optionsFromBankItem(item: BankItem): string[] {
  return item.options ?? [];
}

export function optionsFromStudyQuestion(q: StudyQuestion): string[] {
  return q.options ?? [];
}

export function optionsFromRawInput(q: {
  options?: string[];
}): string[] {
  return q.options ?? [];
}
