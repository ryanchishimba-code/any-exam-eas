/**
 * One open-remediation definition for every signed-in study surface.
 *
 * An item is open when the shared mastery rule still has it (missed, or one
 * correct and waiting on spaced re-proof) and the bank can still serve it.
 * Dashboard “open remediations”, Today’s “incorrect items still open”, and
 * Review incorrect’s queue total are this list. A sitting cap does not change it.
 * Still missed and pending re-proof add up to it. Items with no topic id are
 * a subset of it, not a second miss total.
 */

import type { ExamSlug } from "@/types/edtech";
import type { MasteryAttempt, MasteryMark } from "@/lib/learning/item-mastery";
import {
  groupOpenRemediationLoops,
  type OpenRemediationSummary,
} from "@/lib/learning/remediation-loop";
import {
  attemptsForReviewIds,
  selectLaunchReviewQueueIds,
} from "@/lib/learning/review-queue-launch";

export function countServableOpenRemediation(params: {
  examSlug: ExamSlug;
  fieldId: string;
  attempts: MasteryAttempt[];
  marks?: MasteryMark[];
  servableIds?: ReadonlySet<string> | null;
  now?: Date | string | number;
  limit?: number;
}): OpenRemediationSummary & { openIds: string[] } {
  const openIds = selectLaunchReviewQueueIds({
    attempts: params.attempts,
    marks: params.marks,
    limit: 300,
    now: params.now,
    servableIds: params.servableIds,
  });
  const summary = groupOpenRemediationLoops({
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    attempts: attemptsForReviewIds(params.attempts, openIds),
    marks: params.marks,
    now: params.now,
    limit: params.limit,
    openIds,
  });
  return { ...summary, openIds };
}
