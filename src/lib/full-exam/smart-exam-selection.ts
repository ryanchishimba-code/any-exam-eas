/**
 * Shared smart selection for Roadmap + Full Exam launches.
 * Deprioritizes already-seen items and biases toward weak blueprint areas.
 */

import type { BankItem } from "@/lib/question-bank";
import type { FullExamLaunchMode } from "@/lib/full-exam/launch-modes";
import { getPrefetchedQuestionIds } from "@/lib/full-exam/exam-instance";
import {
  getUserExamHistory,
  loadSeenQuestionIds,
} from "@/lib/learning/exam-progress";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { ExamSlug } from "@/types/edtech";

export type SmartExamSelection = {
  launchMode: FullExamLaunchMode;
  excludeQuestionIds: Set<string>;
  focusAreas: string[];
  retakeQuestionIds: string[] | null;
  retakeOfSessionId: string | null;
  resumeSessionId: string | null;
  excludeSeenApplied: boolean;
};

/** Prefer unseen items; fill leftover slots from seen pool so length stays met. */
export function preferUnseenBankItems(
  items: BankItem[],
  excludeQuestionIds: Set<string> | undefined,
  limit: number
): { items: BankItem[]; excludeSeenApplied: boolean } {
  if (limit <= 0) {
    return { items: [], excludeSeenApplied: false };
  }

  const unseen: BankItem[] = [];
  const seen: BankItem[] = [];
  const used = new Set<string>();
  const exclude = excludeQuestionIds?.size ? excludeQuestionIds : null;

  for (const item of items) {
    const id = item.id ?? "";
    if (!id || used.has(id)) continue;
    used.add(id);
    if (exclude?.has(id)) seen.push(item);
    else unseen.push(item);
  }

  const picked = [...unseen, ...seen].slice(0, limit);
  return {
    items: picked,
    excludeSeenApplied: Boolean(
      exclude &&
        (unseen.length > 0 ||
          picked.some((i) => Boolean(i.id && exclude.has(i.id))))
    ),
  };
}

export async function resolveSmartExamSelection(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  launchMode: FullExamLaunchMode;
  /** Caller-supplied focus; merges with roadmap weak areas for focus_weak. */
  focusAreas?: string[];
}): Promise<SmartExamSelection> {
  const { userId, examSlug, fieldId, launchMode } = params;
  const history = await getUserExamHistory(userId, examSlug, { fieldId });

  if (launchMode === "continue_learning" && history.inProgress) {
    return {
      launchMode,
      excludeQuestionIds: new Set(),
      focusAreas: [],
      retakeQuestionIds: null,
      retakeOfSessionId: null,
      resumeSessionId: history.inProgress.id,
      excludeSeenApplied: false,
    };
  }

  if (launchMode === "retake_last" && history.lastCompleted) {
    const ids = getPrefetchedQuestionIds(history.lastCompleted.analysis);
    if (ids.length > 0) {
      return {
        launchMode,
        excludeQuestionIds: new Set(),
        focusAreas: [],
        retakeQuestionIds: ids,
        retakeOfSessionId: history.lastCompleted.id,
        resumeSessionId: null,
        excludeSeenApplied: false,
      };
    }
  }

  let focusAreas = [...(params.focusAreas ?? [])];
  if (launchMode === "focus_weak" || launchMode === "continue_learning") {
    const roadmap = await getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    });
    if (roadmap?.launch.weakFocusAreas.length) {
      const merged = new Set([...focusAreas, ...roadmap.launch.weakFocusAreas]);
      focusAreas = [...merged].slice(0, 8);
    } else if (history.lastCompleted?.weakAreas && Array.isArray(history.lastCompleted.weakAreas)) {
      for (const area of history.lastCompleted.weakAreas as { topic?: string }[]) {
        if (area?.topic) focusAreas.push(area.topic);
      }
      focusAreas = [...new Set(focusAreas)].slice(0, 8);
    }
  }

  const excludeQuestionIds =
    launchMode === "new_exam" ||
    launchMode === "focus_weak" ||
    launchMode === "continue_learning"
      ? await loadSeenQuestionIds(userId, fieldId)
      : new Set<string>();

  return {
    launchMode,
    excludeQuestionIds,
    focusAreas,
    retakeQuestionIds: null,
    retakeOfSessionId: null,
    resumeSessionId: null,
    excludeSeenApplied: excludeQuestionIds.size > 0,
  };
}
