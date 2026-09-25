import { describe, expect, it, vi } from "vitest";
import type { QueryClient } from "@tanstack/react-query";
import {
  prepareClientForExamSwitch,
  resolvePathAfterExamSwitch,
  subjectCountsFieldForExamSwitch,
} from "@/lib/client/exam-switch-reset";
import { ROUTES } from "@/lib/routes";

describe("subjectCountsFieldForExamSwitch", () => {
  it("does not guess USMLE Step 2 when the learner has not confirmed a step", () => {
    expect(subjectCountsFieldForExamSwitch("usmle")).toBeNull();
    expect(subjectCountsFieldForExamSwitch("usmle", "nursing")).toBeNull();
    expect(subjectCountsFieldForExamSwitch("usmle", "usmle-step-1")).toBe("usmle-step-1");
    expect(subjectCountsFieldForExamSwitch("usmle", "usmle-step-2")).toBe("usmle-step-2");
    expect(subjectCountsFieldForExamSwitch("nclex")).toBe("nursing");
    expect(subjectCountsFieldForExamSwitch("aanp-fnp")).toBe("aanp-fnp");
  });
});

describe("prepareClientForExamSwitch subject-count prefetch", () => {
  it("skips the request for an unselected USMLE step and prefetches the confirmed one", () => {
    const prefetchQuery = vi.fn();
    const queryClient = {
      prefetchQuery,
      removeQueries: vi.fn(),
    } as unknown as QueryClient;

    prepareClientForExamSwitch(queryClient, "usmle");
    expect(prefetchQuery).not.toHaveBeenCalled();

    prepareClientForExamSwitch(queryClient, "usmle", "usmle-step-1");
    expect(prefetchQuery).toHaveBeenCalledTimes(1);
    expect(prefetchQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["subject-counts", "usmle-step-1"],
      })
    );
    expect(JSON.stringify(prefetchQuery.mock.calls)).not.toContain("usmle-step-2");
  });
});

describe("resolvePathAfterExamSwitch", () => {
  it("rewrites question bank field and clears topic session params", () => {
    const qs = new URLSearchParams(
      "field=nursing&mode=bank&subjectId=pharmacology-nursing&count=25&style=adaptive"
    );
    const href = resolvePathAfterExamSwitch(ROUTES.questionBank, qs, "naplex");
    expect(href).toContain("field=pharmacy");
    expect(href).toContain("mode=bank");
    expect(href).not.toContain("subjectId=");
    expect(href).not.toContain("count=");
    expect(href).not.toContain("style=");
  });

  it("updates library exam query and clears card/topic deep links", () => {
    const qs = new URLSearchParams("exam=nclex&card=nclex-sepsis-bundle&topic=sepsis");
    const href = resolvePathAfterExamSwitch(ROUTES.library, qs, "naplex");
    expect(href).toBe(`${ROUTES.library}?exam=naplex`);
  });

  it("moves full-exam route to the newly selected exam slug", () => {
    const href = resolvePathAfterExamSwitch(
      `${ROUTES.fullExam}/nclex`,
      new URLSearchParams(),
      "naplex"
    );
    expect(href).toBe(`${ROUTES.fullExam}/naplex`);
  });

  it("sends select-exam switch flow to the Study Hub dashboard", () => {
    expect(
      resolvePathAfterExamSwitch(ROUTES.selectExam, new URLSearchParams("switch=1"), "naplex")
    ).toBe(ROUTES.dashboard);
  });
});
