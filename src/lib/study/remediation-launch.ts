import { isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { ROUTES } from "@/lib/routes";

export type RemediationMode = "review_incorrect" | "weak_areas";

/** Same bar as weak-area selection: 2+ attempts and miss rate at least 40%. */
export const WEAK_TOPIC_MIN_ATTEMPTS = 2;
export const WEAK_TOPIC_MIN_MISS_RATE = 0.4;

export type RemediationLaunchDecision =
  | {
      status: "empty";
      mode: RemediationMode;
      available: 0;
      message: string;
    }
  | {
      status: "launch";
      mode: RemediationMode;
      available: number;
      count: number;
    }
  | {
      status: "error";
      mode: RemediationMode;
      message: string;
    };

export function decideRemediationLaunch(params: {
  mode: RemediationMode;
  /** null when the count could not be read */
  eligibleCount: number | null;
  requestedCount: number;
  error?: string | null;
}): RemediationLaunchDecision {
  const requested = Math.max(1, Math.round(params.requestedCount) || 1);

  if (params.error) {
    return { status: "error", mode: params.mode, message: params.error };
  }

  if (params.eligibleCount == null || !Number.isFinite(params.eligibleCount)) {
    return {
      status: "error",
      mode: params.mode,
      message:
        params.mode === "review_incorrect"
          ? "Could not check incorrect items. Try again."
          : "Could not check weak areas. Try again.",
    };
  }

  const available = Math.max(0, Math.floor(params.eligibleCount));
  if (available === 0) {
    return {
      status: "empty",
      mode: params.mode,
      available: 0,
      message:
        params.mode === "review_incorrect"
          ? "0 incorrect items to review."
          : "0 weak areas to drill yet.",
    };
  }

  return {
    status: "launch",
    mode: params.mode,
    available,
    count: Math.min(available, requested),
  };
}

const EMPTY_CODES = new Set(["NO_INCORRECT_ITEMS", "NO_WEAK_AREAS"]);

export function decisionFromRemediationPayload(params: {
  mode: RemediationMode;
  ok: boolean;
  requestedCount: number;
  body: {
    error?: unknown;
    code?: unknown;
    availableIncorrect?: unknown;
    weakTopicCount?: unknown;
  };
}): RemediationLaunchDecision {
  const code = typeof params.body.code === "string" ? params.body.code : "";
  if (EMPTY_CODES.has(code)) {
    return decideRemediationLaunch({
      mode: params.mode,
      eligibleCount: 0,
      requestedCount: params.requestedCount,
    });
  }

  if (!params.ok) {
    const message =
      typeof params.body.error === "string" && params.body.error.trim()
        ? params.body.error
        : params.mode === "review_incorrect"
          ? "Could not start Review incorrect. Try again."
          : "Could not start Weak areas. Try again.";
    return decideRemediationLaunch({
      mode: params.mode,
      eligibleCount: null,
      requestedCount: params.requestedCount,
      error: message,
    });
  }

  const raw =
    params.mode === "review_incorrect"
      ? params.body.availableIncorrect
      : params.body.weakTopicCount;
  const eligibleCount = typeof raw === "number" ? raw : null;
  return decideRemediationLaunch({
    mode: params.mode,
    eligibleCount,
    requestedCount: params.requestedCount,
  });
}

export type WeaknessSignal = {
  tag: string;
  attempts: number;
  misses: number;
  missRate: number;
};

export function countEligibleWeakTopics(
  weakness: WeaknessSignal[],
  subjectId?: string | null
): number {
  const keys = new Set<string>();
  for (const row of weakness) {
    if (!topicInSubjectScope(row.tag, subjectId)) continue;
    if (row.attempts < WEAK_TOPIC_MIN_ATTEMPTS) continue;
    if (row.missRate < WEAK_TOPIC_MIN_MISS_RATE) continue;
    const tag = row.tag.trim().toLowerCase();
    if (!tag) continue;
    const prefixed =
      tag.startsWith("subject:") || tag.startsWith("tag:") ? tag : `tag:${tag}`;
    if (isInternalMasteryConceptKey(tag) || isInternalMasteryConceptKey(prefixed)) continue;
    keys.add(tag);
  }
  return keys.size;
}

function topicInSubjectScope(tag: string, subjectId?: string | null): boolean {
  if (!subjectId || subjectId === MIXED_SUBJECT_ID) return true;
  const norm = tag.trim().toLowerCase();
  const subject = subjectId.trim().toLowerCase();
  return norm === subject || norm === `subject:${subject}` || norm.endsWith(`:${subject}`);
}

export function launchQueryForEmpty(mode: RemediationMode): "review-empty" | "weak-empty" {
  return mode === "review_incorrect" ? "review-empty" : "weak-empty";
}

export function emptyModeFromLaunchQuery(
  launch: string | null | undefined
): RemediationMode | null {
  if (launch === "review-empty") return "review_incorrect";
  if (launch === "weak-empty") return "weak_areas";
  return null;
}

/** Review incorrect must paint the launcher or the empty notice, never the session skeleton. */
export function reviewIncorrectBlocksSessionSkeleton(params: {
  bankStyle: string;
  styleParam: string | null | undefined;
}): boolean {
  return params.bankStyle === "review_incorrect" || params.styleParam === "review_incorrect";
}

/**
 * Autostart a set only when the URL is not already an honest empty result.
 * An empty launch stays on screen instead of clearing into a loading skeleton.
 */
export function shouldAutostartPractice(params: {
  autostart: boolean;
  launch: string | null | undefined;
  hasQuestions: boolean;
  loading: boolean;
}): boolean {
  if (!params.autostart || params.hasQuestions || params.loading) return false;
  if (emptyModeFromLaunchQuery(params.launch)) return false;
  return true;
}

function bankHref(fieldId: string, subjectId: string): string {
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId,
    style: "standard",
    count: "25",
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

export function remediationEmptyHrefs(
  fieldId: string,
  subjectId?: string | null
): { standardHref: string; mixedHref: string } {
  const subject =
    subjectId && subjectId !== MIXED_SUBJECT_ID ? subjectId : MIXED_SUBJECT_ID;
  return {
    standardHref: bankHref(fieldId, subject),
    mixedHref: bankHref(fieldId, MIXED_SUBJECT_ID),
  };
}
