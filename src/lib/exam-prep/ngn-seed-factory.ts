import type { EnrichedBankItem } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { ExamItemType } from "./types";

const CJMM = "NCSBN Clinical Judgment Model";

type NgnMeta = Partial<EnrichedBankItem> & {
  cjmmStep?: string;
  realismNote?: string;
  partialCredit?: boolean;
};

/** Concise NGN seed — vignette stays separate (no bloated combined stem). */
export function ngnConcise(
  subjectId: string,
  itemType: ExamItemType,
  vignette: string,
  stem: string,
  correctAnswer: string,
  explanation: string,
  ngnPayload: Record<string, unknown>,
  meta: NgnMeta = {}
): EnrichedBankItem {
  const { cjmmStep, partialCredit, ...rest } = meta;
  const expl = [cjmmStep ? `[NCJMM · ${cjmmStep}]` : "", explanation].filter(Boolean).join(" ");

  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options: ["A", "B", "C", "D"],
      correctAnswer,
      explanation: expl,
      itemType,
      ngnPayload: {
        ...ngnPayload,
        ...(partialCredit ? { partialCredit: true } : {}),
        ...(cjmmStep ? { cjmmStep } : {}),
      },
      tags: ["nclex-ngn", "v2", "clinical-judgment", ...(meta.tags ?? [])],
      blueprintDomain: meta.blueprintDomain ?? "nclex-physiological",
      difficulty: meta.difficulty ?? 4,
      references: meta.references ?? [{ label: CJMM, citation: "Recognize → Analyze → Prioritize → Generate → Act → Evaluate" }],
      ...rest,
    },
    { topicCategory: subjectId, itemType, difficulty: meta.difficulty ?? 4 }
  );
}

export function ngnMcq(
  subjectId: string,
  vignette: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: NgnMeta & { caseStep?: number } = {}
): EnrichedBankItem {
  const { cjmmStep, caseStep, itemType: typeOverride, ...rest } = meta;
  const resolvedType = (typeOverride ?? "vignette") as ExamItemType;
  const isCase = resolvedType === "case_study";
  return enrichItem(
    {
      subjectId,
      vignette,
      question: stem,
      options,
      correctAnswer: correct,
      explanation: [cjmmStep ? `[NCJMM · ${cjmmStep}]` : "", explanation].filter(Boolean).join(" "),
      itemType: resolvedType,
      tags: ["nclex-ngn", "v2", ...(meta.tags ?? [])],
      blueprintDomain: meta.blueprintDomain ?? "nclex-physiological",
      difficulty: meta.difficulty ?? 3,
      ngnPayload: {
        kind: isCase ? "case_study" : "mcq",
        ...(isCase ? { caseStep: caseStep ?? 1 } : {}),
        ...(cjmmStep ? { cjmmStep } : {}),
      },
      ...rest,
    },
    { topicCategory: subjectId, itemType: resolvedType }
  );
}
