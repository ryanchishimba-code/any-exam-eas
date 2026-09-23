import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { buildExamDayPlan } from "@/lib/learning/exam-day-plan";

const now = new Date("2026-09-22T15:00:00.000Z");

describe("ReadinessProofPanel", () => {
  it("hides the band under 100 answers and shows the count", () => {
    const plan = buildExamDayPlan({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      fieldId: "nursing",
      now,
      totalAttempts: 19,
      recentAccuracyPct: 53,
      recentWindowAttempts: 19,
      openIncorrect: 4,
      topics: [],
    });
    render(<ReadinessProofPanel readiness={plan.readiness} />);
    expect(screen.getByRole("heading", { name: "Not enough practice yet" })).toBeInTheDocument();
    expect(screen.getByText(/19 of 100 answered/)).toBeInTheDocument();
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.queryByText("Almost")).toBeNull();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });

  it("shows Ready with criteria once the sample and factors are met", () => {
    const plan = buildExamDayPlan({
      examSlug: "naplex",
      examName: "NAPLEX",
      fieldId: "pharmacy",
      now,
      totalAttempts: 140,
      recentAccuracyPct: 81,
      recentWindowAttempts: 100,
      openIncorrect: 1,
      topics: [
        {
          id: "medication-use-process",
          label: "Medication Use Process",
          blueprintWeightPct: 40,
          attempts: 40,
          accuracyPct: 80,
          coveragePct: 30,
          practiceHref: "/question-bank?subjectId=medication-use-process",
        },
        {
          id: "safety",
          label: "Safe and Effective Care",
          blueprintWeightPct: 60,
          attempts: 50,
          accuracyPct: 82,
          coveragePct: 40,
          practiceHref: "/question-bank?subjectId=safety",
        },
      ],
    });
    render(<ReadinessProofPanel readiness={plan.readiness} />);
    expect(plan.readiness.label).toBe("Ready");
    expect(screen.getByRole("heading", { name: "Ready" })).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("Recent accuracy")).toBeInTheDocument();
    expect(screen.getByText("Remediation")).toBeInTheDocument();
    expect(screen.getAllByText("Met").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Medication Use Process")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
    expect(document.body.textContent).toMatch(/not a pass prediction/i);
  });
});
