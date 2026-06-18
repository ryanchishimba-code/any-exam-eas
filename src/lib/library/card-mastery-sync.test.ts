import { describe, expect, it } from "vitest";
import {
  findLocalMasteryDeltas,
  mergeMasteryStores,
} from "./card-mastery-sync";

describe("card-mastery-sync", () => {
  it("mergeMasteryStores keeps the newest updatedAt per card", () => {
    const a = {
      "card-1": { status: "got-it" as const, updatedAt: "2026-01-01T00:00:00.000Z" },
      "card-2": { status: "need-review" as const, updatedAt: "2026-01-02T00:00:00.000Z" },
    };
    const b = {
      "card-1": { status: "need-review" as const, updatedAt: "2026-01-03T00:00:00.000Z" },
      "card-3": { status: "got-it" as const, updatedAt: "2026-01-01T00:00:00.000Z" },
    };
    const merged = mergeMasteryStores(a, b);
    expect(merged["card-1"]?.status).toBe("need-review");
    expect(merged["card-2"]?.status).toBe("need-review");
    expect(merged["card-3"]?.status).toBe("got-it");
  });

  it("findLocalMasteryDeltas returns only newer or missing server rows", () => {
    const local = {
      "card-1": { status: "got-it" as const, updatedAt: "2026-01-05T00:00:00.000Z" },
      "card-2": { status: "need-review" as const, updatedAt: "2026-01-01T00:00:00.000Z" },
    };
    const server = {
      "card-1": { status: "need-review" as const, updatedAt: "2026-01-04T00:00:00.000Z" },
      "card-2": { status: "got-it" as const, updatedAt: "2026-01-02T00:00:00.000Z" },
    };
    const deltas = findLocalMasteryDeltas(local, server);
    expect(deltas).toHaveLength(1);
    expect(deltas[0]?.cardId).toBe("card-1");
  });
});
