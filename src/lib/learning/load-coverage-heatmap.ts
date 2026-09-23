/**
 * Loads the coverage heatmap for one student and board.
 * Inventory counts are the active-question snapshot marketing and the Qbank
 * header already use. Attempt stats come from the exam roadmap.
 */

import { fieldInventoryPayload } from "@/lib/inventory/active-questions";
import {
  buildCoverageHeatmap,
  type CoverageHeatmap,
  type CoverageInventoryCategory,
} from "@/lib/learning/coverage-heatmap";
import { getExamRoadmapData, type RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import type { ExamSlug } from "@/types/edtech";

export type CoverageInventorySnapshot = {
  categories: CoverageInventoryCategory[];
  topicQuestionTotal: number;
};

export function coverageTopicsFromRoadmap(topics: RoadmapTopicRow[]) {
  return topics.map((topic) => ({
    id: topic.categoryId,
    label: topic.label,
    blueprintWeightPct: topic.blueprintWeightPct,
    attempts: topic.attempts,
    accuracyPct: topic.accuracy,
    coveragePct: topic.pushCoveragePct,
    seen: topic.pushesCompleted,
    available: topic.pushesAvailable,
    practiceHref: topic.practiceHref,
  }));
}

/** Active category counts for one field. Null when the inventory snapshot is degraded. */
export async function loadCoverageInventory(
  fieldId: string
): Promise<CoverageInventorySnapshot | null> {
  try {
    const payload = fieldInventoryPayload(fieldId, await getCachedActiveInventory());
    if (!payload) return null;
    return {
      categories: payload.categories,
      topicQuestionTotal: payload.total,
    };
  } catch (error) {
    console.warn(
      "[coverage] inventory unavailable:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function loadCoverageHeatmapForUser(
  userId: string,
  examSlug: ExamSlug,
  fieldId: string
): Promise<CoverageHeatmap | null> {
  const [roadmap, inventory] = await Promise.all([
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
    loadCoverageInventory(fieldId),
  ]);
  if (!roadmap) return null;
  return buildCoverageHeatmap({
    fieldId,
    topics: coverageTopicsFromRoadmap(roadmap.topics),
    inventoryCategories: inventory?.categories ?? null,
    topicQuestionTotal: inventory?.topicQuestionTotal ?? null,
    bankSubjectIds: getSubjectsForFieldId(fieldId).map((subject) => subject.id),
  });
}
