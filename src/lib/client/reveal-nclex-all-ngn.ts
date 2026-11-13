import type { NgnItem } from "@/lib/assessment/types";

export type RevealedNgnItem = {
  item: NgnItem;
  correct: boolean;
  points: number;
  maxPoints: number;
};

/** Official partial-credit grade. The answer key stays on the server. */
export async function revealPublishedNgnItem(
  item: { id: string; version: number },
  response: unknown
): Promise<RevealedNgnItem | null> {
  const res = await fetch("/api/study/ngn-reveal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId: item.id, version: item.version, response }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    item?: NgnItem;
    correct?: boolean;
    points?: number;
    maxPoints?: number;
    error?: string;
  };
  if (!res.ok || !data.item) return null;
  return {
    item: data.item,
    correct: data.correct === true,
    points: typeof data.points === "number" ? data.points : 0,
    maxPoints: typeof data.maxPoints === "number" ? data.maxPoints : 0,
  };
}
