import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { buildExamDayPlan } from "@/lib/learning/exam-day-plan";

const now = new Date("2026-09-22T15:00:00.000Z");

describe("ReadinessProofPanel", () => {
  it("hides the band under 100 answers and shows the count", async () => {
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
    const toggle = screen.getByRole("button", { name: /0 of 3 practice goals met/ });
    const goals = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(goals).toHaveAttribute("hidden");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Coverage/ })).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/Need 21 more answers/)
    );
    expect(screen.queryByText("Ready")).toBeNull();
    expect(screen.queryByText("Almost")).toBeNull();
    expect(screen.getByText("A practice measure, not a pass prediction.")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });

  it("shows the untouched high-weight domain on the same heatmap as Today", async () => {
    const plan = buildExamDayPlan({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      fieldId: "nursing",
      testDate: "2026-11-03",
      now,
      totalAttempts: 12,
      recentAccuracyPct: 50,
      openIncorrect: 0,
      topics: [
        {
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 18,
          attempts: 0,
          accuracyPct: null,
          coveragePct: 0,
          practiceHref: "/question-bank?subjectId=management-of-care",
        },
        {
          id: "pharmacology",
          label: "Pharmacological Therapies",
          blueprintWeightPct: 16,
          attempts: 12,
          accuracyPct: 70,
          coveragePct: 40,
          practiceHref: "/question-bank?subjectId=pharmacology-nursing",
        },
      ],
      inventoryCategories: [
        { id: "management-of-care", label: "Management of Care", count: 1204 },
        { id: "pharmacology", label: "Pharmacological Therapies", count: 880 },
      ],
      topicQuestionTotal: 2084,
    });
    render(
      <ReadinessProofPanel
        readiness={plan.readiness}
        domainsLabel={plan.coverage.domainsLabel}
        coverage={plan.coverage}
      />
    );
    const toggle = screen.getByRole("button", { name: /0 of 3 practice goals met/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(toggle.getAttribute("aria-controls") ?? "")).toHaveAttribute(
      "hidden"
    );
    await userEvent.click(toggle);
    expect(screen.getByText("Outline depth")).toBeInTheDocument();
    expect(screen.getByText(/Management of Care/)).toBeInTheDocument();
    expect(screen.getByText("Gap")).toBeInTheDocument();
    expect(plan.items[0]?.detail).toMatch(/Management of Care/);
    expect(plan.weekPlan.goals.find((goal) => goal.id === "coverage")?.title).toMatch(
      /Management of Care/
    );
    expect(plan.coverage.countsAgree).toBe(true);
    expect(plan.coverage.chips[0]).toMatchObject({
      kind: "untouched",
      subjectId: "management-of-care",
      available: 1204,
    });
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });

  it("shows Ready with criteria once the sample and factors are met", async () => {
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
    expect(plan.readiness.headline).toBe("3 of 3 practice goals met");
    const toggle = screen.getByRole("button", { name: /3 of 3 practice goals met/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(toggle.getAttribute("aria-controls") ?? "")).toHaveAttribute(
      "hidden"
    );
    toggle.focus();
    await userEvent.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Coverage")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /percent/i }).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/Medication Use Process/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
    expect(document.body.textContent).toMatch(/not a pass prediction/i);
  });
});
