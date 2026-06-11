import type { EnrichedBankItem, RelatedStudyMeta } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { BlueprintDomain, ExamItemType, ExamReference } from "./types";

export type UsmleStepLevel = "step1" | "step2" | "step3";

type UsmleMeta = Partial<EnrichedBankItem> & {
  blueprintDomain: BlueprintDomain | string;
  stepLevel: UsmleStepLevel;
  blueprintSystem?: string;
  references?: ExamReference[];
  /** Memory card / review module cross-links for QuestionRelatedLinks. */
  related?: RelatedStudyMeta;
};

function baseTags(meta: UsmleMeta, extra: string[] = []) {
  return ["usmle", "v2", "USMLE-2026", meta.stepLevel, ...extra, ...(meta.tags ?? [])];
}

function payload(meta: UsmleMeta, extra: Record<string, unknown> = {}) {
  return {
    stepLevel: meta.stepLevel,
    blueprintSystem: meta.blueprintSystem,
    ...meta.related,
    ...extra,
  };
}

export function usmleVignette(
  subjectId: string,
  vignette: string,
  stem: string,
  options: readonly [string, string, string, string] | readonly string[],
  correct: string,
  explanation: string,
  meta: UsmleMeta
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
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "vignette" }
  );
}

export function usmleMcq(
  subjectId: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta,
  vignette = ""
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette: vignette || undefined,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "mcq",
      ngnPayload: payload(meta, { kind: "mcq" }),
      tags: baseTags(meta),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "mcq" }
  );
}

export function usmleSequentialSet(
  subjectId: string,
  setId: string,
  vignette: string,
  items: Array<{
    stem: string;
    options: [string, string, string, string];
    correct: string;
    explanation: string;
  }>,
  meta: UsmleMeta
): EnrichedBankItem[] {
  return items.map((item, idx) =>
    enrichItem(
      {
        subjectId,
        vignette,
        question: item.stem,
        options: item.options,
        correctAnswer: item.correct,
        explanation: item.explanation,
        itemType: "sequential",
        ngnPayload: payload(meta, {
          kind: "sequential",
          setId,
          stepIndex: idx + 1,
          totalSteps: items.length,
        }),
        tags: baseTags(meta, ["sequential-item-set"]),
        blueprintDomain: meta.blueprintDomain,
        difficulty: meta.difficulty ?? 4,
        references: meta.references,
      },
      { topicCategory: subjectId, itemType: "sequential" as ExamItemType }
    )
  );
}

export function usmleAbstract(
  subjectId: string,
  abstract: { title: string; source: string; body: string },
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "abstract",
      ngnPayload: payload(meta, { kind: "abstract", abstract }),
      tags: baseTags(meta, ["abstract"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "abstract" as ExamItemType }
  );
}

export function usmleDrugAd(
  subjectId: string,
  ad: { drug: string; headline: string; indications: string; warnings: string },
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "drug_ad",
      ngnPayload: payload(meta, { kind: "drug_ad", ad }),
      tags: baseTags(meta, ["pharm-ad"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "drug_ad" as ExamItemType }
  );
}

export function usmleEthics(
  subjectId: string,
  vignette: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "ethics",
      ngnPayload: payload(meta, { kind: "ethics" }),
      tags: baseTags(meta, ["ethics", "professionalism"]),
      blueprintDomain: "usmle-ethics",
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "ethics" as ExamItemType }
  );
}

export function usmleBiostats(
  subjectId: string,
  vignette: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta,
  table?: { headers: string[]; rows: string[][] }
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "biostats",
      ngnPayload: payload(meta, { kind: "biostats", table }),
      tags: baseTags(meta, ["biostats", "epidemiology"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "biostats" as ExamItemType }
  );
}

export function usmleCcs(
  subjectId: string,
  caseData: {
    setting: string;
    presentation: string;
    vitals: string;
    timeline: string;
  },
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette: `${caseData.setting}\n${caseData.presentation}\nVitals: ${caseData.vitals}\n${caseData.timeline}`,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "ccs_prompt",
      ngnPayload: payload(meta, { kind: "ccs_prompt", caseData }),
      tags: baseTags(meta, ["ccs", "step3"]),
      blueprintDomain: meta.blueprintDomain,
      difficulty: meta.difficulty ?? 5,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "ccs_prompt" as ExamItemType }
  );
}

export function usmleExhibit(
  subjectId: string,
  vignette: string,
  stem: string,
  table: { headers: string[]; rows: string[][] },
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: UsmleMeta
): EnrichedBankItem {
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation,
      itemType: "exhibit",
      ngnPayload: payload(meta, { kind: "exhibit", table }),
      tags: baseTags(meta, ["chart-table"]),
      blueprintDomain: meta.blueprintDomain,
      references: meta.references,
    },
    { topicCategory: subjectId, itemType: "exhibit" }
  );
}
