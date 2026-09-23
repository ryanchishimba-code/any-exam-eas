import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardTodayBlock } from "@/components/dashboard/DashboardTodayBlock";
import { buildCoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { TODAY_QBANK_COUNT, buildExamDayPlan } from "@/lib/learning/exam-day-plan";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import type { WeekCountdownPlan } from "@/lib/learning/week-countdown-plan";
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
    weekPlan,
    coverage: buildCoverageHeatmap({ fieldId: "usmle-step-1", topics: [] }),
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

const weekPlan: WeekCountdownPlan = {
  active: false,
  weeksOut: null,
  daysUntilExam: 90,
  intensity: "unset",
  title: "Set an exam date",
  summary: "Set a target exam date. This week's plan appears once a date is saved.",
  rangeLabel: "",
  todayKind: null,
  todayLine: "",
  goals: [],
};

const items: ExamDayPlan["items"] = [
  {
    id: "qbank",
    title: "25 Qbank questions",
    detail: "Coverage gap: Cardiovascular.",
    why: "First because Cardiovascular is an untouched high-weight domain.",
    href: "/question-bank?style=bank",
    cta: "Start Qbank",
    doneToday: false,
  },
  {
    id: "incorrect",
    title: "Review 5 incorrect",
    detail: "Items you missed and have not yet answered correctly.",
    why: null,
    href: "/question-bank?style=review_incorrect",
    cta: "Start review",
    doneToday: false,
  },
  {
    id: "guide",
    title: "1 guide topic",
    detail: "Cardiovascular",
    why: null,
    href: "/high-yield-topics",
    cta: "Open topic",
    doneToday: false,
  },
  {
    id: "drugs",
    title: "5 drugs",
    detail: "Review 5 drugs on the USMLE list.",
    why: null,
    href: "/study/drugs300",
    cta: "Open drugs",
    doneToday: false,
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

describe("Dashboard week countdown", () => {
  const now = new Date("2026-09-22T15:00:00.000Z");

  it("shows this week's goals and checks the Qbank row after 25 saved answers", () => {
    const built = buildExamDayPlan({
      examSlug: "nclex",
      examName: "NCLEX-RN",
      fieldId: "nursing",
      testDate: "2026-11-03",
      now,
      totalAttempts: 18,
      recentAccuracyPct: 60,
      openIncorrect: 1,
      questionsToday: TODAY_QBANK_COUNT,
      topics: [
        {
          id: "management-of-care",
          label: "Management of Care",
          blueprintWeightPct: 20,
          attempts: 0,
          accuracyPct: null,
          coveragePct: 0,
          practiceHref: "/question-bank?subjectId=management-of-care",
          guideHref: "/dashboard/topics?topic=management-of-care",
          guideLabel: "Management of Care",
        },
      ],
    });

    render(<DashboardTodayBlock plan={built} />);

    expect(screen.getByRole("heading", { name: "Coverage and remediation" })).toBeInTheDocument();
    expect(screen.getByText(/6 weeks out/)).toBeInTheDocument();
    expect(screen.getByText(/Today's coverage block is done \(Management of Care\)/)).toBeInTheDocument();
    expect(screen.getAllByText("Done today").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Start Qbank/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Start exam simulation/ })).toBeNull();
    expect(document.body.textContent).not.toMatch(/you will pass/i);
  });

  it("puts exam simulation and incorrect drill on the week inside 14 days", () => {
    const built = buildExamDayPlan({
      examSlug: "naplex",
      examName: "NAPLEX",
      fieldId: "pharmacy",
      testDate: "2026-10-01",
      now: new Date("2026-09-24T15:00:00.000Z"),
      totalAttempts: 22,
      recentAccuracyPct: 58,
      openIncorrect: 4,
      topics: [
        {
          id: "medication-use",
          label: "Medication Use Process",
          blueprintWeightPct: 40,
          attempts: 6,
          accuracyPct: 70,
          coveragePct: 20,
          practiceHref: "/question-bank?subjectId=medication-use",
        },
      ],
    });

    render(<DashboardTodayBlock plan={built} />);

    expect(
      screen.getByRole("heading", { name: "Exam simulation and incorrect drill" })
    ).toBeInTheDocument();
    expect(screen.getByText("7 days out")).toBeInTheDocument();
    expect(screen.getAllByText("Exam simulation").length).toBeGreaterThan(0);
    expect(screen.getByText("Incorrect drill")).toBeInTheDocument();
    const sim = screen.getByRole("link", { name: /Start exam simulation/ });
    expect(sim).toHaveAttribute("href", "/full-exam/naplex?mode=50");
    expect(sim.querySelector("span.study-home-accent")).not.toBeNull();
    expect(screen.getAllByText(/not a licensure result/).length).toBeGreaterThan(0);
  });
});
