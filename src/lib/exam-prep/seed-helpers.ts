import type { BankItem } from "@/lib/question-bank";
import type { BlueprintDomain, ExamItemType, ExamReference } from "./types";

export type EnrichedBankItem = BankItem & {
  difficulty?: number;
  topicCategory?: string;
  blueprintDomain?: BlueprintDomain | string;
  patientAgeGroup?: string;
  itemType?: ExamItemType;
  references?: ExamReference[];
  vignette?: string;
  /** NGN structured payload (bow-tie, matrix, etc.) — stored in options JSON when non-MCQ. */
  ngnPayload?: Record<string, unknown>;
};

/** Cross-links rendered after the rationale (QuestionRelatedLinks) — merged into ngnPayload. */
export type RelatedStudyMeta = {
  /** Deep Dive review module on /dashboard/topics. */
  reviewModuleSlug?: string;
  /** Memory cards on /library. */
  memoryCardIds?: string[];
  /** Related Top 500 drug names. */
  top500Drugs?: string[];
  /** One-line high-yield takeaway shown above the links. */
  keyTakeaway?: string;
};

export function enrichItem(
  item: EnrichedBankItem,
  defaults: {
    difficulty?: number;
    topicCategory?: string;
    blueprintDomain?: string;
    itemType?: ExamItemType;
  }
): EnrichedBankItem {
  return {
    ...item,
    difficulty: item.difficulty ?? defaults.difficulty ?? 3,
    topicCategory: item.topicCategory ?? defaults.topicCategory ?? item.subjectId,
    blueprintDomain: item.blueprintDomain ?? defaults.blueprintDomain,
    itemType: item.itemType ?? defaults.itemType ?? "mcq",
  };
}

export function mcq(
  subjectId: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: Partial<EnrichedBankItem> = {}
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      question,
      options,
      correctAnswer: correct,
      explanation,
      tags: meta.tags ?? ["high-yield"],
      ...meta,
    },
    { topicCategory: subjectId, itemType: "mcq" }
  );
}

export function vignette(
  subjectId: string,
  vignetteText: string,
  question: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: Partial<EnrichedBankItem> = {}
): EnrichedBankItem {
  const stem = `${vignetteText}\n\n${question}`;
  return enrichItem(
    {
      subjectId,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      vignette: vignetteText,
      itemType: "vignette",
      tags: meta.tags ?? ["vignette", "high-yield", "clinical-judgment"],
      ...meta,
    },
    { topicCategory: subjectId, itemType: "vignette", difficulty: 4 }
  );
}
