/**
 * Loads the coverage heatmap for one student and board.
 * Inventory counts are the active-question snapshot marketing and the Qbank
 * header already use. Attempt stats come from the exam roadmap.
 */

import {
  buildCoverageHeatmap,
  type CoverageHeatmap,
  type CoverageInventoryCategory,
} from "@/lib/learning/coverage-heatmap";
import { getExamRoadmapData, type RoadmapTopicRow } from "@/lib/learning/exam-roadmap";
import { getScoredFieldInventory } from "@/lib/inventory/scored-field-inventory";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
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
    const scoredField = await getScoredFieldInventory(fieldId);
    if (!scoredField) return null;
    return {
      categories: scoredField.scored.categories,
      topicQuestionTotal: scoredField.scored.total,
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
  const loaded = await loadQuestionBankCoverage(userId, examSlug, fieldId);
  return loaded.heatmap;
}

/**
 * Heatmap plus the two question-bank slots that used to block the document:
 * weak-topic marks and the open review count. One roadmap read feeds both.
 */
export async function loadQuestionBankCoverage(
  userId: string,
  examSlug: ExamSlug,
  fieldId: string
): Promise<{
  heatmap: CoverageHeatmap | null;
  openIncorrectCount: number | null;
  weakTopics: import("@/lib/learning/student-dashboard").WeakTopicRow[];
}> {
  const { getStudentWeakTopics } = await import("@/lib/learning/student-dashboard");
  const [roadmap, inventory, weakTopics] = await Promise.all([
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
    loadCoverageInventory(fieldId),
    getStudentWeakTopics(userId, [fieldId]),
  ]);
  if (!roadmap) {
    return { heatmap: null, openIncorrectCount: null, weakTopics };
  }
  return {
    heatmap: buildCoverageHeatmap({
      fieldId,
      topics: coverageTopicsFromRoadmap(roadmap.topics),
      inventoryCategories: inventory?.categories ?? null,
      topicQuestionTotal: inventory?.topicQuestionTotal ?? null,
      bankSubjectIds: getSubjectsForFieldId(fieldId).map((subject) => subject.id),
    }),
    openIncorrectCount: roadmap.openIncorrectCount,
    weakTopics,
  };
}
