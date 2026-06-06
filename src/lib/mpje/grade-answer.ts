/** Grade MPJE answers including SATA (||| delimiter) and K-type combos. */
export function gradeMpjeAnswer(
  itemType: string | undefined,
  selected: string | string[] | null,
  correctAnswer: string
): boolean {
  if (!selected || (Array.isArray(selected) && selected.length === 0)) return false;
  if (itemType === "select_all") {
    const correct = correctAnswer.split("|||").map((s) => s.trim()).sort();
    const chosen = (Array.isArray(selected) ? selected : [selected])
      .map((s) => s.trim())
      .sort();
    return (
      correct.length === chosen.length &&
      correct.every((c, i) => c === chosen[i])
    );
  }
  const sel = Array.isArray(selected) ? selected[0] : selected;
  return sel?.trim() === correctAnswer.trim();
}

export function serializeMpjeAnswer(
  itemType: string | undefined,
  selected: string[]
): string | null {
  if (!selected.length) return null;
  if (itemType === "select_all") return selected.join("|||");
  return selected[0] ?? null;
}

export function parseMpjeStoredAnswer(
  itemType: string | undefined,
  stored: string | null
): string | string[] {
  if (!stored) return itemType === "select_all" ? [] : "";
  if (itemType === "select_all") return stored.split("|||").filter(Boolean);
  return stored;
}
