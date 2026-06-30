/**
 * Exam Generation Engine — similarity and diversity rules for every served exam.
 * Enforces: unique clinical cases, one primary tested concept per condition,
 * non-overlapping answer choices, and board-level batch coherence.
 */
import type { BankItem } from "@/lib/question-bank";
import { clinicalCaseKey, normalizeClinicalCaseText, resolveClinicalVignetteText } from "@/lib/exam-prep/clinical-case-dedupe";
import { conceptKeysFor } from "@/lib/exam-prep/naplex/blueprint-selection";
import {
  normOptionKey,
  optionChoiceSimilarity,
} from "@/lib/questions/session-quality";

const BROAD_TOPIC_SLUGS = new Set([
  "general",
  "pathology",
  "pharmacology",
  "physiology",
  "biochemistry",
  "microbiology",
  "immunology",
  "anatomy",
  "histology",
  "med-surg",
  "fundamentals",
  "clinical",
  "medicine",
  "surgery",
  "pediatrics",
  "psychiatry",
  "obgyn",
  "ob-gyn",
  "neurology",
  "cardiology",
  "nephrology",
  "pulmonology",
  "gastroenterology",
  "hematology",
  "oncology",
  "dermatology",
  "rheumatology",
  "infectious-disease",
  "critical-care",
  "pharmacology-nursing",
  "med-surg-nursing",
  "fundamentals-nursing",
  // Broad slugs — not primary concepts on their own
  "assess",
  "diagnose",
  "plan",
  "evaluate",
  "history-physical",
  "pharmacotherapy",
  "patient-education",
  "professional-practice",
]);

const TASK_DOMAIN_SLUGS = new Set([
  "assess",
  "diagnose",
  "plan",
  "evaluate",
  "history-physical",
  "pharmacotherapy",
  "patient-education",
  "professional-practice",
]);

export type ExamSimilarityIssueCode =
  | "duplicate_clinical_case"
  | "duplicate_tested_concept"
  | "vignette_similarity"
  | "option_overlap"
  | "stem_template"
  | "repeated_distractor";

export type ExamSimilarityIssue = {
  indexA: number;
  indexB: number;
  code: ExamSimilarityIssueCode;
  message: string;
};

export const VIGNETTE_SIMILARITY_THRESHOLD = 0.45;
export const STEM_SIMILARITY_THRESHOLD = 0.55;
/** Default exam overlap bar — only near-identical option sets (was 0.55). */
export const EXAM_OPTION_OVERLAP_THRESHOLD = 0.8;

/** Tunable per exam length / pool depth. */
export type ExamUniquenessPolicy = {
  /** Max items sharing the same primary tested concept (topic/condition). */
  maxPerConcept: number;
  /** Jaccard-style option-set overlap above this counts as too similar. */
  optionOverlapThreshold: number;
  /** Block identical answer-choice sets during selection (off for long exams). */
  blockOptionOverlapInSelection: boolean;
  /** Block option overlap in final audit (warn-only when false). */
  blockOptionOverlapInAudit: boolean;
};

export const DEFAULT_EXAM_UNIQUENESS: ExamUniquenessPolicy = {
  maxPerConcept: 1,
  optionOverlapThreshold: EXAM_OPTION_OVERLAP_THRESHOLD,
  blockOptionOverlapInSelection: false,
  blockOptionOverlapInAudit: false,
};

/** Scale uniqueness to exam size so 135-Q exams can fill from finite topic banks. */
export function resolveExamUniquenessPolicy(
  requestedCount: number,
  pool?: BankItem[]
): ExamUniquenessPolicy {
  let maxPerConcept = 1;
  if (pool?.length) {
    const uniqueConcepts = new Set(pool.map(primaryTestedConceptKey)).size;
    if (uniqueConcepts > 0 && requestedCount > uniqueConcepts) {
      maxPerConcept = Math.min(6, Math.ceil(requestedCount / Math.max(uniqueConcepts, 1)));
    } else if (requestedCount >= 100) {
      maxPerConcept = 3;
    } else if (requestedCount >= 60) {
      maxPerConcept = 2;
    }
  } else if (requestedCount >= 100) {
    maxPerConcept = 3;
  } else if (requestedCount >= 60) {
    maxPerConcept = 2;
  }

  const longExam = requestedCount >= 60;
  return {
    maxPerConcept,
    optionOverlapThreshold: longExam ? 0.85 : 0.75,
    blockOptionOverlapInSelection: requestedCount <= 25,
    blockOptionOverlapInAudit: requestedCount <= 40,
  };
}

function conceptCountIn(selected: BankItem[], conceptKey: string): number {
  let n = 0;
  for (const item of selected) {
    if (primaryTestedConceptKey(item) === conceptKey) n += 1;
  }
  return n;
}

function conceptPairExceedsPolicy(
  a: BankItem,
  b: BankItem,
  policy: ExamUniquenessPolicy
): boolean {
  return (
    primaryTestedConceptKey(a) === primaryTestedConceptKey(b) && policy.maxPerConcept < 2
  );
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const t of a) {
    if (b.has(t)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function vignetteText(item: BankItem): string {
  return resolveClinicalVignetteText(item).slice(0, 400);
}

function stemLeadIn(item: BankItem): string {
  const full = item.question?.trim() ?? "";
  const vignette = resolveClinicalVignetteText(item);
  if (vignette.length >= 40 && full.length > vignette.length) {
    return full.slice(vignette.length).trim();
  }
  return full;
}

function normalizeAnswerConcept(answer: string): string {
  return normalizeClinicalCaseText(answer).slice(0, 80);
}

/** Primary board concept — blocks two AKI, two COPD exacerbations, etc. in one exam. */
export function primaryTestedConceptKey(item: BankItem): string {
  const topic = item.blueprintTopic?.trim().toLowerCase();
  const domain =
    item.blueprintDomain?.trim().toLowerCase() ||
    item.topicCategory?.trim().toLowerCase() ||
    item.subjectId?.trim().toLowerCase() ||
    "";

  if (topic && topic.length >= 3 && !BROAD_TOPIC_SLUGS.has(topic)) {
    if (domain && TASK_DOMAIN_SLUGS.has(domain)) {
      return `topic:${topic}:${domain}`;
    }
    return `topic:${topic}`;
  }

  for (const key of conceptKeysFor(item)) {
    if (key.startsWith("topic:")) return key;
    const slug = key.replace(/^tag:/, "");
    if (!BROAD_TOPIC_SLUGS.has(slug)) return `tag:${slug}`;
  }

  const category = item.topicCategory?.trim().toLowerCase();
  if (category && category.length >= 4 && !BROAD_TOPIC_SLUGS.has(category)) {
    return `category:${category}`;
  }

  return `case:${clinicalCaseKey(item)}`;
}

/** Fast O(n) check — duplicate primary concepts in one exam. */
export function examHasConceptDuplicates(items: BankItem[]): boolean {
  const seen = new Set<string>();
  for (const item of items) {
    const key = primaryTestedConceptKey(item);
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

export function optionsOverlapTooMuch(
  a: string[] | undefined,
  b: string[] | undefined,
  threshold = EXAM_OPTION_OVERLAP_THRESHOLD
): boolean {
  if (!a?.length || !b?.length) return false;
  return optionChoiceSimilarity(a, b) >= threshold;
}

/** True when adding candidate would violate same-exam uniqueness rules. */
export function candidateViolatesExamRules(
  candidate: BankItem,
  selected: BankItem[],
  policy: ExamUniquenessPolicy = DEFAULT_EXAM_UNIQUENESS
): boolean {
  const caseKey = clinicalCaseKey(candidate);
  const conceptKey = primaryTestedConceptKey(candidate);

  for (const existing of selected) {
    if (clinicalCaseKey(existing) === caseKey) return true;
  }

  if (conceptCountIn(selected, conceptKey) >= policy.maxPerConcept) return true;

  if (policy.blockOptionOverlapInSelection) {
    for (const existing of selected) {
      if (
        optionsOverlapTooMuch(candidate.options, existing.options, policy.optionOverlapThreshold)
      ) {
        return true;
      }
    }
  }

  return false;
}

export function auditExamSimilarity(items: BankItem[]): ExamSimilarityIssue[] {
  const issues: ExamSimilarityIssue[] = [];
  const seenOptions = new Map<string, number>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    for (const opt of item.options ?? []) {
      const key = normOptionKey(opt);
      if (!key || key.length < 8) continue;
      const prior = seenOptions.get(key);
      if (prior != null) {
        issues.push({
          indexA: prior,
          indexB: i,
          code: "repeated_distractor",
          message: `Items ${prior} and ${i} share distractor "${opt.slice(0, 48)}…".`,
        });
      } else {
        seenOptions.set(key, i);
      }
    }
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]!;
      const b = items[j]!;

      if (clinicalCaseKey(a) === clinicalCaseKey(b)) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "duplicate_clinical_case",
          message: `Items ${i} and ${j} repeat the same clinical vignette.`,
        });
      }

      if (primaryTestedConceptKey(a) === primaryTestedConceptKey(b)) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "duplicate_tested_concept",
          message: `Items ${i} and ${j} test the same primary concept.`,
        });
      }

      const vignetteSim = jaccard(tokenize(vignetteText(a)), tokenize(vignetteText(b)));
      if (vignetteSim >= VIGNETTE_SIMILARITY_THRESHOLD) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "vignette_similarity",
          message: `Vignettes ${i} and ${j} share ${Math.round(vignetteSim * 100)}% token overlap.`,
        });
      }

      if (optionsOverlapTooMuch(a.options, b.options)) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "option_overlap",
          message: `Items ${i} and ${j} share overlapping answer choices.`,
        });
      }

      if (j === i + 1) {
        const stemSim = jaccard(tokenize(stemLeadIn(a)), tokenize(stemLeadIn(b)));
        if (stemSim >= STEM_SIMILARITY_THRESHOLD) {
          issues.push({
            indexA: i,
            indexB: j,
            code: "stem_template",
            message: `Consecutive stems ${i} and ${j} use similar lead-in phrasing.`,
          });
        }
      }
    }
  }

  return issues;
}

/** Hard-block issues that must be healed before an exam is served. */
export const BLOCKING_SIMILARITY_CODES: ExamSimilarityIssueCode[] = [
  "duplicate_clinical_case",
  "duplicate_tested_concept",
  "option_overlap",
];

export function auditBlockingExamSimilarity(
  items: BankItem[],
  requestedCount?: number
): ExamSimilarityIssue[] {
  const policy = resolveExamUniquenessPolicy(requestedCount ?? items.length, items);
  return auditBlockingExamSimilarityFast(items, policy);
}

/** Fast blocking audit — skips vignette/stem/distractor scans (for large exams). */
export function auditBlockingExamSimilarityFast(
  items: BankItem[],
  policy: ExamUniquenessPolicy = DEFAULT_EXAM_UNIQUENESS
): ExamSimilarityIssue[] {
  const conceptCounts = new Map<string, number>();
  const issues: ExamSimilarityIssue[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]!;
      const b = items[j]!;
      if (clinicalCaseKey(a) === clinicalCaseKey(b)) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "duplicate_clinical_case",
          message: `Items ${i} and ${j} repeat the same clinical vignette.`,
        });
      }
      if (conceptPairExceedsPolicy(a, b, policy)) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "duplicate_tested_concept",
          message: `Items ${i} and ${j} test the same primary concept.`,
        });
      }
      if (
        policy.blockOptionOverlapInAudit &&
        optionsOverlapTooMuch(a.options, b.options, policy.optionOverlapThreshold)
      ) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "option_overlap",
          message: `Items ${i} and ${j} share overlapping answer choices.`,
        });
      }
    }
  }

  // Count-based concept audit when maxPerConcept > 1
  if (policy.maxPerConcept >= 2) {
    for (let i = 0; i < items.length; i++) {
      const key = primaryTestedConceptKey(items[i]!);
      conceptCounts.set(key, (conceptCounts.get(key) ?? 0) + 1);
    }
    for (const [key, count] of conceptCounts) {
      if (count > policy.maxPerConcept) {
        issues.push({
          indexA: 0,
          indexB: count,
          code: "duplicate_tested_concept",
          message: `Concept "${key}" appears ${count} times (max ${policy.maxPerConcept}).`,
        });
      }
    }
  }

  return issues;
}

export function examPassesSimilarityRules(
  items: BankItem[],
  requestedCount?: number
): boolean {
  return auditBlockingExamSimilarity(items, requestedCount).length === 0;
}

/** Greedy filter for AI generation batches — drop later items that violate rules. */
export function filterBatchByExamSimilarity(items: BankItem[]): {
  kept: BankItem[];
  dropped: number;
  issues: ExamSimilarityIssue[];
} {
  const policy = resolveExamUniquenessPolicy(items.length, items);
  const kept: BankItem[] = [];
  const issues: ExamSimilarityIssue[] = [];

  for (const item of items) {
    if (candidateViolatesExamRules(item, kept, policy)) {
      issues.push({
        indexA: Math.max(0, kept.length - 1),
        indexB: kept.length,
        code: "duplicate_tested_concept",
        message: `Dropped generated item — conflicts with an item already in the batch.`,
      });
      continue;
    }
    kept.push(item);
  }

  return { kept, dropped: items.length - kept.length, issues };
}

/** @deprecated alias — generation pipelines import this name from batch-diversity. */
export function filterBatchByDiversity(items: BankItem[]): {
  kept: BankItem[];
  dropped: number;
} {
  const { kept, dropped } = filterBatchByExamSimilarity(items);
  return { kept, dropped };
}

export type BatchDiversityIssue = ExamSimilarityIssue;

export function auditBatchDiversity(items: BankItem[]): ExamSimilarityIssue[] {
  return auditExamSimilarity(items);
}

export function batchPassesDiversity(items: BankItem[]): boolean {
  return examPassesSimilarityRules(items);
}

/** Dedupe items within a batch by clinical case key. */
export function dedupeBatchItems(items: BankItem[]): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (const item of items) {
    const key = clinicalCaseKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
