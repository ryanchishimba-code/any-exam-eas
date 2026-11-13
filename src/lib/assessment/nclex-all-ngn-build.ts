import { blueprintCategoryIdForQuestion } from "@/lib/inventory/blueprint-domain-pool";
import {
  casePracticeSubjectIds,
  practiceSubjectIdsFor,
  studentFacingUnit,
  type PublishedUnit,
} from "@/lib/assessment/serve";
import { NCLEX_ALL_NGN_ITEM_FORMAT } from "@/lib/assessment/nclex-all-ngn-slot";
import { NCLEX_ALL_NGN_CASE_STEPS } from "@/lib/assessment/nclex-all-ngn-pack";
import type { NgnItem } from "@/lib/assessment/types";
import type { StudyQuestion } from "@/lib/questions/types";

export function clientNeedLabel(unit: PublishedUnit): string | null {
  if (unit.kind === "case") {
    const label = unit.caseDoc.primaryClientNeed?.trim();
    return label || null;
  }
  const needs = unit.item.clientNeeds;
  const subcategory = typeof needs?.subcategory === "string" ? needs.subcategory.trim() : "";
  const category = typeof needs?.category === "string" ? needs.category.trim() : "";
  return subcategory || category || null;
}

export function clientNeedIdForUnit(unit: PublishedUnit): string | null {
  return blueprintCategoryIdForQuestion("nursing", {
    subjectId: unit.subjectId,
    clientNeeds: clientNeedLabel(unit),
  });
}

export function subjectIdsForUnit(unit: PublishedUnit): string[] {
  if (unit.kind === "case") return [...casePracticeSubjectIds(unit)];
  const ids = practiceSubjectIdsFor(unit.subjectId, "nursing");
  return ids.length > 0 ? ids : unit.subjectId ? [unit.subjectId] : [];
}

function asItem(value: unknown): NgnItem {
  return value as NgnItem;
}

function questionFromFacedUnit(params: {
  faced: PublishedUnit;
  step: number;
  sourcesById: Record<string, { title: string; url: string }>;
  field: string;
  clientNeedId: string | null;
  label: string | null;
}): StudyQuestion | null {
  if (params.faced.kind === "standalone") {
    const item = asItem(params.faced.item);
    return {
      id: `ngn-${item.id}`,
      sourceIndex: params.step,
      type: "multiple_choice",
      stem: item.stem || "Clinical judgment item",
      options: [],
      correctAnswers: [],
      explanation: "",
      subjectId: params.clientNeedId ?? params.faced.subjectId ?? undefined,
      topicCategory: params.label ?? undefined,
      field: params.field,
      bankItemId: `ngn:${item.id}:v${item.version}`,
      tags: params.clientNeedId ? [`cn:${params.clientNeedId}`] : [],
      ngnPayload: {
        itemFormat: NCLEX_ALL_NGN_ITEM_FORMAT,
        caseData: {
          role: "standalone",
          subjectId: params.faced.subjectId,
          clientNeedId: params.clientNeedId,
          item,
          caseItems: [item],
          sourcesById: params.sourcesById,
        },
      },
    };
  }

  const items = params.faced.items.map(asItem);
  if (items.length !== NCLEX_ALL_NGN_CASE_STEPS) return null;
  const item = items[params.step - 1];
  if (!item) return null;
  const caseDoc = { ...params.faced.caseDoc, items };
  return {
    id: `ngn-${item.id}`,
    sourceIndex: params.step,
    type: "multiple_choice",
    stem: item.stem || "Clinical judgment item",
    options: [],
    correctAnswers: [],
    explanation: "",
    subjectId: params.clientNeedId ?? params.faced.subjectId ?? undefined,
    topicCategory: params.label ?? undefined,
    field: params.field,
    bankItemId: `ngn:${item.id}:v${item.version}`,
    caseStep: item.caseStep ?? params.step,
    tags: params.clientNeedId ? [`cn:${params.clientNeedId}`] : [],
    ngnPayload: {
      kind: "sequential",
      itemFormat: NCLEX_ALL_NGN_ITEM_FORMAT,
      setId: params.faced.caseDoc.id,
      stepIndex: params.step,
      totalSteps: NCLEX_ALL_NGN_CASE_STEPS,
      caseData: {
        role: "case",
        subjectId: params.faced.subjectId,
        clientNeedId: params.clientNeedId,
        item,
        caseItems: items,
        caseDoc,
        sourcesById: params.sourcesById,
      },
    },
  };
}

/** Face the unit once so every case step shares one sealed case id. */
export function studyQuestionsForPublishedUnit(params: {
  unit: PublishedUnit;
  sourcesById: Record<string, { title: string; url: string }>;
  field: string;
}): StudyQuestion[] | null {
  const faced = studentFacingUnit(params.unit);
  const clientNeedId = clientNeedIdForUnit(params.unit);
  const label = clientNeedLabel(params.unit);
  if (faced.kind === "standalone") {
    const question = questionFromFacedUnit({
      faced,
      step: 1,
      sourcesById: params.sourcesById,
      field: params.field,
      clientNeedId,
      label,
    });
    return question ? [question] : null;
  }
  if (faced.items.length !== NCLEX_ALL_NGN_CASE_STEPS) return null;
  const questions: StudyQuestion[] = [];
  for (let step = 1; step <= NCLEX_ALL_NGN_CASE_STEPS; step += 1) {
    const question = questionFromFacedUnit({
      faced,
      step,
      sourcesById: params.sourcesById,
      field: params.field,
      clientNeedId,
      label,
    });
    if (!question) return null;
    questions.push(question);
  }
  return questions;
}
