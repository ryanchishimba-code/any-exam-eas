import type { ResponseFormat, ScoringRule } from "@/lib/assessment/types";

export type CjmmStep = {
  step: number;
  id: string;
  label: string;
};

/**
 * Board-generic clinical-case profile.
 * NCLEX-RN is the first implementation. Other boards stay typed stubs.
 */
export type BoardProfile = {
  id: string;
  caseLength: number;
  stepTaxonomy: readonly CjmmStep[];
  allowedFormats: readonly ResponseFormat[];
  shapeLimits: {
    bowtie: { conditionKeys: number; actionKeys: number; monitorKeys: number };
    minFormatsPerCase: number;
  };
  scoringMap: Record<ResponseFormat, ScoringRule>;
  /** Seeded per-attempt shuffle. Highlight tokens and matrix rows stay authored. */
  shuffleFormats: readonly ResponseFormat[];
  sourceDomains: readonly string[];
};
