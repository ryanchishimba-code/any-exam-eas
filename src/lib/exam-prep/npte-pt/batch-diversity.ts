/**
 * Within-batch diversity checks for NPTE-PT generation (batch of 10 rule).
 */
import type { BankItem } from "@/lib/question-bank";

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

function optionOverlap(a: string[], b: string[]): number {
  const norm = (s: string) => s.trim().toLowerCase();
  const setA = new Set(a.map(norm));
  let shared = 0;
  for (const opt of b) {
    if (setA.has(norm(opt))) shared++;
  }
  return shared / Math.max(a.length, b.length, 1);
}

export type BatchDiversityIssue = {
  indexA: number;
  indexB: number;
  code: "vignette_similarity" | "option_overlap" | "stem_template";
  message: string;
};

const VIGNETTE_SIMILARITY_THRESHOLD = 0.45;
const OPTION_OVERLAP_THRESHOLD = 0.5;
const STEM_SIMILARITY_THRESHOLD = 0.55;

/** Scan a batch for diversity violations (consecutive pairs + sliding window of 10). */
export function auditBatchDiversity(items: BankItem[]): BatchDiversityIssue[] {
  const issues: BatchDiversityIssue[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length && j < i + 10; j++) {
      const a = items[i]!;
      const b = items[j]!;

      const vignetteA = (a.vignette ?? a.scenario ?? a.question).slice(0, 400);
      const vignetteB = (b.vignette ?? b.scenario ?? b.question).slice(0, 400);
      const vignetteSim = jaccard(tokenize(vignetteA), tokenize(vignetteB));
      if (vignetteSim >= VIGNETTE_SIMILARITY_THRESHOLD) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "vignette_similarity",
          message: `Vignettes ${i} and ${j} share ${Math.round(vignetteSim * 100)}% token overlap.`,
        });
      }

      const optOverlap = optionOverlap(a.options, b.options);
      if (optOverlap >= OPTION_OVERLAP_THRESHOLD) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "option_overlap",
          message: `Items ${i} and ${j} share ${Math.round(optOverlap * 100)}% answer choices.`,
        });
      }

      const stemSim = jaccard(tokenize(a.question), tokenize(b.question));
      if (stemSim >= STEM_SIMILARITY_THRESHOLD && j === i + 1) {
        issues.push({
          indexA: i,
          indexB: j,
          code: "stem_template",
          message: `Consecutive stems ${i} and ${j} use similar lead-in phrasing.`,
        });
      }
    }
  }

  return issues;
}

export function batchPassesDiversity(items: BankItem[]): boolean {
  return auditBatchDiversity(items).length === 0;
}

/** Keep all items — variability constraints removed; use quality gates only. */
export function filterBatchByDiversity(items: BankItem[]): {
  kept: BankItem[];
  dropped: number;
} {
  return { kept: items, dropped: 0 };
}

/** Dedupe items within a batch by vignette + stem hash. */
export function dedupeBatchItems(items: BankItem[]): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (const item of items) {
    const key = `${(item.vignette ?? "").slice(0, 120)}|${item.question.slice(0, 80)}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
