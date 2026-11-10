import { beforeEach, describe, expect, it, vi } from "vitest";

const createExamInstance = vi.hoisted(() => vi.fn());
const resolveUserUsmleFieldId = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requirePremiumApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasPremiumAccess: true },
  }),
}));

vi.mock("@/lib/edtech/exam-preference", () => ({
  getUserExamPreference: async () => ({ examSlug: "usmle", fieldId: "usmle-step-2" }),
  touchExamStudied: async () => undefined,
}));

vi.mock("@/lib/edtech/question-bank-scope", async () => {
  const actual = await vi.importActual<typeof import("@/lib/edtech/question-bank-scope")>(
    "@/lib/edtech/question-bank-scope"
  );
  return { ...actual, resolveUserUsmleFieldId };
});

vi.mock("@/lib/full-exam/exam-instance", () => ({
  createExamInstance,
}));

import { POST } from "./route";

describe("POST /api/full-exam/start USMLE step", () => {
  beforeEach(() => {
    createExamInstance.mockReset();
    resolveUserUsmleFieldId.mockReset();
    resolveUserUsmleFieldId.mockResolvedValue("usmle-step-2");
  });

  it("does not refuse Step 1 when the saved step is Step 2 CK", async () => {
    const response = await POST(
      new Request("https://example.test/api/full-exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug: "usmle",
          fieldId: "usmle-step-1",
          lengthPreset: "50",
        }),
      })
    );
    const body = (await response.json()) as { code?: string };
    expect(response.status).not.toBe(403);
    expect(body.code).not.toBe("USMLE_STEP_MISMATCH");
  });
});
