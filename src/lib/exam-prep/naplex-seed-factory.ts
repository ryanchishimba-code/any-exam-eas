import type { EnrichedBankItem, RelatedStudyMeta } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { BlueprintDomain, ExamItemType } from "./types";

type NaplexMeta = Partial<EnrichedBankItem> & {
  blueprintDomain: BlueprintDomain;
  guideline?: string;
  /** Memory card / review module cross-links for QuestionRelatedLinks. */
  related?: RelatedStudyMeta;
};

function baseTags(meta: NaplexMeta, extra: string[] = []) {
  return ["naplex", "v2", "NAPLEX-2025", ...extra, ...(meta.tags ?? [])];
}

function withGuideline(explanation: string, meta: NaplexMeta) {
  const ref = meta.references?.[0]?.label ?? meta.guideline;
  return ref ? `${explanation} (${ref})` : explanation;
}

/** Concise case vignette + separate stem (EHR-style). */
export function naplexCase(
  subjectId: string,
  vignette: string,
  stem: string,
  options: string[],
  correct: string,
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: options as EnrichedBankItem["options"],
      correctAnswer: correct,
      explanation: withGuideline(explanation, meta),
      itemType: "case_based",
      ngnPayload: { kind: "case_based", ...meta.related },
      tags: baseTags(meta, ["case-vignette"]),
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "case_based", difficulty: meta.difficulty ?? 4 }
  );
}

export function naplexMcq(
  subjectId: string,
  vignette: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation: withGuideline(explanation, meta),
      itemType: "vignette",
      ngnPayload: meta.related ? { kind: "vignette", ...meta.related } : undefined,
      tags: baseTags(meta),
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "vignette" }
  );
}

export function naplexSata(
  subjectId: string,
  vignette: string,
  stem: string,
  options: string[],
  correct: string[],
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: options as EnrichedBankItem["options"],
      correctAnswer: correct.join("|||"),
      explanation: withGuideline(explanation, meta),
      itemType: "select_all",
      ngnPayload: { kind: "select_all", options, partialCredit: true, ...meta.related },
      tags: baseTags(meta, ["SATA"]),
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "select_all" }
  );
}

export function naplexOrdered(
  subjectId: string,
  vignette: string,
  stem: string,
  steps: string[],
  correctOrder: string[],
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: steps as EnrichedBankItem["options"],
      correctAnswer: correctOrder.join("|||"),
      explanation: withGuideline(explanation, meta),
      itemType: "ordered_response",
      ngnPayload: { kind: "ordered_response", options: steps },
      tags: baseTags(meta, ["ordered"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "ordered_response" }
  );
}

/** Clinical vignette + numeric constructed response (calculation embedded in case). */
export function naplexCalcCase(
  subjectId: string,
  vignette: string,
  stem: string,
  correctValue: string,
  unit: string,
  explanation: string,
  meta: NaplexMeta,
  solutionSteps?: string[]
): EnrichedBankItem {
  return naplexConstructed(
    subjectId,
    vignette,
    stem,
    correctValue,
    unit,
    explanation,
    {
      ...meta,
      tags: [...(meta.tags ?? []), "case-calculation", "physician-educator"],
      difficulty: meta.difficulty ?? 4,
    },
    solutionSteps
  );
}

export function naplexConstructed(
  subjectId: string,
  vignette: string,
  stem: string,
  correctValue: string,
  unit: string,
  explanation: string,
  meta: NaplexMeta,
  solutionSteps?: string[]
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: [correctValue],
      correctAnswer: correctValue,
      explanation: withGuideline(explanation, meta),
      solutionSteps,
      itemType: "constructed_response",
      ngnPayload: { kind: "constructed", unit, acceptUnits: [unit, unit.trim()] },
      tags: baseTags(meta, ["calculation"]),
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "constructed_response" as ExamItemType }
  );
}

export function naplexDragDrop(
  subjectId: string,
  vignette: string,
  stem: string,
  pairs: Array<{ prompt: string; match: string }>,
  distractors: string[],
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  const options = [...pairs.map((p) => p.match), ...distractors];
  const correctAnswer = pairs.map((p) => `${p.prompt}|||${p.match}`).join(",");
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: options as EnrichedBankItem["options"],
      correctAnswer,
      explanation: withGuideline(explanation, meta),
      itemType: "drag_drop",
      ngnPayload: {
        kind: "drag_drop",
        prompts: pairs.map((p) => p.prompt),
        options,
      },
      tags: baseTags(meta, ["matching"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "drag_drop" as ExamItemType }
  );
}

export function naplexExhibit(
  subjectId: string,
  vignette: string,
  stem: string,
  table: { headers: string[]; rows: string[][] },
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: NaplexMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation: withGuideline(explanation, meta),
      itemType: "exhibit",
      ngnPayload: { kind: "exhibit", table },
      tags: baseTags(meta, ["exhibit"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "exhibit" as ExamItemType }
  );
}
