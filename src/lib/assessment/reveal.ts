/** 'baseline' is always visible. Later tags appear when the student reaches them. */
export function isTimeVisible(tag: string, currentId: string, orderedIds: readonly string[]): boolean {
  if (tag === "baseline") return true;
  const current = orderedIds.indexOf(currentId);
  const index = orderedIds.indexOf(tag);
  if (current < 0 || index < 0) return false;
  return index <= current;
}

export function isNewestTime(tag: string, currentId: string): boolean {
  return tag !== "baseline" && tag === currentId;
}
