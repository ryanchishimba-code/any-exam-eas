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

  it("replaces a PANCE field with the NCLEX account exam", async () => {
    await expect(
      resolveQuestionBankRoute("user-1", {
        field: "pance",
        subjectId: "history",
      })
    ).rejects.toSatisfy((error: unknown) => {
      const url = redirectUrl(error);
      expect(url).toContain("field=nursing");
      expect(url).not.toContain("field=pance");
      expect(url).not.toContain("subjectId");
      return true;
    });
  });

  it("keeps a subjectId that belongs to the account exam", async () => {
    const route = await resolveQuestionBankRoute("user-1", {
      field: "nursing",
      mode: "bank",
      subjectId: "pharmacology-nursing",
    });
    expect(route.fieldParam).toBe("nursing");
    expect(route.examSlug).toBe("nclex");
  });
});
