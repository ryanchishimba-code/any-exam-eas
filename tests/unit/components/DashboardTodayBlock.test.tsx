import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardTodayBlock } from "@/components/dashboard/DashboardTodayBlock";
import { buildCoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { TODAY_QBANK_COUNT, buildExamDayPlan } from "@/lib/learning/exam-day-plan";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import type { WeekCountdownPlan } from "@/lib/learning/week-countdown-plan";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/dashboard",
}));

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

const todaySet = {
  fieldId: "usmle-step-1",
  target: 25,
  questionsDone: 8,
  mixLine: "8 to review · 17 new",
  empty: false,
  limitReached: false,
  streakDays: 3,
};

describe("DashboardTodayBlock review CTA", () => {
  it("makes today's set the primary action and keeps review as a quiet link", () => {
    render(<DashboardTodayBlock plan={plan(items)} todaySet={todaySet} />);

    const start = screen.getByRole("button", { name: /Start today's set/ });
    expect(start).toHaveAttribute("data-tour", "today-start");
    expect(start.className).toContain("study-home-accent");
    expect(document.querySelector("[data-tour='today']")).not.toBeNull();
    const mix = document.querySelector("[data-today-mix]");
    expect(mix).toHaveTextContent("8 to review · 17 new");
    expect(document.querySelectorAll("[data-today-mix]")).toHaveLength(1);
    expect(screen.getByText("3-day streak")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "8 of 25 questions today" })).toBeInTheDocument();

    const review = screen.getByRole("link", { name: /Start review/ });
    expect(review).toHaveAttribute("data-tour", "review-incorrect");
    expect(review).toHaveAttribute("href", "/question-bank?style=review_incorrect");
    expect(review.className).not.toContain("study-home-accent");
    expect(review.querySelector("span.study-home-accent")).toBeNull();

    const qbank = screen.getByRole("link", { name: /Start Qbank/ });
    expect(qbank.className).not.toContain("study-home-accent");
    expect(screen.getByText("Open topic")).toBeInTheDocument();
    expect(screen.getByText("Not enough practice yet")).toBeInTheDocument();
    expect(screen.getByText(/19 of 100 answered/)).toBeInTheDocument();
  });

  it("keeps an empty review row out of the links and locks the primary action", () => {
    const { rerender } = render(
      <DashboardTodayBlock
        plan={plan(
          items.map((item) =>
            item.id === "incorrect"
              ? { ...item, href: null, title: "Review incorrect", cta: "Nothing to review" }
              : item
          )
        )}
        todaySet={todaySet}
      />
    );

    expect(screen.queryByRole("link", { name: /Nothing to review/ })).toBeNull();
    expect(screen.queryByText("Nothing to review")).toBeNull();

    rerender(<DashboardTodayBlock plan={plan(items)} todaySet={todaySet} studyLocked />);
    const locked = screen.getByRole("link", { name: /Subscribe to start/ });
    expect(locked).toHaveAttribute("data-tour", "today-start");
    expect(locked.className).toContain("study-home-accent");
    expect(screen.getByRole("link", { name: /Start review/ }).className).not.toContain(
      "study-home-accent"
    );
  });

  it("does not invent a mix when the counts were not loaded", () => {
    render(<DashboardTodayBlock plan={plan(items)} todaySet={null} />);
    expect(screen.getByText(/mix is unavailable/)).toBeInTheDocument();
    expect(screen.queryByText(/\d+ to review/)).toBeNull();
    expect(document.querySelector("[data-today-mix]")).toBeNull();
    expect(screen.queryByText(/-day streak/)).toBeNull();
  });

  it("keeps a fixed mix slot empty of counts until the served line arrives", async () => {
    let resolveFetch: (value: Response) => void = () => {};
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<DashboardTodayBlock plan={plan(items)} deferMix />);

    const slot = document.querySelector("[data-today-mix-slot]");
    expect(slot).not.toBeNull();
    expect(slot?.className).toContain("h-6");
    expect(document.querySelector("[data-today-mix-pending]")).not.toBeNull();
    expect(document.querySelector("[data-today-mix]")).toBeNull();
    expect(document.body.textContent).not.toMatch(/\d+ to review/);
    expect(screen.getByRole("button", { name: /Start today's set/ })).toBeInTheDocument();

    resolveFetch(
      new Response(
        JSON.stringify({
          mixLine: "15 to review · 10 new",
          empty: false,
          limitReached: false,
          streakDays: 0,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    expect(await screen.findByText("15 to review · 10 new")).toBeInTheDocument();
    const ready = document.querySelector("[data-today-mix-slot]");
    expect(ready?.className).toContain("h-6");
    expect(ready?.querySelector("[data-today-mix]")).toHaveTextContent("15 to review · 10 new");
    expect(document.body.textContent).not.toMatch(/25 to review/);
    vi.unstubAllGlobals();
  });

  it("shows the served mix and puts the new-question note at the top of See details", () => {
    render(
      <DashboardTodayBlock
        plan={plan(items)}
        todaySet={{ ...todaySet, mixLine: "15 to review · 10 new" }}
      />
    );

    expect(document.querySelector("[data-today-mix]")).toHaveTextContent(
      "15 to review · 10 new"
    );
    expect(document.body.textContent).not.toMatch(/25 to review/);

    const details = document.querySelector("[data-today-details]");
    const body = details?.querySelector("[data-today-details-body]");
    const note = body?.querySelector("[data-today-new-note]");
    expect(details?.querySelector("summary")?.textContent).toMatch(/See details/);
    expect(body?.firstElementChild).toBe(note);
    expect(note).toHaveTextContent(
      "You'll always see some new questions in today's set, even when you have a lot to review."
    );
    expect(note?.compareDocumentPosition(screen.getByText(/Set a target exam date/))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
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

    const start = screen.getByRole("button", { name: /Start today's set/ });
    const details = screen.getByText("See details").closest("details");
    expect(details).not.toBeNull();
    expect(start.compareDocumentPosition(details as HTMLElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(details).toContainElement(screen.getByRole("heading", { name: "Topics to practice" }));
    expect(screen.getByText(/6 weeks out/)).toBeInTheDocument();
    expect(screen.getByText(/Today's practice on Management of Care is done/)).toBeInTheDocument();
    expect(screen.getAllByText(/topics you haven't practiced yet/).length).toBeGreaterThan(0);
    const report = details?.textContent ?? "";
    expect(report).not.toMatch(/open incorrect items|coverage days|remediation days|blueprint gaps/);
    const note = details?.querySelector("[data-today-new-note]");
    const body = details?.querySelector("[data-today-details-body]");
    expect(body?.firstElementChild).toBe(note);
    expect(note).toHaveTextContent(
      "You'll always see some new questions in today's set, even when you have a lot to review."
    );
    expect(
      note?.compareDocumentPosition(screen.getByRole("heading", { name: "Topics to practice" }))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    const withoutNestedRules = details?.cloneNode(true) as HTMLElement | undefined;
    withoutNestedRules?.querySelector("details")?.remove();
    expect(withoutNestedRules?.textContent ?? "").toMatch(/always see some new questions/i);
    expect(withoutNestedRules?.textContent ?? "").toMatch(/Today's practice on Management of Care is done/);
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

    const details = document.querySelector("[data-today-details]");
    const note = details?.querySelector("[data-today-new-note]");
    expect(details?.querySelector("[data-today-details-body]")?.firstElementChild).toBe(note);
    expect(note).toHaveTextContent(
      "You'll always see some new questions in today's set, even when you have a lot to review."
    );
    expect(
      note?.compareDocumentPosition(screen.getByRole("heading", { name: "Practice exam and review" }))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    expect(screen.getByRole("heading", { name: "Practice exam and review" })).toBeInTheDocument();
    expect(screen.getByText("7 days out")).toBeInTheDocument();
    expect(screen.getAllByText("Practice exam").length).toBeGreaterThan(0);
    expect(screen.getByText("Questions to review")).toBeInTheDocument();
    const sim = screen.getByRole("link", { name: /Start exam simulation/ });
    expect(sim).toHaveAttribute("href", "/full-exam/naplex?mode=50");
    expect(sim.className).not.toContain("study-home-accent");
    expect(screen.getByRole("button", { name: /Start today's set/ })).toBeInTheDocument();
    expect(screen.getAllByText(/not a licensure result/).length).toBeGreaterThan(0);
  });
});
