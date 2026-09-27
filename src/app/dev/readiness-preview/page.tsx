import { notFound } from "next/navigation";
import { ReadinessBoard } from "@/components/readiness/ReadinessBoard";
import { ReadinessCheckPlayer } from "@/components/readiness/ReadinessCheckPlayer";
import { ReadinessDashboardCard } from "@/components/readiness/ReadinessDashboardCard";
import { READINESS_PREVIEW_BOARD } from "./fixture";

export const metadata = {
  title: "Readiness preview",
  robots: { index: false, follow: false },
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
            result: READINESS_PREVIEW_BOARD.result,
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
            result: READINESS_PREVIEW_BOARD.result,
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
        <ReadinessBoard data={READINESS_PREVIEW_BOARD} />
      </section> : null}
    </main>
  );
}
