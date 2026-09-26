/**
 * Admin NGN review gate. Default off when NGN_PILOT_ENABLED is unset, empty, or not true/1.
 * Student practice does not read this flag. A format appears only when published items exist.
 */
export function isNgnPilotEnabled(): boolean {
  const raw = process.env.NGN_PILOT_ENABLED?.trim().toLowerCase() ?? "";
  return raw === "true" || raw === "1";
}

/** Student-facing entry points render only when the flag is on AND published items exist. */
export function studentNgnEntryVisible(publishedItemCount: number): boolean {
  return isNgnPilotEnabled() && publishedItemCount > 0;
}
