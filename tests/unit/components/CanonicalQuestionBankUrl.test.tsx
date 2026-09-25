/**
 * F2 — a subjectId from another board is stripped with router.replace.
 *
 *   npx vitest run --project component tests/unit/components/CanonicalQuestionBankUrl.test.tsx
 */
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CanonicalQuestionBankUrl } from "@/components/study/question-bank/CanonicalQuestionBankUrl";

const mockReplace = vi.fn();
const mockSearch = vi.fn(() => "field=aanp-fnp&mode=bank&subjectId=physiology");

vi.mock("next/navigation", () => ({
  usePathname: () => "/question-bank",
  useRouter: () => ({ replace: mockReplace, prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(mockSearch()),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockSearch.mockReturnValue("field=aanp-fnp&mode=bank&subjectId=physiology");
});

describe("CanonicalQuestionBankUrl", () => {
  it("replaces a stale subjectId that does not belong to the active field", async () => {
    render(<CanonicalQuestionBankUrl fieldId="aanp-fnp" />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
    });

    const href = String(mockReplace.mock.calls[0]?.[0]);
    expect(href.startsWith("/question-bank?")).toBe(true);
    expect(href).toContain("field=aanp-fnp");
    expect(href).toContain("mode=bank");
    expect(href).not.toContain("subjectId");
    expect(mockReplace.mock.calls[0]?.[1]).toEqual({ scroll: false });
  });

  it("leaves a subject that belongs to the field alone", async () => {
    mockSearch.mockReturnValue("field=usmle-step-1&mode=bank&subjectId=physiology");
    render(<CanonicalQuestionBankUrl fieldId="usmle-step-1" />);

    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
