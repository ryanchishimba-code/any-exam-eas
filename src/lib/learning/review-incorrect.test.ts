import { describe, expect, it } from "vitest";

/**
 * Pure helper mirrored from review-incorrect selection rules for unit tests
 * without hitting Prisma.
 */
function selectStillIncorrectIds(
  incorrect: Array<{ bankItemId: string | null; questionKey: string | null }>,
  correctKeys: Set<string>,
  limit: number
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  for (const row of incorrect) {
    const id = row.bankItemId || row.questionKey;
    if (!id || seen.has(id) || correctKeys.has(id)) continue;
    if (!row.bankItemId && /^\d+$/.test(id)) continue;
    seen.add(id);
    ordered.push(id);
    if (ordered.length >= limit) break;
  }
  return ordered;
}

describe("review incorrect selection", () => {
  it("prefers still-incorrect bank ids and skips later-correct", () => {
    const ids = selectStillIncorrectIds(
      [
        { bankItemId: "a", questionKey: "a" },
        { bankItemId: "b", questionKey: "b" },
        { bankItemId: "c", questionKey: "c" },
      ],
      new Set(["b"]),
      10
    );
    expect(ids).toEqual(["a", "c"]);
  });

  it("skips numeric ephemeral keys without bankItemId", () => {
    const ids = selectStillIncorrectIds(
      [
        { bankItemId: null, questionKey: "12" },
        { bankItemId: "real", questionKey: "real" },
      ],
      new Set(),
      10
    );
    expect(ids).toEqual(["real"]);
  });

  it("respects limit", () => {
    const ids = selectStillIncorrectIds(
      [
        { bankItemId: "a", questionKey: "a" },
        { bankItemId: "b", questionKey: "b" },
        { bankItemId: "c", questionKey: "c" },
      ],
      new Set(),
      2
    );
    expect(ids).toEqual(["a", "b"]);
  });
});
