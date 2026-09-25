import { beforeEach, describe, expect, it, vi } from "vitest";

const startReadinessCheck = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requireStudyApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasStudyAccess: true },
  }),
}));

vi.mock("@/lib/learning/readiness-check/service", () => {
  class ReadinessCheckError extends Error {
    readonly code: "thin_bank" | "no_check" | "not_playable";
    constructor(message: string, code: "thin_bank" | "no_check" | "not_playable") {
      super(message);
      this.name = "ReadinessCheckError";
      this.code = code;
    }
  }
  return {
    ReadinessCheckError,
    resolveReadinessBoard: async () => ({ examSlug: "nclex", fieldId: "nursing" }),
    startReadinessCheck,
    loadReadinessPrompt: vi.fn(),
  };
});

import { POST } from "./route";
import { ReadinessCheckError } from "@/lib/learning/readiness-check/service";

describe("POST /api/readiness/check", () => {
  beforeEach(() => {
    startReadinessCheck.mockReset();
  });

  it("returns 409 when the assembled check is shorter than the minimum", async () => {
    startReadinessCheck.mockRejectedValue(
      new ReadinessCheckError(
        "Not enough clean standard questions to build a 24-question check for this board yet. Flagged, retired, and non-multiple-choice items are left out.",
        "thin_bank"
      )
    );

    const response = await POST(
      new Request("https://www.anyexameasy.com/api/readiness/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error:
        "Not enough clean standard questions to build a 24-question check for this board yet. Flagged, retired, and non-multiple-choice items are left out.",
      code: "thin_bank",
    });
  });
});
