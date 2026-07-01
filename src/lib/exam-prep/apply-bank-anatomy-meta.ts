import type { BankItem } from "@/lib/question-bank";
import {
  enrichRelatedStudyMeta,
  relatedMetaFromPayload,
  type StudyStructureContext,
} from "./anatomy-study-meta";

/** Concatenate bank item fields used for anatomy inference. */
export function bankItemStudyText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    item.clinicalReasoning,
    ...(item.options ?? []),
    item.correctAnswer,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Runtime patch — merge inferred structureIds into ngnPayload for every served bank row.
 * Seeds may already carry explicit ids; inference fills gaps without DB re-sync.
 */
export function applyAnatomyStudyMetaToBankItem(item: BankItem): BankItem {
  const payload = item.ngnPayload ?? {};
  const existingIds = Array.isArray(payload.structureIds)
    ? payload.structureIds.map(String)
    : [];
  if (existingIds.length >= 3) return item;

  const ctx: StudyStructureContext = {
    reviewModuleSlug:
      typeof payload.reviewModuleSlug === "string" ? payload.reviewModuleSlug : undefined,
    subjectId: item.subjectId,
    topicCategory: item.topicCategory,
    blueprintSystem:
      typeof payload.blueprintSystem === "string"
        ? payload.blueprintSystem
        : item.blueprintDomain,
    blueprintTopic:
      typeof payload.blueprintTopic === "string"
        ? payload.blueprintTopic
        : item.blueprintTopic,
    memoryCardIds: Array.isArray(payload.memoryCardIds)
      ? payload.memoryCardIds.map(String)
      : undefined,
    text: bankItemStudyText(item),
  };

  const studyMeta = enrichRelatedStudyMeta(relatedMetaFromPayload(payload), ctx);
  const structureIds = studyMeta.structureIds;
  if (!structureIds?.length || JSON.stringify(existingIds) === JSON.stringify(structureIds)) {
    return item;
  }

  return {
    ...item,
    ngnPayload: { ...payload, ...studyMeta },
  };
}
