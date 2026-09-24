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
      ? `Reviewing ${sitting} of ${openTotal} open items.`
      : `Reviewing ${sitting} open ${noun}.`;
  return `${lead} ${PENDING_REPROOF}`;
}

function finiteCount(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() ? Number(raw) : NaN;
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.floor(n));
}

/** Open-queue total carried on a review-incorrect JSON body. */
export function readReviewOpenTotal(
  body: Record<string, unknown> | null | undefined
): number | null {
  if (!body) return null;
  return finiteCount(body.openQueueTotal) ?? finiteCount(body.availableIncorrect);
}

/**
 * Sitting-size labels hide the dashboard total when every candidate is the cap.
 * Prefer the larger of the board roadmap count, the preflight count, and the
 * launch payload. A launch that only echoes how many questions it served must
 * not replace a larger open total.
 */
export function resolveReviewOpenQueueTotal(params: {
  sittingSize: number;
  /** Board-wide servable total from the same roadmap the dashboard renders. */
  boardOpenTotal?: number | null;
  /** Preflight `available` before the sitting was sliced. */
  preflightAvailable?: number | null;
  payloads?: Array<Record<string, unknown> | null | undefined>;
  headerTotals?: Array<number | null | undefined>;
}): number {
  const sitting = Math.max(0, Math.floor(params.sittingSize) || 0);
  const candidates = [
    params.boardOpenTotal,
    params.preflightAvailable,
    ...(params.headerTotals ?? []),
    ...(params.payloads ?? []).map((body) => readReviewOpenTotal(body)),
  ];
  let best = sitting;
  for (const raw of candidates) {
    const n = finiteCount(raw);
    if (n != null) best = Math.max(best, n);
  }
  return best;
}

/** Per-question line. Session ids are rewritten on prepare, so match every key we stored. */
export function reviewIncorrectQuestionReason(
  reasoning: Record<string, string> | undefined,
  question: { id: string | number; sourceIndex?: number | null; bankItemId?: string | null },
  fallback?: string
): string {
  if (!reasoning) return fallback ?? "";
  const keys = [
    String(question.id),
    question.sourceIndex != null ? String(question.sourceIndex) : "",
    question.bankItemId?.trim() ?? "",
  ].filter(Boolean);
  for (const key of keys) {
    const hit = reasoning[key];
    if (hit) return hit;
  }
  return fallback ?? "";
}
