export type FeedSwipe = "next" | "prev" | "got" | "again";

/**
 * Up is the next card and down is the previous card, matching scroll-snap.
 * Right is Got it. Left is Review again.
 * A mostly-vertical move is left to the scroller; callers only dismiss the hint.
 */
export function classifyFeedSwipe(dx: number, dy: number, threshold = 56): FeedSwipe | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < threshold && ay < threshold) return null;
  if (ax > ay) return dx > 0 ? "got" : "again";
  return dy < 0 ? "next" : "prev";
}

export function feedHintStorageKey(exam: string): string {
  return `aee-feed-gesture-hint:${exam}`;
}
