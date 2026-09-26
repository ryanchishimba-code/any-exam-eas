/**
 * NGN pilot gate. Default off when NGN_PILOT_ENABLED is unset, empty, or not true/1.
 * Student surfaces must also have published items. This pilot publishes none.
 */
export function isNgnPilotEnabled(): boolean {
  const raw = process.env.NGN_PILOT_ENABLED?.trim().toLowerCase() ?? "";
  return raw === "true" || raw === "1";
}

/** Student-facing entry points render only when the flag is on AND published items exist. */
export function studentNgnEntryVisible(publishedItemCount: number): boolean {
  return isNgnPilotEnabled() && publishedItemCount > 0;
}
