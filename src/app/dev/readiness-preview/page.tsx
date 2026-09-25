import { notFound } from "next/navigation";
import { ReadinessBoard } from "@/components/readiness/ReadinessBoard";
import { ReadinessCheckPlayer } from "@/components/readiness/ReadinessCheckPlayer";
import { ReadinessDashboardCard } from "@/components/readiness/ReadinessDashboardCard";
import type { ReadinessPageData } from "@/lib/learning/readiness-check/service";

export const metadata = {
  title: "Readiness preview",
  robots: { index: false, follow: false },
};

const board: ReadinessPageData = {
  examSlug: "nclex",
  fieldId: "nursing",
  length: 24,
  hasStudyAccess: true,
  mode: "result",
  examDate: "2026-09-20",
  outcome: null,
  resume: null,
  result: {
    checkId: "preview",
    overallLevel: "getting_close",
    overallLabel: "Getting close",
    summaryLine: "Getting close. A place to practice next: Pharmacological Therapies and Safety & Infection Control.",
    completedAt: "2026-09-20T12:00:00.000Z",
    kind: "retake",
    retakeDue: true,
    daysUntilSuggest: 0,
  },
  examName: "NCLEX",
  todayHref: "/question-bank?field=nursing&mode=bank&style=today&count=20",
  areas: [
    { areaId: "management-of-care", label: "Management of Care", answered: 3, correct: 3, level: "on_track", labelText: "On track", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=management-of-care&count=15" },
    { areaId: "safety-infection", label: "Safety & Infection Control", answered: 3, correct: 1, level: "not_yet", labelText: "Not yet", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=safety-infection&count=15" },
    { areaId: "health-promotion", label: "Health Promotion", answered: 3, correct: 2, level: "getting_close", labelText: "Getting close", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=health-promotion&count=15" },
    { areaId: "psychosocial", label: "Psychosocial Integrity", answered: 3, correct: 3, level: "on_track", labelText: "On track", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=psychosocial&count=15" },
    { areaId: "basic-care", label: "Basic Care & Comfort", answered: 3, correct: 3, level: "on_track", labelText: "On track", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=basic-care&count=15" },
    { areaId: "pharmacology", label: "Pharmacological Therapies", answered: 3, correct: 1, level: "not_yet", labelText: "Not yet", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=pharmacology&count=15" },
    { areaId: "risk-reduction", label: "Reduction of Risk Potential", answered: 3, correct: 3, level: "on_track", labelText: "On track", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=risk-reduction&count=15" },
    { areaId: "physiological-adaptation", label: "Physiological Adaptation", answered: 1, correct: 1, level: "insufficient", thinBank: true, labelText: "Not enough clean questions in this area yet", practiceHref: "/question-bank?field=nursing&mode=bank&blueprintArea=physiological-adaptation&count=15" },
  ],
  progress: [
    { areaId: "management-of-care", label: "Management of Care", baseline: "getting_close", latest: "on_track", movement: "up", detail: "Was Getting close · Now On track" },
    { areaId: "safety-infection", label: "Safety & Infection Control", baseline: "not_yet", latest: "not_yet", movement: "same", detail: "Still Not yet" },
    { areaId: "health-promotion", label: "Health Promotion", baseline: "not_yet", latest: "getting_close", movement: "up", detail: "Was Not yet · Now Getting close" },
    { areaId: "psychosocial", label: "Psychosocial Integrity", baseline: "on_track", latest: "on_track", movement: "same", detail: "Still On track" },
    { areaId: "basic-care", label: "Basic Care & Comfort", baseline: "insufficient", latest: "on_track", movement: "new", detail: "Now On track" },
    { areaId: "pharmacology", label: "Pharmacological Therapies", baseline: "not_yet", latest: "not_yet", movement: "same", detail: "Still Not yet" },
    { areaId: "risk-reduction", label: "Reduction of Risk Potential", baseline: "getting_close", latest: "on_track", movement: "up", detail: "Was Getting close · Now On track" },
    { areaId: "physiological-adaptation", label: "Physiological Adaptation", baseline: "insufficient", latest: "insufficient", movement: "same", detail: "Not enough data yet" },
  ],
  focus: [],
  history: [
    {
      id: "latest",
      kind: "retake",
      isBaseline: false,
      completedAt: "2026-09-20T12:00:00.000Z",
      overallLabel: "Getting close",
      summaryLine: "Getting close. A place to practice next: Pharmacological Therapies and Safety & Infection Control.",
      correctCount: 17,
      answeredCount: 22,
    },
    {
      id: "base",
      kind: "baseline",
      isBaseline: true,
      completedAt: "2026-09-02T12:00:00.000Z",
      overallLabel: "Not yet",
      summaryLine: "Not yet. A place to practice next: Pharmacological Therapies and Safety & Infection Control.",
      correctCount: 10,
      answeredCount: 24,
    },
  ],
  baselineSummary: "Not yet. A place to practice next: Pharmacological Therapies and Safety & Infection Control.",
  baselineCompletedAt: "2026-09-02T12:00:00.000Z",
  showRestart: false,
};

/** Local fixture for readiness screenshots. Not available in production. */
export default async function ReadinessPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string }>;
}) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_TOUR_PREVIEW !== "1") {
    notFound();
  }

  const screen = (await searchParams).screen ?? "all";
  const show = (id: string) => screen === "all" || screen === id;

  return (
    <main id="main-content" className="mx-auto max-w-5xl space-y-16 px-4 py-8">
      {show("card-invite") ? <section data-screen="card-invite">
        <ReadinessDashboardCard
          examSlug="nclex"
          examName="NCLEX"
          initial={{
            mode: "invite",
            length: 24,
            hasStudyAccess: true,
            examDate: null,
            outcome: null,
            resume: null,
            result: null,
          }}
        />
      </section> : null}
      {show("card-result") ? <section data-screen="card-result">
        <ReadinessDashboardCard
          examSlug="nclex"
          examName="NCLEX"
          initial={{
            mode: "result",
            length: 24,
            hasStudyAccess: true,
            examDate: "2026-09-20",
            outcome: null,
            resume: null,
            result: board.result,
          }}
        />
      </section> : null}
      {show("outcome") ? <section data-screen="outcome">
        <ReadinessDashboardCard
          examSlug="nclex"
          examName="NCLEX"
          initial={{
            mode: "outcome",
            length: 24,
            hasStudyAccess: true,
            examDate: "2026-09-20",
            outcome: null,
            resume: null,
            result: board.result,
          }}
        />
      </section> : null}
      {show("check") ? <section data-screen="check">
        <ReadinessCheckPlayer
          previewPrompt={{
            itemId: "preview-item",
            index: 8,
            total: 24,
            areaLabel: "Pharmacological Therapies",
            stem: "A client with heart failure is prescribed furosemide. Which finding should the nurse report before giving the dose?",
            vignette: "The morning potassium is 3.0 mEq/L. Lung sounds are clear. The client walked the hall with help.",
            selection: "single",
            options: [
              "Potassium 3.0 mEq/L",
              "Clear lung sounds",
              "Walked the hall with help",
              "Heart rate 78 beats per minute",
            ],
          }}
        />
      </section> : null}
      {show("results") ? <section data-screen="results">
        <ReadinessBoard data={board} />
      </section> : null}
    </main>
  );
}
