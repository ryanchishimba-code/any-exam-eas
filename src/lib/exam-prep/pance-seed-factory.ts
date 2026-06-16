import type { EnrichedBankItem, RelatedStudyMeta } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { BlueprintDomain, ExamReference } from "./types";

type PanceMeta = Partial<EnrichedBankItem> & {
  blueprintDomain?: BlueprintDomain | string;
  blueprintSystem?: string;
  /** NCCPA task category slug for roadmap task-dimension analytics. */
  taskCategory?: string;
  /** Specific high-yield topic (e.g. ACS, sepsis). */
  blueprintTopic?: string;
  references?: ExamReference[];
  /** Memory card / review module cross-links for QuestionRelatedLinks. */
  related?: RelatedStudyMeta;
};

function baseTags(meta: PanceMeta, extra: string[] = []) {
  return ["pance", "v2", "PANCE-2025", ...(meta.blueprintSystem ? [meta.blueprintSystem] : []), ...extra, ...(meta.tags ?? [])];
}

function payload(meta: PanceMeta, extra: Record<string, unknown> = {}) {
  return {
    blueprintSystem: meta.blueprintSystem,
    taskCategory: meta.taskCategory,
    blueprintTopic: meta.blueprintTopic,
    ...meta.related,
    ...extra,
  };
}

/** Clinical vignette + separate stem (PANCE case-style). */
export function panceVignette(
  subjectId: string,
  vignette: string,
  stem: string,
  options: readonly [string, string, string, string] | readonly string[],
  correct: string,
  explanation: string,
  meta: PanceMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: [...options],
      correctAnswer: correct,
      explanation,
      itemType: "vignette",
      ngnPayload: payload(meta, { kind: "vignette" }),
      tags: baseTags(meta, ["clinical-vignette"]),
      blueprintDomain: meta.blueprintDomain ?? subjectId,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "vignette", difficulty: meta.difficulty ?? 4 }
  );
}

/** Short-context MCQ with optional vignette. */
export function panceMcq(
  subjectId: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: PanceMeta,
  vignette = ""
): EnrichedBankItem {
  const hasVignette = Boolean(vignette?.trim());
  return enrichItem(
    {
      subjectId,
      vignette: hasVignette ? vignette : undefined,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: hasVignette ? "vignette" : "mcq",
      ngnPayload: payload(meta, { kind: hasVignette ? "vignette" : "mcq" }),
      tags: baseTags(meta),
      blueprintDomain: meta.blueprintDomain ?? subjectId,
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: hasVignette ? "vignette" : "mcq", difficulty: meta.difficulty ?? 3 }
  );
}
