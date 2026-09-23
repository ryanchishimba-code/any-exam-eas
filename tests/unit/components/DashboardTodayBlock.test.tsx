import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardTodayBlock } from "@/components/dashboard/DashboardTodayBlock";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import { dbUi } from "@/lib/study/dashboard-ui";

function plan(items: ExamDayPlan["items"]): ExamDayPlan {
  return {
    examSlug: "usmle",
    examName: "USMLE",
    fieldId: "usmle-step-1",
    testDate: "2026-12-22",
    daysUntilExam: 90,
    pacing: "90 days until USMLE.",
    questionsToday: 0,
    totalAttempts: 19,
    items,
    week: [],
    rules: ["Coverage gap ranks the Qbank row."],
    readiness: {
      visible: false,
      minSample: 100,
      bandKey: null,
      label: null,
      headline: "Not enough practice yet",
      score: null,
      coveragePct: 0,
      recentAccuracyPct: 0,
      recentWindowAttempts: 19,
      recentWindowSize: 100,
      recentWindowMinSample: 40,
      recentWindowMeasured: true,
      remediationPct: 0,
      openIncorrect: 5,
      totalAttempts: 19,
      formula: "Coverage × recent accuracy × remediation completion — not a pass prediction.",
      disclaimer:
        "This band describes saved practice on this board only. It does not predict a licensure result.",
      sampleDetail:
        "Not enough practice yet — 19 of 100 answered on this board. The proof stays hidden until then.",
      criteria: [],
      domains: [],
      leadReason: null,
      examSim: null,
    },
  };
}

const items: ExamDayPlan["items"] = [
  {
    id: "qbank",
    title: "25 Qbank questions",
    detail: "Coverage gap: Cardiovascular.",
    why: "First because Cardiovascular is an untouched high-weight domain.",
    href: "/question-bank?style=bank",
    cta: "Start Qbank",
  },
  {
    id: "incorrect",
    title: "Review 5 incorrect",
    detail: "Items you missed and have not yet answered correctly.",
    why: null,
    href: "/question-bank?style=review_incorrect",
    cta: "Start review",
  },
  {
    id: "guide",
    title: "1 guide topic",
    detail: "Cardiovascular",
    why: null,
    href: "/high-yield-topics",
    cta: "Open topic",
  },
  {
    id: "drugs",
    title: "5 drugs",
    detail: "Review 5 drugs on the USMLE list.",
    why: null,
    href: "/study/drugs300",
    cta: "Open drugs",
  },
];

describe("DashboardTodayBlock review CTA", () => {
  it("renders Start review as the same filled accent button as Today", () => {
    render(<DashboardTodayBlock plan={plan(items)} />);

    const review = screen.getByRole("link", { name: /Start review/ });
    const action = review.querySelector("span.study-home-accent");
    expect(action).not.toBeNull();
    expect(action).toHaveClass(...dbUi.primaryBtn.split(" "));
    expect(action).toHaveTextContent("Start review");
    expect(review.className).not.toContain("bg-[var(--color-accent)] ");
    expect(review).toHaveAttribute("href", "/question-bank?style=review_incorrect");

    const qbank = screen.getByRole("link", { name: /Start Qbank/ });
    expect(screen.getByText("Start Qbank").className).not.toContain("study-home-accent");
    expect(qbank).toHaveTextContent("Start Qbank");
    expect(screen.getByText("First priority")).toBeInTheDocument();
    expect(screen.getByText("Open topic")).toBeInTheDocument();
    expect(screen.getByText("Not enough practice yet")).toBeInTheDocument();
    expect(screen.getByText(/19 of 100 answered/)).toBeInTheDocument();
    expect(screen.getByText(/First because Cardiovascular/)).toBeInTheDocument();
  });

  it("keeps an empty review row as quiet text and a locked row as the filled subscribe action", () => {
    const { rerender } = render(
      <DashboardTodayBlock
        plan={plan(
          items.map((item) =>
            item.id === "incorrect"
              ? { ...item, href: null, title: "Review incorrect", cta: "Nothing to review" }
              : item
          )
        )}
      />
    );

    expect(screen.getByText("Nothing to review").className).not.toContain("study-home-accent");
    expect(screen.queryByRole("link", { name: /Nothing to review/ })).toBeNull();

    rerender(<DashboardTodayBlock plan={plan(items)} studyLocked />);
    const locked = screen.getAllByRole("link", { name: /Subscribe to start/ });
    const review = locked.find((link) => link.textContent?.includes("Review 5 incorrect"));
    expect(review?.querySelector("span.study-home-accent")).not.toBeNull();
    expect(review).toHaveTextContent("Subscribe to start");
  });
});
