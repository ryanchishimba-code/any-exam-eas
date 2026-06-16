import type { EnrichedBankItem, RelatedStudyMeta } from "./seed-helpers";
import { enrichItem } from "./seed-helpers";
import type { ExamReference } from "./types";
import type {
  AanpFnpClinicalSystemId,
  AanpFnpDomainId,
  AanpFnpPatientAgeGroupId,
} from "./aanp-fnp/types";
import { attachAanpFnpStudyLinks } from "./aanp-fnp/study-links";

type AanpFnpMeta = Partial<EnrichedBankItem> & {
  blueprintDomain?: AanpFnpDomainId | string;
  clinicalSystem?: AanpFnpClinicalSystemId | string;
  patientAgeGroup?: AanpFnpPatientAgeGroupId | string;
  blueprintTopic?: string;
  references?: ExamReference[];
  related?: RelatedStudyMeta;
};

function baseTags(meta: AanpFnpMeta, extra: string[] = []) {
  return [
    "aanp-fnp",
    "v2",
    "AANP-FNP-2024",
    ...(meta.clinicalSystem ? [meta.clinicalSystem] : []),
    ...(meta.patientAgeGroup ? [`age-${meta.patientAgeGroup}`] : []),
    ...extra,
    ...(meta.tags ?? []),
  ];
}

function payload(meta: AanpFnpMeta, extra: Record<string, unknown> = {}) {
  const domain = (meta.blueprintDomain ?? meta.clinicalSystem ?? "assess") as string;
  const base = {
    clinicalSystem: meta.clinicalSystem,
    patientAgeGroup: meta.patientAgeGroup,
    blueprintTopic: meta.blueprintTopic,
    blueprintDomain: domain,
    ...meta.related,
    ...extra,
  };
  return attachAanpFnpStudyLinks(
    base,
    {
      blueprintDomain: domain,
      clinicalSystem: meta.clinicalSystem ?? domain,
      blueprintTopic: meta.blueprintTopic ?? "primary care",
      patientAgeGroup: meta.patientAgeGroup,
    },
    meta.related as Record<string, unknown> | undefined
  );
}

/** Clinical vignette + separate stem (AANP FNP case-style). */
export function aanpFnpVignette(
  subjectId: string,
  vignette: string,
  stem: string,
  options: readonly [string, string, string, string] | readonly string[],
  correct: string,
  explanation: string,
  meta: AanpFnpMeta
): EnrichedBankItem {
  const domain = (meta.blueprintDomain ?? subjectId) as string;
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
      blueprintDomain: domain,
      patientAgeGroup: meta.patientAgeGroup,
      difficulty: meta.difficulty ?? 4,
      references: meta.references,
      blueprintTopic: meta.blueprintTopic,
    },
    { topicCategory: subjectId, itemType: "vignette", difficulty: meta.difficulty ?? 4, blueprintDomain: domain }
  );
}

/** Short-context MCQ with optional vignette. */
export function aanpFnpMcq(
  subjectId: string,
  stem: string,
  options: [string, string, string, string],
  correct: string,
  explanation: string,
  meta: AanpFnpMeta,
  vignette = ""
): EnrichedBankItem {
  const hasVignette = Boolean(vignette?.trim());
  const domain = (meta.blueprintDomain ?? subjectId) as string;
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
      blueprintDomain: domain,
      patientAgeGroup: meta.patientAgeGroup,
      difficulty: meta.difficulty ?? 3,
      references: meta.references,
      blueprintTopic: meta.blueprintTopic,
    },
    {
      topicCategory: subjectId,
      itemType: hasVignette ? "vignette" : "mcq",
      difficulty: meta.difficulty ?? 3,
      blueprintDomain: domain,
    }
  );
}
