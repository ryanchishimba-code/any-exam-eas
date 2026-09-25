import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/edtech/exam-preference", () => ({
  getUserExamPreference: vi.fn(),
}));

import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { resolveQuestionBankRoute } from "@/lib/study/question-bank-route";

function redirectUrl(error: unknown): string {
  const digest = error instanceof Error ? String((error as Error & { digest?: string }).digest ?? error.message) : "";
  const match = digest.match(/NEXT_REDIRECT;[^;]*;([^;]+);/);
  return match?.[1] ? decodeURIComponent(match[1]) : digest;
}

describe("resolveQuestionBankRoute", () => {
  beforeEach(() => {
    vi.mocked(getUserExamPreference).mockResolvedValue({
      userId: "user-1",
      examSlug: "nclex",
      lastStudiedAt: null,
    });
  });

  it("keeps field=aanp-fnp and drops an invalid subjectId when the saved exam is NCLEX", async () => {
    await expect(
      resolveQuestionBankRoute("user-1", {
        field: "aanp-fnp",
        subjectId: "physiology",
      })
    ).rejects.toSatisfy((error: unknown) => {
      const url = redirectUrl(error);
      expect(url).toContain("field=aanp-fnp");
      expect(url).not.toContain("subjectId");
      expect(url).not.toContain("field=nursing");
      return true;
    });
  });

  it("keeps a subjectId that belongs to the explicit field", async () => {
    const route = await resolveQuestionBankRoute("user-1", {
      field: "aanp-fnp",
      mode: "bank",
      subjectId: "assess",
    });
    expect(route.fieldParam).toBe("aanp-fnp");
    expect(route.examSlug).toBe("aanp-fnp");
  });
});
