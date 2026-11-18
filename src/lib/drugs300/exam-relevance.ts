import { DEFAULT_EXAM_RELEVANCE, type ExamRelevance } from "./schema";

/** Infer board exam relevance from therapeutic class and generic name. */
export function inferExamRelevance(therapeuticClass: string, generic: string): ExamRelevance {
  const t = therapeuticClass.toLowerCase();
  const g = generic.toLowerCase();

  // Withdrawn products kept off active exam-prep flags (same as ranitidine
  // and propoxyphene). Albiglutide is withdrawn but still tested on NCLEX,
  // USMLE, and NAPLEX, so it is not listed here. Exenatide, chloramphenicol,
  // edrophonium, and elbasvir stay flagged because they remain commonly tested.
  if (
    g.includes("propoxyphene") ||
    g.includes("ranitidine") ||
    g.includes("lixisenatide") ||
    g.includes("betrixaban") ||
    g.includes("insulin detemir")
  ) {
    return { NCLEX: false, USMLE: false, NAPLEX: false };
  }

  // Low-yield for USMLE Step 1 (still NCLEX/NAPLEX practical)
  if (
    g.includes("multivitamin") ||
    g.includes("psyllium") ||
    g.includes("simethicone") ||
    g.includes("melatonin") ||
    g.includes("polyethylene glycol") && !g.includes("electrolyte")
  ) {
    return { NCLEX: true, USMLE: false, NAPLEX: true };
  }

  // High-yield across all three boards
  if (
    /\b(statin|ace inhibitor|arb|insulin|antibiotic|ssri|snri|opioid|anticoagul|doac|beta|diuretic|ppi|benzodiazepine|antipsychotic|antiepileptic|chemotherapy|immunosuppressant)\b/.test(
      t
    )
  ) {
    return { NCLEX: true, USMLE: true, NAPLEX: true };
  }

  // Pharmacy-heavy (NAPLEX + NCLEX admin/safety; USMLE Step 2 CK)
  if (/\b(sulfonylurea|sglt2|glp-1|dpp-4|biguanide|inhaled|ics|laba|saba)\b/.test(t)) {
    return { NCLEX: true, USMLE: true, NAPLEX: true };
  }

  return { ...DEFAULT_EXAM_RELEVANCE };
}

export function mergeExamRelevance(partial?: Partial<ExamRelevance>): ExamRelevance {
  return {
    NCLEX: partial?.NCLEX ?? DEFAULT_EXAM_RELEVANCE.NCLEX,
    USMLE: partial?.USMLE ?? DEFAULT_EXAM_RELEVANCE.USMLE,
    NAPLEX: partial?.NAPLEX ?? DEFAULT_EXAM_RELEVANCE.NAPLEX,
  };
}
