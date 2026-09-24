export { findNearDuplicatePairs, type DuplicateCandidate, type DuplicatePair } from "./duplicates";
export {
  readItemQaRecord,
  withItemQaRecord,
  withSchemaFailureFlag,
  withoutSchemaFailureFlag,
  schemaFailureCodesFromIssues,
  isSchemaQaCode,
  ITEM_QA_PIPELINE,
  NEAR_DUPLICATE_CODE,
  FAILS_SCHEMA_CODE,
  type ItemQaRecord,
} from "./flag";
export {
  planNearDuplicateRetirements,
  nearDuplicateRetireWrite,
  type NearDuplicateBankRow,
  type NearDuplicateKeeperRow,
  type NearDuplicateRetireItem,
  type NearDuplicateRetirePlan,
  type NearDuplicateSkip,
  type NearDuplicateSkipReason,
} from "./retire-near-duplicates";
export { itemFingerprint, itemTokens, jaccardSimilarity, normalizeItemText } from "./normalize";
export { formatReviewMonth, resolveItemProvenance, type ItemProvenance } from "./provenance";
export { principleFieldLabel } from "./principle-label";
export {
  evaluateItemPublishGate,
  editedItemNeedsSchemaGate,
  isExplicitAdminPublish,
  formatPublishGateError,
  itemRequiresPublishSchema,
  ITEM_QA_SCHEMA_VERSION,
  type ItemPublishGate,
  type ItemPublishIssue,
} from "./publish-gate";
export {
  collectedDistractorReasons,
  contentFromStoredItem,
  evaluateRationaleSchema,
  readCitations,
  resolvedTeachFields,
  type ItemQaContent,
  type RationaleSchemaIssue,
} from "./rationale-schema";
export {
  optionsAreLetterPlaceholders,
  structuredNgnChoiceTexts,
  studentFacingChoiceTexts,
} from "./text-choices";
export {
  TEXT_FLAG_CODES,
  classifyTextFlagItem,
  planTextFlagRemediation,
  textFlagClearWrite,
  textFlagRetireReason,
  textFlagRetireWrite,
  triggeringOptionTexts,
  type TextFlagAction,
  type TextFlagBankRow,
  type TextFlagClassification,
  type TextFlagCode,
  type TextFlagPlanItem,
  type TextFlagProposedFix,
  type TextFlagRemediationPlan,
  type TextFlagSkip,
  type TextFlagSkipReason,
  type TextRetireReason,
} from "./text-flag-remediation";
export { choiceTextDefect, lintItemText, stemIsTooShort, type TextLintIssue } from "./text-lint";
export {
  GOVERNING_PRINCIPLE_AUTO_MAX,
  GOVERNING_PRINCIPLE_MIN,
  GOVERNING_PRINCIPLE_REVIEW_MAX,
  governingPrincipleWrite,
  hasGoverningPrincipleCue,
  parsePrincipleAllowlist,
  parseProposeGoverningPrincipleArgs,
  planGoverningPrincipleProposals,
  proposeGoverningPrinciple,
  rowFailsGoverningPrinciple,
  type GoverningPrincipleBankRow,
  type GoverningPrinciplePlan,
  type PrincipleClassification,
  type PrinciplePlanItem,
  type PrincipleProposal,
  type PrincipleSkip,
  type PrincipleSkipReason,
  type PrincipleSource,
  type ProposeGoverningPrincipleArgs,
} from "./governing-principle-proposal";
export {
  DISTRACTOR_REASON_MIN,
  distractorReasonWrite,
  parseDistractorAllowlist,
  parseProposeDistractorReasonArgs,
  planDistractorReasonProposals,
  proposeDistractorReasons,
  rowFailsDistractorReason,
  type DistractorOptionProposal,
  type DistractorReasonBankRow,
  type DistractorReasonClassification,
  type DistractorReasonPlan,
  type DistractorReasonPlanItem,
  type DistractorReasonProposal,
  type DistractorReasonSkip,
  type DistractorReasonSkipReason,
  type ProposeDistractorReasonArgs,
} from "./distractor-reason-proposal";
