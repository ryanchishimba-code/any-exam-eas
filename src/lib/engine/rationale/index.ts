export {
  buildRationaleMasterSystemPrompt,
  buildRationaleUserPrompt,
  rationaleInputFromBankItem,
  rationaleInputFromExamQuestion,
  STRUCTURED_RATIONALE_JSON_SCHEMA,
  type RationaleGenerationInput,
  type StructuredRationale,
} from "../prompts/rationale-generation";

export {
  assembleStructuredRationale,
  legacyDistractorBlock,
  type AssembledRationale,
} from "./assemble-rationale";

export {
  validateStructuredRationale,
  type RationaleQualityIssue,
  type RationaleQualityVerdict,
} from "./validate-rationale";

export {
  applyAssembledRationale,
  generateStructuredRationale,
  maybeEnrichBankItemRationale,
  type GenerateRationaleResult,
  type GenerateRationaleOptions,
} from "./generate-rationale";

export { needsRationaleEnrichment, type RationaleEnrichmentReason } from "./needs-enrichment";

export {
  parseRationaleForDisplay,
  parseExpertRationaleForDisplay,
  type ParsedRationaleDisplay,
} from "./parse-rationale-display";

export {
  EXPERT_RATIONALE_META_KEY,
  EXPERT_RATIONALE_VERSION,
  readExpertRationaleFromMeta,
  type ExpertStructuredRationale,
  type LayeredDepth,
  type VisualCue,
  type CrossReference,
} from "./expert-rationale-types";

export {
  assembleExpertRationale,
  assembleConciseExpertMarkdown,
  type AssembledExpertRationale,
} from "./assemble-expert-rationale";

export {
  generateExpertNclexRationale,
  maybeEnrichExpertBankItemRationale,
  type GenerateExpertRationaleResult,
} from "./generate-expert-rationale";

export {
  buildNclexExpertSystemPrompt,
  buildNclexExpertUserPrompt,
  NCLEX_EXPERT_RATIONALE_JSON_SCHEMA,
} from "../prompts/nclex-expert-rationale";
