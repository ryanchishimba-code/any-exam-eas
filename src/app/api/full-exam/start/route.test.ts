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

  it("refuses a different step before creating a session", async () => {
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
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "That session does not match your selected exam step.",
      code: "USMLE_STEP_MISMATCH",
      expectedFieldId: "usmle-step-2",
    });
    expect(createExamInstance).not.toHaveBeenCalled();
  });
});
