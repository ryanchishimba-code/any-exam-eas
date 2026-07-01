import type { BankItem } from "@/lib/question-bank";
import type { BlueprintDomain, ExamItemType, ExamReference } from "./types";
import {
  enrichRelatedStudyMeta,
  relatedMetaFromPayload,
  type StudyStructureContext,
} from "./anatomy-study-meta";

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
  /** 3D anatomy structures to surface in related links. */
  structureIds?: string[];
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
  const enriched: EnrichedBankItem = {
    ...item,
    difficulty: item.difficulty ?? defaults.difficulty ?? 3,
    topicCategory: item.topicCategory ?? defaults.topicCategory ?? item.subjectId,
    blueprintDomain: item.blueprintDomain ?? defaults.blueprintDomain,
    itemType: item.itemType ?? defaults.itemType ?? "mcq",
  };

  const payload = { ...(item.ngnPayload ?? {}) };
  const studyText = [
    item.vignette,
    item.question,
    item.explanation,
    ...(item.options ?? []),
    item.correctAnswer,
  ]
    .filter(Boolean)
    .join("\n");

  const ctx: StudyStructureContext = {
    reviewModuleSlug:
      typeof payload.reviewModuleSlug === "string" ? payload.reviewModuleSlug : undefined,
    subjectId: enriched.subjectId ?? item.subjectId,
    topicCategory: enriched.topicCategory,
    blueprintSystem:
      typeof payload.blueprintSystem === "string" ? payload.blueprintSystem : undefined,
    blueprintTopic:
      typeof payload.blueprintTopic === "string" ? payload.blueprintTopic : undefined,
    memoryCardIds: Array.isArray(payload.memoryCardIds)
      ? payload.memoryCardIds.map(String)
      : undefined,
    text: studyText,
  };

  const studyMeta = enrichRelatedStudyMeta(relatedMetaFromPayload(payload), ctx);
  const nextPayload = { ...payload, ...studyMeta };

  if (Object.keys(nextPayload).length === 0) return enriched;
  return { ...enriched, ngnPayload: nextPayload };
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
