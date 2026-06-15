import { cleanOptionText } from "@/lib/question-format";
import type { BankItem } from "@/lib/question-bank";
import type { StudyQuestion } from "./types";

export type DifficultyBand = "easy" | "medium" | "hard";

/** Every practice session must satisfy these quality gates. */
export const SESSION_QUALITY_REQUIREMENTS = {
  exactCount: "Returned question count must match the user-selected limit.",
  difficultyMix: "Sessions include easy, medium, and hard items when the pool allows.",
  spreadSimilarOptions:
    "Questions with overlapping answer choices must not appear back-to-back.",
  strongDistractors:
    "Each MCQ has four distinct, plausible options — never generic placeholders.",
} as const;

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

function optionTokens(options: string[]): Set<string> {
  const tokens = new Set<string>();
  for (const opt of options) {
    for (const word of normOptionKey(opt).split(/\W+/)) {
      if (word.length >= 4) tokens.add(word);
    }
  }
  return tokens;
}

/** 0–1 overlap score for answer-choice similarity (shared clinical terms). */
export function optionChoiceSimilarity(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const fa = optionsFingerprint(a);
  const fb = optionsFingerprint(b);
  if (fa && fa === fb) return 1;

  const A = optionTokens(a);
  const B = optionTokens(b);
  if (A.size === 0 || B.size === 0) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared++;
  return shared / Math.min(A.size, B.size);
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
  for (let i = 1; i < items.length; i++) {
    if (optionsAreTooSimilar(getOptions(items[i - 1]!), getOptions(items[i]!), threshold)) {
      return true;
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
