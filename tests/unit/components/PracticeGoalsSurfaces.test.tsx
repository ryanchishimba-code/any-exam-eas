import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StudentAnalyticsDashboard } from "@/components/analytics/StudentAnalyticsDashboard";
import { DashboardGraphicHero } from "@/components/dashboard/DashboardGraphicHero";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { buildExamDayPlan } from "@/lib/learning/exam-day-plan";
import { emptyFormatPracticeStats } from "@/lib/study/practice-format";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/analytics",
}));

const plan = buildExamDayPlan({
  examSlug: "nclex",
  examName: "NCLEX-RN",
  fieldId: "nursing",
  now: new Date("2026-11-07T12:00:00.000Z"),
  totalAttempts: 80,
  recentAccuracyPct: 82,
  recentWindowAttempts: 80,
  openIncorrect: 1,
  topics: [
    {
      id: "safety",
      label: "Safety",
      blueprintWeightPct: 40,
      attempts: 40,
      accuracyPct: 80,
      coveragePct: 50,
      practiceHref: "/question-bank?subjectId=safety",
    },
    {
      id: "pharm",
      label: "Pharm",
      blueprintWeightPct: 60,
      attempts: 40,
      accuracyPct: 84,
      coveragePct: 50,
      practiceHref: "/question-bank?subjectId=pharm",
    },
  ],
});

describe("practice goals surfaces", () => {
  it("shows the same headline and score on the ring, proof, and analytics", async () => {
    render(
      <>
        <DashboardGraphicHero
          examSlug="nclex"
          examName="NCLEX-RN"
          readinessScore={plan.readiness.score ?? 0}
          readinessSummary={null}
          dueCount={0}
          topWeakTopic={null}
          hasRecent
          practiceHeadline={plan.readiness.headline}
        />
        <ReadinessProofPanel readiness={plan.readiness} />
        <StudentAnalyticsDashboard
          examSlug="nclex"
          examName="NCLEX-RN"
          initialData={{
            dashboard: {
              headline: {
                readinessScore: 99,
                studyStreakDays: 2,
                overallAccuracy: 80,
                totalAttempts: 80,
                trendDelta: null,
                motivationalMessage: "Keep going",
              },
              accuracyTrend: [],
              weakTopics: [],
              recentTests: [],
              spacedReview: { dueCount: 0, weakDueCount: 0 },
              formatPractice: emptyFormatPracticeStats(),
            },
            profile: null,
          }}
          practice={plan.readiness}
        />
      </>
    );

    const nodes = document.querySelectorAll("[data-practice-goals]");
    expect(nodes).toHaveLength(3);
    for (const node of nodes) {
      expect(node.getAttribute("data-practice-headline")).toBe(plan.readiness.headline);
      expect(node.getAttribute("data-practice-score")).toBe(String(plan.readiness.score));
    }
    expect(plan.readiness.headline).toMatch(/^\d of 3 practice goals met$/);
    expect(document.body.textContent).toContain("A practice measure, not a pass prediction.");
    expect(document.body.textContent).not.toMatch(/you will pass|Practice progress index|national pass/i);

    const toggles = screen.getAllByRole("button", { name: /practice goals met/ });
    expect(toggles.length).toBeGreaterThanOrEqual(2);
    for (const toggle of toggles) {
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    }
    toggles[0]!.focus();
    await userEvent.keyboard(" ");
    expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByText("Coverage").length).toBeGreaterThan(0);
    await userEvent.keyboard("{Escape}");
    expect(toggles[0]).toHaveAttribute("aria-expanded", "false");
  });
});
