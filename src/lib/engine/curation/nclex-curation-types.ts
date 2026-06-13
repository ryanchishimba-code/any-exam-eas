import type { BankItem } from "@/lib/question-bank";
import type { NclexAuditIssue } from "@/lib/exam-prep/nclex-bank-audit";
import type { SelfRagReflection } from "@/lib/rag/types";

export type NclexCurationStage =
  | "pass"
  | "rule_polish"
  | "ai_rewrite"
  | "failed";

export type NclexCurationTriage = {
  qualityScore: number;
  needsPolish: boolean;
  qaGateOk: boolean;
  nclexAuditOk: boolean;
  editorialWarnCodes: string[];
  issues: NclexAuditIssue[];
  issueCodes: string[];
};

export type NclexCurationResult = {
  item: BankItem;
  stage: NclexCurationStage;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
  triage: NclexCurationTriage;
  reflection?: SelfRagReflection;
  aiUsed: boolean;
  validationOk: boolean;
  validationIssues: string[];
};

export type NclexCurationOptions = {
  /** Run OpenAI rewrite when rule polish insufficient (default true if API key set). */
  useAi?: boolean;
  /** Force AI rewrite even when rule polish passes. */
  forceAi?: boolean;
  /** Skip rule-based polish (AI only). */
  aiOnly?: boolean;
  /** Minimum quality score to serve without changes (default 0.62). */
  minServeScore?: number;
  /** Minimum score after curation to accept (default 0.72). */
  minPassScore?: number;
  subjectLabel?: string;
  seed?: number;
};
