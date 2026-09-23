/**
 * Gate used when a new or edited item is published.
 * Warnings (missing citation) do not block. Text and rationale errors do.
 * Legacy bank rows are checked on Approve and when they become student-visible.
 * Draft and archived content saves stay open.
 */
import type { RationaleSchemaIssue } from "./rationale-schema";
import { evaluateRationaleSchema, type ItemQaContent } from "./rationale-schema";
import { studentFacingChoiceTexts } from "./text-choices";
import { lintItemText, type TextLintIssue } from "./text-lint";

export type ItemPublishIssue = TextLintIssue | RationaleSchemaIssue;

export type ItemPublishGate = {
  ok: boolean;
  issues: ItemPublishIssue[];
};

export const ITEM_QA_SCHEMA_VERSION = "v1" as const;

export function itemRequiresPublishSchema(
  source: string | null | undefined,
  generationMeta: unknown
): boolean {
  if (source === "manual") return true;
  if (!generationMeta || typeof generationMeta !== "object" || Array.isArray(generationMeta)) {
    return false;
  }
  return (generationMeta as Record<string, unknown>).itemQaSchema === ITEM_QA_SCHEMA_VERSION;
}

/**
 * Publish/edit gate.
 * A student-visible item (active and qaPassed) cannot be newly served, or saved
 * with rationale-bearing edits, unless it meets the schema. Legacy rows that are
 * already served stay served until someone edits or republishes them.
 * Approve is gated for every source, even when it leaves qaPassed false.
 * Draft and archived content saves that do not approve or serve the item stay open.
 */
export function editedItemNeedsSchemaGate(input: {
  source: string | null | undefined;
  generationMeta: unknown;
  wasServed: boolean;
  willBeServed: boolean;
  contentEdited: boolean;
  /** Approve, or a QA/activate step on a manual or schema-v1 item. */
  publishingAction: boolean;
}): boolean {
  if (input.contentEdited && input.willBeServed) return true;
  if (!input.wasServed && input.willBeServed) return true;
  if (input.publishingAction) return true;
  return false;
}

/**
 * Whether an admin patch is an explicit publish.
 * Approve (review status) is always a publish. QA pass and restore are publishes
 * for manual and schema-v1 rows even while they are still unpublished. On legacy
 * rows those two steps are gated only when the row actually becomes student-visible.
 */
export function isExplicitAdminPublish(input: {
  source: string | null | undefined;
  generationMeta: unknown;
  reviewStatus?: string | null;
  active?: boolean;
  qaPassed?: boolean;
}): boolean {
  if (input.reviewStatus === "approved") return true;
  if (input.qaPassed !== true && input.active !== true) return false;
  return itemRequiresPublishSchema(input.source, input.generationMeta);
}

export function evaluateItemPublishGate(content: ItemQaContent): ItemPublishGate {
  const issues: ItemPublishIssue[] = [
    ...lintItemText({
      stem: content.question,
      options: studentFacingChoiceTexts({
        options: content.options,
        ngnPayload: content.ngnPayload,
      }),
      explanation: content.explanation,
    }),
    ...evaluateRationaleSchema(content),
  ];
  const ok = !issues.some((issue) => issue.severity === "error");
  return { ok, issues };
}

export function formatPublishGateError(gate: ItemPublishGate): string {
  const errors = gate.issues.filter((issue) => issue.severity === "error");
  if (!errors.length) return "Item QA blocked publish.";
  return errors
    .slice(0, 6)
    .map((issue) => issue.message)
    .join(" ");
}
