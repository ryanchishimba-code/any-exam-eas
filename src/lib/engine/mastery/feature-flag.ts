/** Feature flags for the Mastery / Today engine. */

export function isTodayEngineEnabled(): boolean {
  const raw =
    process.env.NEXT_PUBLIC_TODAY_ENGINE ?? process.env.TODAY_ENGINE ?? "";
  if (raw === "false" || raw === "0") return false;
  if (raw === "true" || raw === "1") return true;
  // Default on — Today is the primary NCLEX study path when grafted.
  return true;
}

/**
 * NAPLEX Mastery / Today — independent flag so pharmacy can ship behind a gate.
 * Defaults on when unset (same as NCLEX); set TODAY_ENGINE_NAPLEX=false to disable.
 */
export function isTodayEngineNaplexEnabled(): boolean {
  const raw =
    process.env.NEXT_PUBLIC_TODAY_ENGINE_NAPLEX ??
    process.env.TODAY_ENGINE_NAPLEX ??
    "";
  if (raw === "false" || raw === "0") return false;
  if (raw === "true" || raw === "1") return true;
  // Inherit global Today kill-switch when NAPLEX-specific flag is unset.
  return isTodayEngineEnabled();
}
