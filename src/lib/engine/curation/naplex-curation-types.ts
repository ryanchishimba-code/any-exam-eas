import type { BankItem } from "@/lib/question-bank";
import type { NaplexAuditIssue } from "@/lib/exam-prep/naplex-bank-audit";
import type { SelfRagReflection } from "@/lib/rag/types";

export type NaplexCurationStage =
  | "pass"
  | "rule_polish"
  | "ai_rewrite"
  | "failed";

export type NaplexCurationTriage = {
  qualityScore: number;
  needsPolish: boolean;
  qaGateOk: boolean;
  naplexAuditOk: boolean;
  issues: NaplexAuditIssue[];
  issueCodes: string[];
};

export type NaplexCurationResult = {
  item: BankItem;
  stage: NaplexCurationStage;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
  triage: NaplexCurationTriage;
  reflection?: SelfRagReflection;
  aiUsed: boolean;
  validationOk: boolean;
  validationIssues: string[];
};

export type NaplexCurationOptions = {
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
