/**
 * Visible Review incorrect position.
 *
 * A sitting may be capped (Today's block serves 10, the remediation panel
 * serves at most 25). The open total is the same servable queue the dashboard
 * counts. When the sitting is the whole queue, the position already agrees.
 * When it is capped, the label names the full open set beside that position.
 */

export type ReviewIncorrectPosition = {
  /** Sitting position, e.g. "(1/25)". */
  sitting: string;
  /** Full open queue when this sitting is shorter, e.g. "41 open". */
  openLabel: string | null;
};

export function reviewIncorrectPosition(params: {
  /** Zero-based index in this sitting. */
  index: number;
  sittingSize: number;
  /** Full open-remediation queue. Omit outside Review incorrect. */
  openTotal?: number | null;
}): ReviewIncorrectPosition | null {
  const sittingSize = Math.floor(params.sittingSize);
  if (!Number.isFinite(sittingSize) || sittingSize < 1) return null;
  const position = Math.min(sittingSize, Math.max(1, Math.floor(params.index) + 1));
  const openRaw = params.openTotal;
  const openTotal =
    openRaw != null && Number.isFinite(openRaw) ? Math.max(0, Math.floor(openRaw)) : null;
  return {
    sitting: `(${position}/${sittingSize})`,
    openLabel: openTotal != null && openTotal > sittingSize ? `${openTotal} open` : null,
  };
}

const PENDING_REPROOF =
  "One correct leaves an item pending re-proof until a spaced re-check, or you mark it mastered.";

/** Session plan copy. Names the cap when this sitting is shorter than the open queue. */
export function reviewIncorrectSessionRationale(params: {
  sittingSize: number;
  openTotal?: number | null;
}): string {
  const sitting = Math.max(0, Math.floor(params.sittingSize));
  const openRaw = params.openTotal;
  const openTotal =
    openRaw != null && Number.isFinite(openRaw) ? Math.max(0, Math.floor(openRaw)) : sitting;
  const noun = sitting === 1 ? "item" : "items";
  const lead =
    openTotal > sitting
      ? `This sitting is ${sitting} of ${openTotal} open items.`
      : `Reviewing ${sitting} open ${noun}.`;
  return `${lead} ${PENDING_REPROOF}`;
}
