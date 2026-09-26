import type { NgnCase, NgnItem, SourceRef } from "@/lib/assessment/types";
import { validateItemForPublish } from "@/lib/assessment/validators/ngn";

export type ReviewGateInput = {
  reviewerUserId: string;
  decision: string;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
};

function licensePresent(review: ReviewGateInput): boolean {
  return Boolean(
    review.licenseType?.trim() && review.licenseNumber?.trim() && review.licenseState?.trim()
  );
}

/** Two distinct approving reviewers of this version, each with license fields. */
export function reviewGateOpen(reviews: readonly ReviewGateInput[]): boolean {
  const approvers = new Set<string>();
  for (const review of reviews) {
    if (review.decision !== "approve") continue;
    const reviewerId = review.reviewerUserId.trim();
    if (!reviewerId || !licensePresent(review)) continue;
    approvers.add(reviewerId);
  }
  return approvers.size >= 2;
}

export type PublishGateResult = {
  ok: boolean;
  approvalCount: number;
  validatorsGreen: boolean;
  errors: string[];
};

/**
 * Full publish gate: validators green AND two licensed approvals of this version.
 * Read-only. This pilot has no publish button.
 */
export function canPublish(
  item: NgnItem,
  context: {
    sources: readonly SourceRef[];
    caseDoc?: NgnCase | null;
    reviews: readonly ReviewGateInput[];
  }
): PublishGateResult {
  const issues = validateItemForPublish(item, context);
  const errors = issues.filter((issue) => issue.level === "error").map((issue) => issue.message);
  const approvers = new Set<string>();
  for (const review of context.reviews) {
    if (review.decision !== "approve") continue;
    const reviewerId = review.reviewerUserId.trim();
    if (!reviewerId || !licensePresent(review)) continue;
    approvers.add(reviewerId);
  }
  const validatorsGreen = errors.length === 0;
  return {
    ok: validatorsGreen && approvers.size >= 2,
    approvalCount: approvers.size,
    validatorsGreen,
    errors,
  };
}
