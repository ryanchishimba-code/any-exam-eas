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
