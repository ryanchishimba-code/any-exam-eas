export const NCLEX_BOARD_QUALITY_CONTROLS = {
  curatedSourceRequired: true,
  minBestScore: 0.68,
  requireDistractorRationales: true,
  requireGuidelineReferences: true,
  minExplanationLength: 120,
  minVignetteLength: 40,
  runtimeServeAudit: true,
  curatedOnlySampling: true,
} as const;

/** Pragmatic serve floor — UWorld-caliber rationales, slightly lower polish bar. */
export const NCLEX_SERVE_QUALITY_CONTROLS = {
  /** Minimum serve-ready bank before marketing parity milestone. */
  serveTargetTotal: 5000,
  minServeScore: 0.62,
  requireDistractorRationales: true,
  /** Accept structured refs OR society tie-in in explanation. */
  requireGuidelineReferences: false,
  minExplanationLength: 90,
  minVignetteLength: 35,
  /** Polished / ai-curated / elevated items allowed when other checks pass. */
  curatedSourceRequired: false,
} as const;
