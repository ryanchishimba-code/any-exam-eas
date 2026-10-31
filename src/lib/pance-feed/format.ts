/** How many fresh cards sit in front of a "review again" card. */
export const REVIEW_GAP = 3;

const SYSTEM_SHORT: Record<string, string> = {
  "Gastrointestinal/Nutrition": "GI/Nutrition",
  "Psychiatry/Behavioral": "Psychiatry",
};

export function shortSystemName(system: string): string {
  return SYSTEM_SHORT[system] ?? system;
}

export function sourceLine(source: { guideline: string; year: string }): string {
  const guideline = source.guideline.trim();
  const year = source.year.trim();
  if (!year || /\b(19|20)\d{2}\b/.test(guideline)) return guideline;
  return `${guideline} (${year})`;
}

export type FeedCardRef = {
  id: string;
};

/**
 * Unmastered cards stay in catalog order. Review-again cards return after
 * the first REVIEW_GAP fresh cards. Mastered cards stay browsable at the end.
 */
export function feedOrder(
  ids: readonly string[],
  mastered: readonly string[],
  reviewQueue: readonly string[]
): string[] {
  const known = new Set(ids);
  const masteredSet = new Set(mastered.filter((id) => known.has(id)));
  const queued: string[] = [];
  const seen = new Set<string>();
  for (const id of reviewQueue) {
    if (!known.has(id) || masteredSet.has(id) || seen.has(id)) continue;
    seen.add(id);
    queued.push(id);
  }
  const fresh = ids.filter((id) => !masteredSet.has(id) && !seen.has(id));
  const done = ids.filter((id) => masteredSet.has(id));
  return [...fresh.slice(0, REVIEW_GAP), ...queued, ...fresh.slice(REVIEW_GAP), ...done];
}

const CARD_ID = /^pance-\d+$/;

export function isPanceFeedCardId(id: string): boolean {
  return CARD_ID.test(id);
}

export type PanceFeedProgressInput = {
  mastered: string[];
  reviewQueue: string[];
  lastSeenCardId: string | null;
};

export function sanitizeProgress(
  input: unknown,
  known: ReadonlySet<string>
): PanceFeedProgressInput {
  const body =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const mastered = uniqueKnown(body.mastered, known);
  const masteredSet = new Set(mastered);
  const reviewQueue = uniqueKnown(body.reviewQueue, known).filter((id) => !masteredSet.has(id));
  const lastSeenCardId =
    typeof body.lastSeenCardId === "string" && known.has(body.lastSeenCardId)
      ? body.lastSeenCardId
      : null;
  return { mastered, reviewQueue, lastSeenCardId };
}

function uniqueKnown(value: unknown, known: ReadonlySet<string>): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string" || !known.has(item) || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
    if (out.length >= 400) break;
  }
  return out;
}
