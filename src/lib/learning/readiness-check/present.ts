import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import type { BankItem } from "@/lib/question-bank";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion, StudyQuestionType } from "@/lib/questions/types";

/** Discrete items the check can grade without a special player per board. */
const PLAYABLE: ReadonlySet<StudyQuestionType> = new Set([
  "multiple_choice",
  "true_false",
  "select_all",
  "k_type",
]);

export type ReadinessPrompt = {
  itemId: string;
  index: number;
  total: number;
  areaId: string;
  areaLabel: string;
  stem: string;
  vignette: string | null;
  selection: "single" | "multi";
  options: string[];
};

export function toPlayableQuestion(fieldId: string, item: BankItem): StudyQuestion | null {
  if (!item.id) return null;
  try {
    const raw = bankItemToSessionRaw(fieldId, fieldId, item.subjectId ?? "mixed", item, 0);
    const study = examQuestionToStudy(
      {
        ...raw,
        bankItemId: item.id,
        field: fieldId,
        subjectId: item.subjectId,
      },
      0,
      { shuffleOptions: false }
    );
    if (!PLAYABLE.has(study.type)) return null;
    if (!study.stem.trim() || study.options.length < 2) return null;
    if (study.type === "select_all" && study.correctAnswers.length < 1) return null;
    return study;
  } catch {
    return null;
  }
}

export function promptFromStudy(
  study: StudyQuestion,
  meta: { itemId: string; index: number; total: number; areaId: string; areaLabel: string }
): ReadinessPrompt {
  return {
    itemId: meta.itemId,
    index: meta.index,
    total: meta.total,
    areaId: meta.areaId,
    areaLabel: meta.areaLabel,
    stem: study.stem,
    vignette: study.vignette?.trim() || null,
    selection: study.type === "select_all" ? "multi" : "single",
    options: study.options,
  };
}

export function gradeSelection(
  study: StudyQuestion,
  selected: string[]
): { ok: true; correct: boolean; selected: string[] } | { ok: false; error: string } {
  const cleaned = selected.map((value) => value.trim()).filter(Boolean);
  const allowed = new Set(study.options);
  if (cleaned.some((value) => !allowed.has(value))) {
    return { ok: false, error: "That choice is not on this question." };
  }
  const unique = [...new Set(cleaned)];
  if (study.type === "select_all") {
    if (unique.length < 1) return { ok: false, error: "Select at least one answer." };
  } else if (unique.length !== 1) {
    return { ok: false, error: "Select one answer." };
  }
  return { ok: true, correct: isAnswerCorrect(study, unique), selected: unique };
}

/** First sentences of the bank rationale, short enough to read between questions. */
export function rationaleLead(text: string, max = 320): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "Review this idea in practice, then come back to it.";
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const stop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("? "));
  if (stop >= 80) return slice.slice(0, stop + 1);
  return `${slice.trimEnd()}…`;
}
