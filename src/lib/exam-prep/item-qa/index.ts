export { findNearDuplicatePairs, type DuplicateCandidate, type DuplicatePair } from "./duplicates";
export { readItemQaRecord, withItemQaRecord, ITEM_QA_PIPELINE, type ItemQaRecord } from "./flag";
export { itemFingerprint, itemTokens, jaccardSimilarity, normalizeItemText } from "./normalize";
export { formatReviewMonth, resolveItemProvenance, type ItemProvenance } from "./provenance";
export {
  evaluateItemPublishGate,
  formatPublishGateError,
  itemRequiresPublishSchema,
  ITEM_QA_SCHEMA_VERSION,
  type ItemPublishGate,
  type ItemPublishIssue,
} from "./publish-gate";
export {
  contentFromStoredItem,
  evaluateRationaleSchema,
  readCitations,
  type ItemQaContent,
  type RationaleSchemaIssue,
} from "./rationale-schema";
export { lintItemText, type TextLintIssue } from "./text-lint";
