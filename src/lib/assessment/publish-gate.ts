import type { NgnCase, NgnItem, SourceRef } from "@/lib/assessment/types";
import { validateItemForPublish } from "@/lib/assessment/validators/ngn";

/** Owner sign-off. This is not an RN clinical review. */
export const OWNER_ATTESTATION_COMMENT = "owner attestation (not RN review)";

/** Earlier rows used this comment with licenseType RN. Still recognized so old sign-offs stay valid. */
export const LEGACY_OWNER_ATTESTATION_COMMENT = "owner attestation";

/** Written on flag_resolutions when the owner accepts an open rn_flag. The flag text stays on the item. */
export const OWNER_FLAG_ACCEPTANCE = "accepted by owner";

export type ReviewGateInput = {
  reviewerUserId: string;
  reviewerName?: string | null;
  decision: string;
  licenseType: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  comments?: string | null;
  flagResolutions?: Record<string, string> | null;
};

/** One owner sign-off. License number and state may be unknown. Not an RN review. */
export function isOwnerAttestation(review: ReviewGateInput): boolean {
  const name = review.reviewerName?.trim() || review.reviewerUserId.trim();
  const comment = review.comments?.trim() ?? "";
  const license = review.licenseType?.trim() ?? "";
  const current = comment === OWNER_ATTESTATION_COMMENT && license.length > 0;
  const legacy =
    comment === LEGACY_OWNER_ATTESTATION_COMMENT && license === "RN";
  return review.decision === "approve" && name.length > 0 && (current || legacy);
}

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

function acceptedFlags(reviews: readonly ReviewGateInput[]): Set<string> {
  const accepted = new Set<string>();
  for (const review of reviews) {
    if (review.decision !== "approve") continue;
    for (const [flag, resolution] of Object.entries(review.flagResolutions ?? {})) {
      if (resolution?.trim()) accepted.add(flag);
    }
  }
  return accepted;
}

/** rn_flags with no non-empty resolution on an approving review. */
export function unresolvedRnFlags(
  item: Pick<NgnItem, "rnFlags">,
  reviews: readonly ReviewGateInput[]
): string[] {
  const accepted = acceptedFlags(reviews);
  return item.rnFlags.filter((flag) => typeof flag === "string" && flag.trim() && !accepted.has(flag));
}

function ownerAttestationCount(reviews: readonly ReviewGateInput[]): number {
  const owners = new Set<string>();
  for (const review of reviews) {
    if (!isOwnerAttestation(review)) continue;
    owners.add((review.reviewerName?.trim() || review.reviewerUserId).trim());
  }
  return owners.size;
}

/**
 * Validators must be green, and every rn_flag needs a resolution on an approving review.
 * The review half opens with two distinct licensed approvals, or with one owner
 * attestation (not RN review; license number and state may be null). Accepting a flag records it on
 * the review; it does not change the item's rn_flags.
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
  for (const flag of unresolvedRnFlags(item, context.reviews)) {
    errors.push(`open RN flag is not accepted: ${flag}`);
  }
  const approvers = new Set<string>();
  for (const review of context.reviews) {
    if (review.decision !== "approve") continue;
    const reviewerId = review.reviewerUserId.trim();
    if (!reviewerId || !licensePresent(review)) continue;
    approvers.add(reviewerId);
  }
  const validatorsGreen = issues.every((issue) => issue.level !== "error");
  const owners = ownerAttestationCount(context.reviews);
  const approvalCount = owners > 0 ? Math.max(approvers.size, 1) : approvers.size;
  const flagsAccepted = unresolvedRnFlags(item, context.reviews).length === 0;
  return {
    ok: validatorsGreen && flagsAccepted && (approvers.size >= 2 || owners >= 1),
    approvalCount,
    validatorsGreen,
    errors,
  };
}
